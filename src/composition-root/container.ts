import "reflect-metadata";
import { Container } from "inversify";
import { SimpleContainer } from "../core/di/simple-container";
import { EmailAdapter } from "../modules/auth/adapters/email.adapter";
import { AuthController } from "../modules/auth/controllers/auth.controller";
import { RefreshTokenRepository } from "../modules/auth/repositories/refresh-token.repository";
import { AuthSessionService } from "../modules/auth/service/auth-session.service";
import { AuthService } from "../modules/auth/service/auth.service";
import { JwtService } from "../modules/auth/service/jwt.service";
import { RegistrationService } from "../modules/auth/service/registration.service";
import { BlogController } from "../modules/blogs/controllers/blog.controller";
import { BlogsRepository } from "../modules/blogs/repositories/blogs.repository";
import { BlogsService } from "../modules/blogs/service/blogs.service";
import { CommentsController } from "../modules/comments/controllers/comments.controller";
import { CommentsRepository } from "../modules/comments/repositories/comments.repository";
import { CommentsService } from "../modules/comments/services/comments.service";
import { PostsController } from "../modules/posts/contrillers/post.controller";
import { PostRepository } from "../modules/posts/repositories/post.repository";
import { PostsService } from "../modules/posts/service/post.service";
import { TestingController } from "../modules/testing/controllers/testing.controller";
import { UsersController } from "../modules/users/controllers/users.controller";
import { UsersRepository } from "../modules/users/repositories/users.repository";
import { UsersService } from "../modules/users/service/users.service";

export const container = new Container();
container
  .bind(EmailAdapter)
  .toDynamicValue((ctx) => new EmailAdapter())
  .inSingletonScope();
container
  .bind(AuthController)
  .toDynamicValue(
    (ctx) =>
      new AuthController(
        ctx.container.get(EmailAdapter),
        ctx.container.get(AuthSessionService),
        ctx.container.get(AuthService),
        ctx.container.get(RegistrationService),
      ),
  )
  .inSingletonScope();
container
  .bind(RefreshTokenRepository)
  .toDynamicValue((ctx) => new RefreshTokenRepository())
  .inSingletonScope();
container
  .bind(AuthSessionService)
  .toDynamicValue(
    (ctx) =>
      new AuthSessionService(
        ctx.container.get(RefreshTokenRepository),
        ctx.container.get(JwtService),
        ctx.container.get(UsersRepository),
      ),
  )
  .inSingletonScope();
container
  .bind(AuthService)
  .toDynamicValue((ctx) => new AuthService(ctx.container.get(UsersRepository)))
  .inSingletonScope();
container
  .bind(JwtService)
  .toDynamicValue((ctx) => new JwtService())
  .inSingletonScope();
container
  .bind(RegistrationService)
  .toDynamicValue(
    (ctx) =>
      new RegistrationService(
        ctx.container.get(EmailAdapter),
        ctx.container.get(UsersRepository),
      ),
  )
  .inSingletonScope();
container
  .bind(BlogController)
  .toDynamicValue(
    (ctx) =>
      new BlogController(
        ctx.container.get(BlogsService),
        ctx.container.get(PostsService),
      ),
  )
  .inSingletonScope();
container
  .bind(BlogsRepository)
  .toDynamicValue((ctx) => new BlogsRepository())
  .inSingletonScope();
container
  .bind(BlogsService)
  .toDynamicValue((ctx) => new BlogsService(ctx.container.get(BlogsRepository)))
  .inSingletonScope();
container
  .bind(CommentsController)
  .toDynamicValue(
    (ctx) =>
      new CommentsController(
        ctx.container.get(CommentsService),
        ctx.container.get(PostsService),
      ),
  )
  .inSingletonScope();
container
  .bind(CommentsRepository)
  .toDynamicValue((ctx) => new CommentsRepository())
  .inSingletonScope();
container
  .bind(CommentsService)
  .toDynamicValue(
    (ctx) => new CommentsService(ctx.container.get(CommentsRepository)),
  )
  .inSingletonScope();
container
  .bind(PostsController)
  .toDynamicValue((ctx) => new PostsController(ctx.container.get(PostsService)))
  .inSingletonScope();
container
  .bind(PostRepository)
  .toDynamicValue((ctx) => new PostRepository())
  .inSingletonScope();
container
  .bind(PostsService)
  .toDynamicValue((ctx) => new PostsService(ctx.container.get(PostRepository)))
  .inSingletonScope();
container
  .bind(TestingController)
  .toDynamicValue((ctx) => new TestingController())
  .inSingletonScope();
container
  .bind(UsersController)
  .toDynamicValue((ctx) => new UsersController(ctx.container.get(UsersService)))
  .inSingletonScope();
container
  .bind(UsersRepository)
  .toDynamicValue((ctx) => new UsersRepository())
  .inSingletonScope();
container
  .bind(UsersService)
  .toDynamicValue((ctx) => new UsersService(ctx.container.get(UsersRepository)))
  .inSingletonScope();
export const emailAdapter = container.get(EmailAdapter);
export const authController = container.get(AuthController);
export const refreshTokenRepository = container.get(RefreshTokenRepository);
export const authSessionService = container.get(AuthSessionService);
export const authService = container.get(AuthService);
export const jwtService = container.get(JwtService);
export const registrationService = container.get(RegistrationService);
export const blogController = container.get(BlogController);
export const blogsRepository = container.get(BlogsRepository);
export const blogsService = container.get(BlogsService);
export const commentsController = container.get(CommentsController);
export const commentsRepository = container.get(CommentsRepository);
export const commentsService = container.get(CommentsService);
export const postController = container.get(PostsController);
export const postRepository = container.get(PostRepository);
export const postService = container.get(PostsService);
export const testingController = container.get(TestingController);
export const usersController = container.get(UsersController);
export const usersRepository = container.get(UsersRepository);
export const usersService = container.get(UsersService);

// Independent educational example; production routes use the shared Inversify container.
export function createBlogContainer(posts: PostsService) {
  const demo = new SimpleContainer();
  demo.registerSingleton(BlogTokens.repository, () => new BlogsRepository());
  demo.registerSingleton(
    BlogTokens.service,
    () =>
      new BlogsService(demo.resolve<BlogsRepository>(BlogTokens.repository)),
  );
  demo.registerSingleton(
    BlogTokens.controller,
    () =>
      new BlogController(demo.resolve<BlogsService>(BlogTokens.service), posts),
  );
  return demo;
}
export const BlogTokens = {
  repository: Symbol("BlogsRepository"),
  service: Symbol("BlogsService"),
  controller: Symbol("BlogController"),
};
