import express from "express";
import dotenv from 'dotenv'
import { setupApp } from "./setup-app";
import {rundb} from "./db/mongo.db";

dotenv.config()

const start = async () => {
    const app = express();
    setupApp(app);

    const port = process.env.PORT || 3000;
    const mongoUri = process.env.MONGO_URI;

    await app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });

    if (!mongoUri) {
        console.warn('MONGO_URI is not defined. Server started without MongoDB connection.');
        return;
    }

    try {
        await rundb(mongoUri);
    } catch (error) {
        console.error('MongoDB connection failed. Server is running without database access.', error);
    }
};

start()
