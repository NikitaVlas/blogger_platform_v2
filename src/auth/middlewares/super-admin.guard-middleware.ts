import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";

export const basicAdminGuardMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Basic" || !token) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const credentials = Buffer
        .from(token, "base64")
        .toString("utf-8");

    const separatorIndex = credentials.indexOf(":");

    if (separatorIndex === -1) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const username = credentials.slice(0, separatorIndex);
    const password = credentials.slice(separatorIndex + 1);

    if (
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    return next();
};
