import { JwtService } from "./jwt.service";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { UsersRepository } from "../../users/repositories/users.repository";
import { randomUUID } from "node:crypto";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export class AuthSessionService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}
  async createTokenPair(
    userId: string,
    deviceName: string,
    ip: string,
    deviceId = randomUUID(),
  ): Promise<TokenPair> {
    const accessToken = this.jwtService.createAccessToken(userId);

    const createdRefreshToken = this.jwtService.createRefreshToken(
      userId,
      deviceId,
    );

    await this.refreshTokenRepository.create({
      userId,
      tokenId: createdRefreshToken.tokenId,
      deviceId,
      deviceName,
      ip,
      issuedAt: createdRefreshToken.issuedAt,
      lastActiveDate: createdRefreshToken.issuedAt,
      expiresAt: createdRefreshToken.expiresAt,
      revokedAt: null,
    });

    return {
      accessToken,
      refreshToken: createdRefreshToken.token,
    };
  }
  async refresh(refreshToken: string): Promise<TokenPair | null> {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);

    if (!payload) {
      return null;
    }

    // Проверяем, что пользователь ещё существует.
    const user = await this.usersRepository.findById(payload.userId);

    if (!user) {
      return null;
    }

    const session = await this.refreshTokenRepository.findActiveByTokenId(
      payload.tokenId,
    );

    if (
      !session ||
      session.userId !== payload.userId ||
      session.deviceId !== payload.deviceId
    ) {
      return null;
    }

    const accessToken = this.jwtService.createAccessToken(payload.userId);
    const newRefreshToken = this.jwtService.createRefreshToken(
      payload.userId,
      payload.deviceId,
    );
    const rotated = await this.refreshTokenRepository.rotate(
      payload.tokenId,
      newRefreshToken.tokenId,
      newRefreshToken.issuedAt,
      newRefreshToken.expiresAt,
    );

    if (!rotated) {
      return null;
    }

    return { accessToken, refreshToken: newRefreshToken.token };
  }
  async logout(refreshToken: string): Promise<boolean> {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);

    if (!payload) {
      return false;
    }

    return this.refreshTokenRepository.revoke(payload.tokenId);
  }
  async getActiveDevices(refreshToken: string) {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);

    if (
      !payload ||
      !(await this.refreshTokenRepository.findActiveByTokenId(payload.tokenId))
    ) {
      return null;
    }

    return this.refreshTokenRepository.findActiveByUserId(payload.userId);
  }
  async deleteAllOtherDevices(refreshToken: string): Promise<boolean> {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);

    if (
      !payload ||
      !(await this.refreshTokenRepository.findActiveByTokenId(payload.tokenId))
    ) {
      return false;
    }

    await this.refreshTokenRepository.deleteAllOtherDevices(
      payload.userId,
      payload.deviceId,
    );
    return true;
  }
  async deleteDevice(refreshToken: string, deviceId: string) {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);

    if (
      !payload ||
      !(await this.refreshTokenRepository.findActiveByTokenId(payload.tokenId))
    ) {
      return "unauthorized" as const;
    }

    return this.refreshTokenRepository.deleteDevice(payload.userId, deviceId);
  }
}
