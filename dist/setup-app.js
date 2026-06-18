"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const blogs_routes_1 = require("./modules/blogs/routes/blogs.routes");
const Paths_1 = require("./core/Paths/Paths");
const setupApp = (app) => {
    app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello blog!!!");
    });
    app.use(Paths_1.RouterPath.blogs, blogs_routes_1.blogsRoutes);
    return app;
};
exports.setupApp = setupApp;
