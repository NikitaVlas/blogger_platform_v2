import jwt from "jsonwebtoken";
import {randomUUID} from "node:crypto";

type AccessTokenPayload = {
    userId: string;
    tokenType: "access";
};

export type RefreshTokenPayload = {
    userId: string;
    tokenId: string;
    deviceId: string;
};

export type CreatedRefreshToken = {
    token: string;
    tokenId: string;
    issuedAt: Date;
    expiresAt: Date;
};

const ACCESS_TOKEN_LIFETIME_SECONDS = 10;
const REFRESH_TOKEN_LIFETIME_SECONDS = 20;

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error(
            "JWT_SECRET is not configured",
        );
    }

    return secret;
}

export const jwtService = {
    createAccessToken(userId: string): string {
        return jwt.sign(
            {
                userId,
                tokenType: "access",
            } satisfies AccessTokenPayload,
            getJwtSecret(),
            {
                expiresIn:
                ACCESS_TOKEN_LIFETIME_SECONDS,
            },
        );
    },

    createRefreshToken(
        userId: string,
        deviceId: string,
    ): CreatedRefreshToken {
        const tokenId = randomUUID();
        const issuedAt = new Date();

        const expiresAt = new Date(
            issuedAt.getTime() +
            REFRESH_TOKEN_LIFETIME_SECONDS *
            1000,
        );

        const token = jwt.sign(
            {
                userId,
                deviceId,
                tokenType: "refresh",
            },
            getJwtSecret(),
            {
                expiresIn:
                REFRESH_TOKEN_LIFETIME_SECONDS,

                // jwtid записывается в стандартное поле jti.
                jwtid: tokenId,
            },
        );

        return {
            token,
            tokenId,
            issuedAt,
            expiresAt,
        };
    },

    verifyAccessToken(
        token: string,
    ): AccessTokenPayload | null {
        try {
            const payload = jwt.verify(
                token,
                getJwtSecret(),
            );

            if (
                typeof payload === "string" ||
                typeof payload.userId !== "string" ||
                payload.tokenType !== "access"
            ) {
                return null;
            }

            return {
                userId: payload.userId,
                tokenType: "access",
            };
        } catch {
            return null;
        }
    },

    verifyRefreshToken(
        token: string,
    ): RefreshTokenPayload | null {
        try {
            const payload = jwt.verify(
                token,
                getJwtSecret(),
            );

            if (
                typeof payload === "string" ||
                typeof payload.userId !== "string" ||
                typeof payload.jti !== "string" ||
                typeof payload.deviceId !== "string" ||
                payload.tokenType !== "refresh"
            ) {
                return null;
            }

            return {
                userId: payload.userId,
                tokenId: payload.jti,
                deviceId: payload.deviceId,
            };
        } catch {
            // Сюда попадут токены:
            // - с неправильной подписью;
            // - с неправильной структурой;
            // - с истёкшим exp.
            return null;
        }
    },
};
