import express, { Express } from "express";
import {RouterPath} from "./core/Paths/Paths";
import {blogsRoutes} from "./modules/blogs/routes/blogs.routes";
import {postsRoutes} from "./modules/posts/routes/posts.routes";
import {usersRoutes} from "./modules/users/routes/users.routes";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello blog!!!");
    });

    app.use(RouterPath.blogs, blogsRoutes);
    app.use(RouterPath.posts, postsRoutes);
    app.use(RouterPath.users, usersRoutes);

    return app;
};
