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
            {userId} satisfies AccessTokenPayload,
            secret,
            {expiresIn: "1h"},
        );
    },

    verifyAccessToken(token: string): AccessTokenPayload | null {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error(
                "JWT_SECRET is not configured",
            );
        }

        try {
            const payload = jwt.verify(token, secret);

            if (
                typeof payload === "string" ||
                typeof payload.userId !== "string"
            ) {
                return null;
            }

            return {
                userId: payload.userId,
            };
        } catch {
            return null;
        }
    }
};
