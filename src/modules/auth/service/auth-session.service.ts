import { jwtService } from "./jwt.service";
import { refreshTokenRepository } from "../repositories/refresh-token.repository";
import { usersRepository } from "../../users/repositories/users.repository";
import { randomUUID } from "node:crypto";

export type TokenPair = {
    accessToken: string;
    refreshToken: string;
};

export const authSessionService = {
    /**
     * Создаёт пару токенов и сохраняет refresh-сессию.
     */
    async createTokenPair(
        userId: string,
        deviceName: string,
        ip: string,
        deviceId = randomUUID(),
    ): Promise<TokenPair> {
        const accessToken =
            jwtService.createAccessToken(userId);

        const createdRefreshToken =
            jwtService.createRefreshToken(userId, deviceId);

        await refreshTokenRepository.create({
            userId,
            tokenId: createdRefreshToken.tokenId,
            deviceId,
            deviceName,
            ip,
            issuedAt: createdRefreshToken.issuedAt,
            lastActiveDate: createdRefreshToken.issuedAt,
            expiresAt:
            createdRefreshToken.expiresAt,
            revokedAt: null,
        });

        return {
            accessToken,
            refreshToken:
            createdRefreshToken.token,
        };
    },

    /**
     * Отзывает старый refresh token и создаёт новую пару.
     */
    async refresh(
        refreshToken: string,
    ): Promise<TokenPair | null> {
        const payload =
            jwtService.verifyRefreshToken(
                refreshToken,
            );

        if (!payload) {
            return null;
        }

        // Проверяем, что пользователь ещё существует.
        const user =
            await usersRepository.findById(
                payload.userId,
            );

        if (!user) {
            return null;
        }

        const session = await refreshTokenRepository.findActiveByTokenId(payload.tokenId);

        if (!session || session.userId !== payload.userId || session.deviceId !== payload.deviceId) {
            return null;
        }

        const accessToken = jwtService.createAccessToken(payload.userId);
        const newRefreshToken = jwtService.createRefreshToken(payload.userId, payload.deviceId);
        const rotated = await refreshTokenRepository.rotate(
            payload.tokenId,
            newRefreshToken.tokenId,
            newRefreshToken.issuedAt,
            newRefreshToken.expiresAt,
        );

        if (!rotated) {
            return null;
        }

        return {accessToken, refreshToken: newRefreshToken.token};
    },

    /**
     * Отзывает refresh token при logout.
     */
    async logout(
        refreshToken: string,
    ): Promise<boolean> {
        const payload =
            jwtService.verifyRefreshToken(
                refreshToken,
            );

        if (!payload) {
            return false;
        }

        return refreshTokenRepository.revoke(
            payload.tokenId,
        );
    },

    async getActiveDevices(refreshToken: string) {
        const payload = jwtService.verifyRefreshToken(refreshToken);

        if (!payload || !await refreshTokenRepository.findActiveByTokenId(payload.tokenId)) {
            return null;
        }

        return refreshTokenRepository.findActiveByUserId(payload.userId);
    },

    async deleteAllOtherDevices(refreshToken: string): Promise<boolean> {
        const payload = jwtService.verifyRefreshToken(refreshToken);

        if (!payload || !await refreshTokenRepository.findActiveByTokenId(payload.tokenId)) {
            return false;
        }

        await refreshTokenRepository.deleteAllOtherDevices(payload.userId, payload.deviceId);
        return true;
    },

    async deleteDevice(refreshToken: string, deviceId: string) {
        const payload = jwtService.verifyRefreshToken(refreshToken);

        if (!payload || !await refreshTokenRepository.findActiveByTokenId(payload.tokenId)) {
            return "unauthorized" as const;
        }

        return refreshTokenRepository.deleteDevice(payload.userId, deviceId);
    },
};
