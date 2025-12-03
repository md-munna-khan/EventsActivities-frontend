"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: tokenInfo.accessTokenMaxAge || 1000 * 60 * 60
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: tokenInfo.refreshTokenMaxAge || 1000 * 60 * 60 * 24 * 90
        });
    }
};
exports.setAuthCookie = setAuthCookie;
