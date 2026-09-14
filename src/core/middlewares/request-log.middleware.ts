import { NextFunction, Request, Response } from "express";
import { requestLogCollection } from "../../db/mongo.db";
import { HttpStatus } from "../types/http-statuses";

const REQUEST_WINDOW_MS = 10_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMITED_AUTH_PATHS = new Set([
  "/auth/login",
  "/auth/registration",
  "/auth/registration-confirmation",
  "/auth/registration-email-resending",
  "/auth/password-recovery",
  "/auth/new-password",
]);

/**
 * Records a rate-limited auth request and exposes matching requests made in
 * the preceding ten seconds through `res.locals.requestCount`.
 */
export const requestLogMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const IP = req.ip ?? req.socket.remoteAddress ?? "";
    // Match Express's default case-insensitive, non-strict routes.
    // Query parameters must not create a separate rate-limit bucket.
    const URL = req.path.replace(/\/+$/, "").toLowerCase();
    if (req.method !== "POST" || !RATE_LIMITED_AUTH_PATHS.has(URL)) {
      return next();
    }
    const date = new Date();

    const requestCount = await requestLogCollection.countDocuments({
      IP,
      URL,
      date: { $gte: new Date(date.getTime() - REQUEST_WINDOW_MS) },
    });

    await requestLogCollection.insertOne({ IP, URL, date });

    res.locals.requestCount = requestCount;

    if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
      return res.sendStatus(HttpStatus.TooManyRequests);
    }

    next();
  } catch (error) {
    next(error);
  }
};
