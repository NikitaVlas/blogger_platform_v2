import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export const basicAdminGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;
    if(!auth) {
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }

    const [authType, token] = auth.split(' ');
    if (authType !== 'Basic') {
        res.status(HttpStatus.Unauthorized)
        return
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.status(HttpStatus.Unauthorized)
        return
    }

    next();
}
