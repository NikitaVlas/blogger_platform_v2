import {authService} from "../service/auth.service";
import {HttpStatus} from "../../../core/types/http-statuses";
import {AuthRequest} from "../types/auth-request";
import { Request, Response } from "express";
import {LoginSuccessViewModel} from "../models/login-success.view-model";
import {MeViewModel} from "../models/me.view-model";
import {registrationService} from "../service/registration.service";
import {UserInputModel} from "../../users/models/user.input-model";
import {RegistrationConfirmationCodeModel} from "../models/registration-confirmation-code-model";
import {RegistrationEmailResending} from "../models/registration-email-resending";
import {APIErrorResult } from "../../../core/types/api-error-result";
import { authSessionService } from "../service/auth-session.service";
import {
    clearRefreshTokenCookieOptions,
    REFRESH_TOKEN_COOKIE_NAME,
    refreshTokenCookieOptions,
} from "../helpers/refresh-token.cookie";

export const authController = {
    async login(req: Request, res: Response<LoginSuccessViewModel>) {
        const user =
            await authService.validateCredentials(
                req.body.loginOrEmail,
                req.body.password,
            );

        if (!user) {
            return res.sendStatus(
                HttpStatus.Unauthorized,
            );
        }

        const tokens =
            await authSessionService.createTokenPair(
                user._id.toString(),
                req.headers["user-agent"] || "Unknown device",
                req.ip ?? req.socket.remoteAddress ?? "",
            );

        res.cookie(
            REFRESH_TOKEN_COOKIE_NAME,
            tokens.refreshToken,
            refreshTokenCookieOptions,
        );

        return res.status(HttpStatus.OK).send({
            accessToken: tokens.accessToken,
        });
    },

    async refreshToken(req: Request, res: Response<LoginSuccessViewModel>) {
        const refreshToken =
            req.cookies?.[
                REFRESH_TOKEN_COOKIE_NAME
                ];

        if (
            typeof refreshToken !== "string" ||
            !refreshToken
        ) {
            return res.sendStatus(
                HttpStatus.Unauthorized,
            );
        }

        const tokens =
            await authSessionService.refresh(
                refreshToken,
            );

        if (!tokens) {
            return res.sendStatus(
                HttpStatus.Unauthorized,
            );
        }

        res.cookie(
            REFRESH_TOKEN_COOKIE_NAME,
            tokens.refreshToken,
            refreshTokenCookieOptions,
        );

        return res.status(HttpStatus.OK).send({
            accessToken: tokens.accessToken,
        });
    },

    async logout(req: Request, res: Response) {
        const refreshToken =
            req.cookies?.[
                REFRESH_TOKEN_COOKIE_NAME
                ];

        if (
            typeof refreshToken !== "string" ||
            !refreshToken
        ) {
            return res.sendStatus(
                HttpStatus.Unauthorized,
            );
        }

        const revoked =
            await authSessionService.logout(
                refreshToken,
            );

        if (!revoked) {
            return res.sendStatus(
                HttpStatus.Unauthorized,
            );
        }

        res.clearCookie(
            REFRESH_TOKEN_COOKIE_NAME,
            clearRefreshTokenCookieOptions,
        );

        return res.sendStatus(
            HttpStatus.NoContent,
        );
    },

    async me(req: Request, res: Response<MeViewModel>) {
        const user = (req as AuthRequest).user;

        return res.status(HttpStatus.OK).send({
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        });
    },

    async getDevices(req: Request, res: Response) {
        const devices = await authSessionService.getActiveDevices(req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]);

        if (!devices) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        return res.status(HttpStatus.OK).send(devices.map((device) => ({
            ip: device.ip,
            title: device.deviceName,
            lastActiveDate: device.lastActiveDate.toISOString(),
            deviceId: device.deviceId,
        })));
    },

    async deleteAllOtherDevices(req: Request, res: Response) {
        const deleted = await authSessionService.deleteAllOtherDevices(req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]);

        return deleted
            ? res.sendStatus(HttpStatus.NoContent)
            : res.sendStatus(HttpStatus.Unauthorized);
    },

    async deleteDevice(req: Request<{deviceId: string}>, res: Response) {
        const result = await authSessionService.deleteDevice(
            req.cookies?.[REFRESH_TOKEN_COOKIE_NAME],
            req.params.deviceId,
        );

        if (result === "unauthorized") return res.sendStatus(HttpStatus.Unauthorized);
        if (result === "forbidden") return res.sendStatus(HttpStatus.Forbidden);
        if (result === "not-found") return res.sendStatus(HttpStatus.NotFound);

        return res.sendStatus(HttpStatus.NoContent);
    },

    async registration(
        req: Request<
            {},
            {},
            UserInputModel
        >,
        res: Response<APIErrorResult >,
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
            APIErrorResult  | void
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
            APIErrorResult | void
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
