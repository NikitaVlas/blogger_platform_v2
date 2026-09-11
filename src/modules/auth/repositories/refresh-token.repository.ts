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

    async findActiveByTokenId(tokenId: string) {
        return refreshTokenCollection.findOne({
            tokenId,
            revokedAt: null,
            expiresAt: {$gt: new Date()},
        });
    },

    async rotate(
        tokenId: string,
        newTokenId: string,
        issuedAt: Date,
        expiresAt: Date,
    ): Promise<boolean> {
        const result = await refreshTokenCollection.updateOne(
            {tokenId, revokedAt: null, expiresAt: {$gt: new Date()}},
            {$set: {tokenId: newTokenId, issuedAt, expiresAt, lastActiveDate: issuedAt}},
        );

        return result.modifiedCount === 1;
    },

    async findActiveByUserId(userId: string) {
        return refreshTokenCollection
            .find({userId, revokedAt: null, expiresAt: {$gt: new Date()}})
            .sort({lastActiveDate: -1})
            .toArray();
    },

    async deleteAllOtherDevices(userId: string, deviceId: string): Promise<void> {
        await refreshTokenCollection.updateMany(
            {userId, deviceId: {$ne: deviceId}, revokedAt: null, expiresAt: {$gt: new Date()}},
            {$set: {revokedAt: new Date()}},
        );
    },

    async deleteDevice(userId: string, deviceId: string): Promise<"deleted" | "not-found" | "forbidden"> {
        const device = await refreshTokenCollection.findOne({deviceId});

        if (!device || device.revokedAt || device.expiresAt <= new Date()) {
            return "not-found";
        }

        if (device.userId !== userId) {
            return "forbidden";
        }

        const deleted = await this.revoke(device.tokenId);
        return deleted ? "deleted" : "not-found";
    },
};
