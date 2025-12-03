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
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const userToken_1 = require("../../../helpers/userToken");
const config_1 = __importDefault(require("../../../config"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const sendEmail_1 = require("../../../helpers/sendEmail");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password is incorrect!");
    }
    const userToken = (0, userToken_1.createUserToken)(user);
    return Object.assign(Object.assign({}, userToken), { needPasswordChange: user.needPasswordChange });
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const newTokens = yield (0, userToken_1.createNewAccessTokenWithRefreshToken)(token);
    return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        needPasswordChange: newTokens.needPasswordChange
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.salt_round));
    yield prisma_1.default.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });
    return {
        message: "Password changed successfully!"
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    console.log(userData);
    const resetPassToken = jwtHelper_1.jwtHelper.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: userData.email,
        subject: "Password Reset Request",
        templateName: "reset-password",
        templateData: {
            name: userData.email.split("@")[0],
            resetPassLink,
        }
    });
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isValidToken = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.salt_round));
    // update into database
    yield prisma_1.default.user.update({
        where: {
            id: payload.id
        },
        data: {
            password,
            needPasswordChange: false
        }
    });
});
const getMe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = user.accessToken;
    const decodedData = jwtHelper_1.jwtHelper.verifyToken(accessToken, config_1.default.jwt.jwt_secret);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },
        }
    });
    return userData;
});
const applyHost = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // user is taken from req.cookies (set by login)
    const accessToken = user === null || user === void 0 ? void 0 : user.accessToken;
    if (!accessToken) {
        throw new Error('Unauthorized');
    }
    // decode token to get email
    const decoded = jwtHelper_1.jwtHelper.verifyToken(accessToken, config_1.default.jwt.jwt_secret);
    const email = decoded === null || decoded === void 0 ? void 0 : decoded.email;
    if (!email)
        throw new Error('Unauthorized');
    // run in transaction: create HostApplication and set user.status = PENDING
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = yield tx.user.findUniqueOrThrow({ where: { email } });
        // Prevent duplicate applications
        const existingApp = yield tx.hostApplication.findFirst({ where: { userId: userData.id } });
        if (existingApp) {
            return { message: 'Host application already exists', application: existingApp };
        }
        // create host application
        const application = yield tx.hostApplication.create({
            data: {
                name: userData.email.split('@')[0],
                userId: userData.id,
                status: 'PENDING',
            },
        });
        // set user status to PENDING so login is blocked until approval
        yield tx.user.update({
            where: { id: userData.id },
            data: { status: client_1.UserStatus.PENDING },
        });
        return { message: 'Host application submitted successfully', application };
    }));
    return result;
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    getMe,
    applyHost
};
