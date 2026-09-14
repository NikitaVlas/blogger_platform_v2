import { Request, Response } from "express";
import {
    blogCollection,
    postCollection,
    userCollection,
    commentCollection, refreshTokenCollection, requestLogCollection,
} from "../../../db/mongo.db";
import { HttpStatus } from "../../../core/types/http-statuses";

export class TestingController {
    async deleteAllData(
        req: Request,
        res: Response,
    ) {
        await Promise.all([
            blogCollection.deleteMany({}),
            postCollection.deleteMany({}),
            userCollection.deleteMany({}),
            commentCollection.deleteMany({}),
            refreshTokenCollection.deleteMany({}),
            requestLogCollection.deleteMany({}),
        ]);

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    }
}

export const testingController = new TestingController();
