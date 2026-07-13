import { Request, Response } from "express";
import {
    blogCollection,
    postCollection,
    userCollection,
    commentCollection,
} from "../../../db/mongo.db";
import { HttpStatus } from "../../../core/types/http-statuses";

export const testingController = {
    async deleteAllData(
        req: Request,
        res: Response,
    ) {
        await Promise.all([
            blogCollection.deleteMany({}),
            postCollection.deleteMany({}),
            userCollection.deleteMany({}),
            commentCollection.deleteMany({}),
        ]);

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    },
};
