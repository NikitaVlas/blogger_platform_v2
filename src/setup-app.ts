import express, { Express } from "express";
import {blogsRoutes} from "./modules/blogs/routes/blogs.routes";
import {RouterPath} from "./core/Paths/Paths";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello blog!");
    });

    app.use(RouterPath.blogs, blogsRoutes);

    return app;
};
