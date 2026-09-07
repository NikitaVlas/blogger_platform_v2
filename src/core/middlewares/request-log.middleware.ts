import { NextFunction, Request, Response } from "express";
import { requestLogCollection } from "../../db/mongo.db";

const REQUEST_WINDOW_MS = 10_000;

/**
 * Records an API request and exposes the number of matching requests made in
 * the preceding ten seconds through `res.locals.requestCount`.
 */
export const requestLogMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const IP = req.ip ?? req.socket.remoteAddress ?? "";
        const URL = req.originalUrl;
        const date = new Date();

        const requestCount = await requestLogCollection.countDocuments({
            IP,
            URL,
            date: {$gte: new Date(date.getTime() - REQUEST_WINDOW_MS)},
        });

        await requestLogCollection.insertOne({IP, URL, date});

        res.locals.requestCount = requestCount;
        next();
    } catch (error) {
        next(error);
    }
};
