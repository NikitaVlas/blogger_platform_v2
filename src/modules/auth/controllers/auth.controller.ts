import {authService} from "../service/auth.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import {jwtService} from "../service/jwt.service";
import {AuthRequest} from "../types/auth-request";
import { Request, Response } from "express";

export const authController = {
    async login(req: Request, res: Response) {
        const user = await authService.validateCredentials(
            req.body.loginOrEmail,
            req.body.password,
        );

        if (!user) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        const accessToken = jwtService.createAccessToken(
            user._id.toString(),
        );

        return res.status(HttpStatus.OK).send({
            accessToken,
        });
    },

    async me(req: Request, res: Response) {
        const user = (req as AuthRequest).user;

        return res.status(HttpStatus.OK).send({
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        });
    },
};
