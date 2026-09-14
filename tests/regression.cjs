const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const root = require("../dist/composition-root/container");
const db = require("../dist/db/mongo.db");
const { setupApp } = require("../dist/setup-app");
const {
  BlogController,
} = require("../dist/modules/blogs/controllers/blog.controller");
const { BlogsService } = require("../dist/modules/blogs/service/blogs.service");
const {
  BlogsRepository,
} = require("../dist/modules/blogs/repositories/blogs.repository");
const { EmailAdapter } = require("../dist/modules/auth/adapters/email.adapter");
let sent = [],
  logs = [],
  user;
// Replace external boundaries; real controllers, services, validators and routing remain active.
nodemailer.createTransport = () => ({
  sendMail: async (mail) => {
    sent.push(mail);
    return { accepted: [mail.to] };
  },
});
Object.assign(process.env, {
  NODE_ENV: "test",
  ADMIN_USERNAME: "test",
  ADMIN_PASSWORD: "test",
  JWT_SECRET: "regression-test-secret",
  SMTP_HOST: "smtp.example.test",
  SMTP_PORT: "465",
  SMTP_SECURE: "true",
  SMTP_USER: "test",
  SMTP_PASSWORD: "test",
  EMAIL_FROM: "test@example.test",
});
root.usersRepository.findByLogin = async (login) =>
  user?.login === login ? user : null;
root.usersRepository.findByEmail = async (email) =>
  user?.email === email ? user : null;
root.usersRepository.findByLoginOrEmail = async (value) =>
  user && [user.login, user.email].includes(value) ? user : null;
root.usersRepository.findById = async () => user;
root.usersRepository.create = async (data) => {
  user = { ...data, _id: new ObjectId() };
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
root.usersRepository.findAll = async () => ({
  pagesCount: 1,
  page: 1,
  pageSize: 10,
  totalCount: user ? 1 : 0,
  items: user
    ? [{ id: user._id.toString(), login: user.login, email: user.email }]
    : [],
});
root.usersRepository.setRecoveryCode = async (_, code, date) => {
  user.passwordRecovery = { recoveryCode: code, expirationDate: date };
  return true;
};
root.usersRepository.updatePasswordByRecoveryCode = async (code, hash) => {
  if (
    user.passwordRecovery.recoveryCode !== code ||
    user.passwordRecovery.expirationDate <= new Date()
  )
    return false;
  user.passwordHash = hash;
  user.passwordRecovery = { recoveryCode: null, expirationDate: null };
  return true;
};
root.refreshTokenRepository.create = async () => {};
root.emailAdapter.sendPasswordRecoveryEmail = async (email, code) => {
  // Exercise the actual HTML adapter with SMTP stubbed, even under the test runner.
  const mode = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    await new EmailAdapter().sendPasswordRecoveryEmail(email, code);
  } finally {
    process.env.NODE_ENV = mode;
  }
};
db.requestLogCollection = {
  countDocuments: async (q) =>
    logs.filter(
      (e) => e.IP === q.IP && e.URL === q.URL && e.date >= q.date.$gte,
    ).length,
  insertOne: async (e) => logs.push(e),
};
const app = express();
app.use(
  require("../dist/core/middlewares/request-log.middleware")
    .requestLogMiddleware,
);
setupApp(app);
const admin = (method, url) => request(app)[method](url).auth("test", "test");
(async () => {
  assert.equal(root.container.get(BlogController), root.blogController);
  assert.equal(root.blogController.service, root.container.get(BlogsService));
  assert.equal(
    root.blogController.service.blogsRepository,
    root.container.get(BlogsRepository),
  );
  const demo = root.createBlogContainer(root.postService);
  assert.equal(
    demo.resolve(root.BlogTokens.controller).service,
    demo.resolve(root.BlogTokens.service),
  );
  await admin("post", "/users")
    .send({
      login: "tester",
      email: "First.Last+homework@gmail.com",
      password: "oldpassword",
    })
    .expect(201);
  await admin("get", "/users").expect(200);
  await request(app)
    .post("/auth/password-recovery")
    .send({ email: user.email })
    .expect(204);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, user.email);
  const code = new URL(
    sent[0].html.match(/href="([^"]+)"/)[1],
  ).searchParams.get("recoveryCode");
  assert.equal(code, user.passwordRecovery.recoveryCode);
  await request(app)
    .post("/auth/new-password")
    .send({ newPassword: "x", recoveryCode: code })
    .expect(400);
  await request(app)
    .post("/auth/new-password")
    .send({ newPassword: "newpassword", recoveryCode: code })
    .expect(204);
  assert(await bcrypt.compare("newpassword", user.passwordHash));
  await request(app)
    .post("/auth/new-password")
    .send({ newPassword: "otherpassword", recoveryCode: code })
    .expect(400);
  await request(app)
    .post("/auth/login")
    .send({ loginOrEmail: user.email, password: "oldpassword" })
    .expect(401);
  await request(app)
    .post("/auth/login")
    .send({ loginOrEmail: user.email, password: "newpassword" })
    .expect(200);
  await request(app)
    .post("/auth/password-recovery")
    .send({ email: "missing@example.com" })
    .expect(204);
  assert.equal(sent.length, 1);
  for (const [url, body, status] of [
    ["/auth/password-recovery", { email: "missing@example.com" }, 204],
    [
      "/auth/new-password",
      { newPassword: "newpassword", recoveryCode: "invalid" },
      400,
    ],
  ]) {
    logs = [];
    for (let i = 0; i < 5; i++)
      await request(app).post(url).send(body).expect(status);
    await request(app).post(url).send(body).expect(429);
    logs.forEach((e) => (e.date = new Date(Date.now() - 11000)));
    await request(app).post(url).send(body).expect(status);
  }
  logs = [];
  root.postService.findAll = async () => ({ items: [] });
  root.postService.findById = async () => null;
  root.commentsService.findById = async () => null;
  await request(app).get("/posts").expect(200);
  await request(app).get("/posts/507f1f77bcf86cd799439011").expect(404);
  await request(app)
    .get("/posts/507f1f77bcf86cd799439011/comments")
    .expect(404);
  await request(app).get("/comments/507f1f77bcf86cd799439011").expect(404);
  // Every registered class controller method must retain its instance as an Express callback.
  for (const router of [
    require("../dist/modules/posts/routes/posts.routes").postsRoutes,
    require("../dist/modules/comments/routes/comments.routes").commentsRoutes,
    require("../dist/modules/auth/routes/auth.routes").authRoutes,
  ])
    for (const layer of router.stack) {
      if (layer.route)
        assert(layer.route.stack.at(-1).handle.name.startsWith("bound "));
    }
  console.log(
    "PASS: shared DI, custom container, class routes, email preservation/link, password change, single-use code, logins and rate limits",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
