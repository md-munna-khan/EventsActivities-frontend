"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefreshToken = exports.createUserToken = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwtHelper_1 = require("./jwtHelper");
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../app/errors/ApiError"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return { accessToken, refreshToken };
};
exports.createUserToken = createUserToken;
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = jwtHelper_1.jwtHelper.verifyToken(refreshToken, config_1.default.jwt.refresh_token_secret);
    if (!verifiedRefreshToken || !verifiedRefreshToken.email) {
        throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid refresh token");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { email: verifiedRefreshToken.email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
    if (user.status === "DELETED" || user.status === "SUSPENDED") {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, `User status is ${user.status}`);
    }
    if (user.status === "PENDING") {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, `Your Host account is still pending for approval. Please wait for the admin to approve your account!.`);
    }
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const newRefreshToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return { accessToken, refreshToken: newRefreshToken, needPasswordChange: user.needPasswordChange };
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
