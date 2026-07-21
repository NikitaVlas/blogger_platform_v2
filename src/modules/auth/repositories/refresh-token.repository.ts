import { refreshTokenCollection } from "../../../db/mongo.db";
import { RefreshTokenInsertModel } from "../models/refresh-token.db-model";

export const refreshTokenRepository = {
    async create(
        session: RefreshTokenInsertModel,
    ): Promise<void> {
        await refreshTokenCollection.insertOne(session);
    },

    /**
     * Атомарно отзывает активный refresh token.
     *
     * Вернёт true только один раз.
     * Если два запроса одновременно отправят один refresh token,
     * только один из запросов сможет изменить revokedAt.
     */
    async revoke(tokenId: string): Promise<boolean> {
        const result =
            await refreshTokenCollection.updateOne(
                {
                    tokenId,
                    revokedAt: null,
                    expiresAt: {
                        $gt: new Date(),
                    },
                },
                {
                    $set: {
                        revokedAt: new Date(),
                    },
                },
            );

        return result.modifiedCount === 1;
    },
};
