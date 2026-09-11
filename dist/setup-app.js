"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const Paths_1 = require("./core/Paths/Paths");
const blogs_routes_1 = require("./modules/blogs/routes/blogs.routes");
const posts_routes_1 = require("./modules/posts/routes/posts.routes");
const users_routes_1 = require("./modules/users/routes/users.routes");
const auth_routes_1 = require("./modules/auth/routes/auth.routes");
const comments_routes_1 = require("./modules/comments/routes/comments.routes");
const testing_routes_1 = require("./modules/testing/routes/testing.routes");
const security_routes_1 = require("./modules/security/routes/security.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const setupApp = (app) => {
    app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
    app.use((0, cookie_parser_1.default)());
    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello blog!!!");
    });
    app.use(Paths_1.RouterPath.blogs, blogs_routes_1.blogsRoutes);
    app.use(Paths_1.RouterPath.posts, posts_routes_1.postsRoutes);
    app.use(Paths_1.RouterPath.users, users_routes_1.usersRoutes);
    app.use(Paths_1.RouterPath.auth, auth_routes_1.authRoutes);
    app.use(Paths_1.RouterPath.comments, comments_routes_1.commentsRoutes);
    app.use(Paths_1.RouterPath.testing, testing_routes_1.testingRoutes);
    app.use(Paths_1.RouterPath.security, security_routes_1.securityRoutes);
    return app;
};
exports.setupApp = setupApp;
