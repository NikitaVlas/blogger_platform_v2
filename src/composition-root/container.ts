import "reflect-metadata";
import { Container } from "inversify";
import { SimpleContainer } from "../core/di/simple-container";
import { BlogsRepository } from "../modules/blogs/repositories/blogs.repository";
import { BlogsService } from "../modules/blogs/service/blogs.service";
import { blogController } from "../modules/blogs/controllers/blog.controller";

export const BlogTokens = {
    repository: Symbol("BlogRepository"),
    service: Symbol("BlogService"),
    controller: Symbol("BlogController"),
};

// Учебный контейнер: показывает жизненный цикл singleton без сторонней библиотеки.
export const blogContainer = new SimpleContainer();
blogContainer.registerSingleton(BlogTokens.repository, () => new BlogsRepository());
blogContainer.registerSingleton(BlogTokens.service, () => new BlogsService(blogContainer.resolve(BlogTokens.repository)));
blogContainer.registerSingleton(BlogTokens.controller, () => blogController);

// Единый контейнер приложения для постепенной миграции провайдеров на Inversify.
export const container = new Container();
container.bind(BlogTokens.repository).toConstantValue(blogContainer.resolve(BlogTokens.repository));
container.bind(BlogTokens.service).toConstantValue(blogContainer.resolve(BlogTokens.service));
container.bind(BlogTokens.controller).toConstantValue(blogContainer.resolve(BlogTokens.controller));
