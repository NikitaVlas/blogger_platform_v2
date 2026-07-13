import express from "express";
import dotenv from 'dotenv'
import { setupApp } from "./setup-app";
import {rundb} from "./db/mongo.db";

dotenv.config()

const start = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error(
            "MONGO_URI is not defined",
        );
    }

    await rundb(mongoUri);

    const app = express();
    setupApp(app);

    const port =
        Number(process.env.PORT) || 3000;

    app.listen(port, () => {
        console.log(
            `Application listening on port ${port}`,
        );
    });
};

start().catch((error) => {
    console.error("Application startup failed", error);

    process.exit(1);
});
