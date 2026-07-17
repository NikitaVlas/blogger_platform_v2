import {authService} from "../service/auth.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import {jwtService} from "../service/jwt.service";
import {AuthRequest} from "../types/auth-request";
import { Request, Response } from "express";
import {LoginSuccessViewModel} from "../models/login-success.view-model";
import {MeViewModel} from "../models/me.view-model";
import {registrationService} from "../service/registration.service";
import {UserInputModel} from "../../users/models/user.input-model";
import {RegistrationConfirmationCodeModel} from "../models/registration-confirmation-code-model";
import {RegistrationEmailResending} from "../models/registration-email-resending";
import {ApiErrorResult} from "../../../core/types/api-error-result";

export const authController = {
    async login(req: Request, res: Response<LoginSuccessViewModel>) {
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

    async me(req: Request, res: Response<MeViewModel>) {
        const user = (req as AuthRequest).user;

        return res.status(HttpStatus.OK).send({
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        });
    },

    async registration(
        req: Request<
            {},
            {},
            UserInputModel
        >,
        res: Response<ApiErrorResult>,
    ) {
        const result =
            await registrationService
                .register(req.body);

        if (
            result.status ===
            "login-not-unique"
        ) {
            return res
                .status(HttpStatus.BadRequest)
                .send({
                    errorsMessages: [
                        {
                            field: "login",
                            message:
                                "Login must be unique",
                        },
                    ],
                });
        }

        if (
            result.status ===
            "email-not-unique"
        ) {
            return res
                .status(HttpStatus.BadRequest)
                .send({
                    errorsMessages: [
                        {
                            field: "email",
                            message:
                                "Email must be unique",
                        },
                    ],
                });
        }

        if (
            result.status ===
            "email-send-error"
        ) {
            return res.sendStatus(
                HttpStatus.InternalServerError,
            );
        }

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    },

    async registrationConfirmation(
        req: Request<
            {},
            {},
            RegistrationConfirmationCodeModel
        >,
        res: Response<
            ApiErrorResult | void
        >,
    ) {
        const result =
            await registrationService
                .confirmRegistration(
                    req.body.code,
                );

        if (
            result.status ===
            "invalid-code"
        ) {
            return res
                .status(HttpStatus.BadRequest)
                .send({
                    errorsMessages: [
                        {
                            field: "code",
                            message:
                                "Confirmation code is incorrect, expired or already applied",
                        },
                    ],
                });
        }

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    },

    async registrationEmailResending(
        req: Request<
            {},
            {},
            RegistrationEmailResending
        >,
        res: Response<
            ApiErrorResult | void
        >,
    ) {
        const result =
            await registrationService
                .resendConfirmationEmail(
                    req.body.email,
                );

        if (
            result.status ===
            "email-not-found"
        ) {
            return res
                .status(HttpStatus.BadRequest)
                .send({
                    errorsMessages: [
                        {
                            field: "email",
                            message:
                                "User with this email does not exist",
                        },
                    ],
                });
        }

        if (
            result.status ===
            "already-confirmed"
        ) {
            return res
                .status(HttpStatus.BadRequest)
                .send({
                    errorsMessages: [
                        {
                            field: "email",
                            message:
                                "Email is already confirmed",
                        },
                    ],
                });
        }

        if (
            result.status ===
            "email-send-error"
        ) {
            return res.sendStatus(
                HttpStatus.InternalServerError,
            );
        }

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    },
};
