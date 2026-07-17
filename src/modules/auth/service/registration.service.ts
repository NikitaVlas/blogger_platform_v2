import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { usersRepository } from "../../users/repositories/users.repository";
import { UserInputModel } from "../../users/models/user.input-model";
import { emailAdapter } from "../adapters/email.adapter";
import {MongoServerError} from "mongodb";

type RegistrationResult =
    | { status: "success" }
    | { status: "login-not-unique" }
    | { status: "email-not-unique" }
    | { status: "email-send-error" };

type ConfirmationResult =
    | { status: "success" }
    | { status: "invalid-code" };

type ResendingResult =
    | { status: "success" }
    | { status: "email-not-found" }
    | { status: "already-confirmed" }
    | { status: "email-send-error" };

function createExpirationDate(): Date {
    const expirationDate = new Date();

    expirationDate.setHours(
        expirationDate.getHours() + 1,
    );

    return expirationDate;
}

export const registrationService = {
    async register(
        input: UserInputModel,
    ): Promise<RegistrationResult> {
        const userWithLogin =
            await usersRepository.findByLogin(
                input.login,
            );

        if (userWithLogin) {
            return {
                status: "login-not-unique",
            };
        }

        const userWithEmail =
            await usersRepository.findByEmail(
                input.email,
            );

        if (userWithEmail) {
            return {
                status: "email-not-unique",
            };
        }

        const passwordHash =
            await bcrypt.hash(
                input.password,
                10,
            );

        const confirmationCode =
            randomUUID();

        const expirationDate =
            createExpirationDate();

        try {
            await usersRepository.create({
                login: input.login,
                email: input.email,
                passwordHash,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode,
                    expirationDate,
                    isConfirmed: false,
                },
            });
        } catch (error: unknown) {
            if (
                error instanceof
                MongoServerError &&
                error.code === 11000
            ) {
                const duplicatedField =
                    Object.keys(
                        error.keyPattern ?? {},
                    )[0];

                if (
                    duplicatedField ===
                    "login"
                ) {
                    return {
                        status:
                            "login-not-unique",
                    };
                }

                if (
                    duplicatedField ===
                    "email"
                ) {
                    return {
                        status:
                            "email-not-unique",
                    };
                }
            }

            throw error;
        }

        try {
            await emailAdapter
                .sendRegistrationEmail(
                    input.email,
                    confirmationCode,
                );
        } catch (error: unknown) {
            console.error(
                "Registration email sending failed",
                error,
            );

            return {
                status:
                    "email-send-error",
            };
        }

        return {
            status: "success",
        };
    },

    async confirmRegistration(
        code: string,
    ): Promise<ConfirmationResult> {
        const confirmed =
            await usersRepository
                .confirmEmail(code);

        if (!confirmed) {
            return {
                status: "invalid-code",
            };
        }

        return {
            status: "success",
        };
    },

    async resendConfirmationEmail(
        email: string,
    ): Promise<ResendingResult> {
        const user =
            await usersRepository
                .findByEmail(email);

        if (!user) {
            return {
                status: "email-not-found",
            };
        }

        if (
            user.emailConfirmation
                .isConfirmed
        ) {
            return {
                status:
                    "already-confirmed",
            };
        }

        const confirmationCode =
            randomUUID();

        const expirationDate =
            createExpirationDate();

        const updated =
            await usersRepository
                .updateConfirmationCode(
                    user._id,
                    confirmationCode,
                    expirationDate,
                );

        if (!updated) {
            return {
                status:
                    "already-confirmed",
            };
        }

        try {
            await emailAdapter
                .sendRegistrationEmail(
                    user.email,
                    confirmationCode,
                );
        } catch (error: unknown) {
            console.error(
                "Registration email resending failed",
                error,
            );

            return {
                status:
                    "email-send-error",
            };
        }

        return {
            status: "success",
        };
    },
};
