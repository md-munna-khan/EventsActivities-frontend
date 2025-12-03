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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = require("../../../shared/sendResponse");
const setCookie_1 = require("../../../helpers/setCookie");
const config_1 = __importDefault(require("../../../config"));
const convertExpiresInToMs_1 = require("../../../helpers/convertExpiresInToMs");
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenMaxAge = (0, convertExpiresInToMs_1.convertExpiresInToMs)(config_1.default.jwt.expires_in, 1000 * 60 * 60 // default 1 hour
    );
    const refreshTokenMaxAge = (0, convertExpiresInToMs_1.convertExpiresInToMs)(config_1.default.jwt.refresh_token_expires_in, 1000 * 60 * 60 * 24 * 30 // default 30 days
    );
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const tokenInfo = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        refreshTokenMaxAge: refreshTokenMaxAge,
        accessTokenMaxAge: accessTokenMaxAge
    };
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Logged In Successfully",
        data: {
            needPasswordChange: result.needPasswordChange,
        }
    });
}));
const refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const accessTokenMaxAge = (0, convertExpiresInToMs_1.convertExpiresInToMs)(config_1.default.jwt.expires_in, 1000 * 60 * 60 // default 1 hour
    );
    const refreshTokenMaxAge = (0, convertExpiresInToMs_1.convertExpiresInToMs)(config_1.default.jwt.refresh_token_expires_in, 1000 * 60 * 60 * 24 * 30 // default 30 days
    );
    const result = yield auth_service_1.AuthServices.refreshToken(refreshToken);
    const tokenInfo = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        refreshTokenMaxAge: refreshTokenMaxAge,
        accessTokenMaxAge: accessTokenMaxAge
    };
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token generated successfully!",
        data: {
            message: "Access token generated successfully!",
        },
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield auth_service_1.AuthServices.changePassword(user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Changed successfully",
        data: result,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.AuthServices.forgotPassword(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Check your email!",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || "";
    console.log(token);
    yield auth_service_1.AuthServices.resetPassword(token, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Reset!",
        data: null,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.cookies;
    const result = yield auth_service_1.AuthServices.getMe(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
}));
const applyHost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.cookies;
    const result = yield auth_service_1.AuthServices.applyHost(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Host application submitted successfully",
        data: result,
    });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    applyHost,
    getMe
};
