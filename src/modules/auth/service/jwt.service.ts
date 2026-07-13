import jwt from "jsonwebtoken";

type AccessTokenPayload = {
    userId: string;
};

export const jwtService = {
    createAccessToken(userId: string): string {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        return jwt.sign(
            { userId } satisfies AccessTokenPayload,
            secret,
            { expiresIn: "1h" },
        );
    },

    verifyAccessToken(token: string): AccessTokenPayload | null {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        try {
            return jwt.verify(token, secret) as AccessTokenPayload;
        } catch {
            return null;
        }
    },
};
