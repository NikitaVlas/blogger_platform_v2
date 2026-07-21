import { CookieOptions } from "express";

export const REFRESH_TOKEN_COOKIE_NAME =
    "refreshToken";

export const refreshTokenCookieOptions:
    CookieOptions = {
    httpOnly: true,
    secure: true,

    // Cookie будет доступна для всех /auth-маршрутов.
    path: "/",

    // 20 секунд, как указано в документации.
    maxAge: 20 * 1000,
};

export const clearRefreshTokenCookieOptions:
    CookieOptions = {
    httpOnly: true,
    secure: true,
    path: "/",
};
