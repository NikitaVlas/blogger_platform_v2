import express, { Express } from "express";
import {RouterPath} from "./core/Paths/Paths";
import {blogsRoutes} from "./modules/blogs/routes/blogs.routes";
import {postsRoutes} from "./modules/posts/routes/posts.routes";
import {usersRoutes} from "./modules/users/routes/users.routes";
import {authRoutes} from "./modules/auth/routes/auth.routes";
import {commentsRoutes} from "./modules/comments/routes/comments.routes";
import {testingRoutes} from "./modules/testing/routes/testing.routes";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello blog!!!");
    });

    app.use(RouterPath.blogs, blogsRoutes);
    app.use(RouterPath.posts, postsRoutes);
    app.use(RouterPath.users, usersRoutes);
    app.use(RouterPath.auth, authRoutes);
    app.use(RouterPath.comments, commentsRoutes);
    app.use(RouterPath.testing, testingRoutes);

    return app;
};
