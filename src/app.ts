import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { setupApp } from "./setup-app";
import { rundb } from "./db/mongo.db";
import { requestLogMiddleware } from "./core/middlewares/request-log.middleware";
import "./composition-root/container";

dotenv.config();

export const app = express();

app.set("trust proxy", true);

let databaseConnection: Promise<void> | null = null;

export const ensureDatabaseConnection = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined");
    }

    if (!databaseConnection) {
        databaseConnection = rundb(mongoUri).catch((error) => {
            databaseConnection = null;
            throw error;
        });
    }

    await databaseConnection;
};

app.use(async (_req: Request, res: Response, next: NextFunction) => {
    try {
        await ensureDatabaseConnection();
        next();
    } catch (error) {
        console.error("Database connection failed", error);
        res.status(500).send({
            error: "Database connection failed",
        });
    }
});

app.use(requestLogMiddleware);

setupApp(app);

export default app;
