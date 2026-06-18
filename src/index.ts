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

    if(!mongoUri) throw new Error('MONGO_URI is not defined')

    await rundb(mongoUri);

    await app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

start()
