import { jwtService } from "./jwt.service";
import { refreshTokenRepository } from "../repositories/refresh-token.repository";
import { usersRepository } from "../../users/repositories/users.repository";

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
    ): Promise<TokenPair> {
        const accessToken =
            jwtService.createAccessToken(userId);

        const createdRefreshToken =
            jwtService.createRefreshToken(userId);

        await refreshTokenRepository.create({
            userId,
            tokenId: createdRefreshToken.tokenId,
            issuedAt: createdRefreshToken.issuedAt,
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

        // Старый токен становится невалидным.
        // revoke вернёт false, если он уже был применён,
        // отозван или истёк.
        const revoked =
            await refreshTokenRepository.revoke(
                payload.tokenId,
            );

        if (!revoked) {
            return null;
        }

        return this.createTokenPair(
            payload.userId,
        );
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
};
