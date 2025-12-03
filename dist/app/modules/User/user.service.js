"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = __importDefault(require("../../../config"));
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const user_constant_1 = require("./user.constant");
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    let uploadedPublicId;
    if (file) {
        if (file.buffer) {
            const uploaded = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(file.buffer, file.originalname || 'profile');
            req.body.admin.profilePhoto = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
        else if (file.path) {
            const uploaded = yield cloudinary_config_1.cloudinaryUpload.uploader.upload(file.path, { resource_type: 'auto' });
            req.body.admin.profilePhoto = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, Number(config_1.default.salt_round));
    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN
    };
    try {
        const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionClient.user.create({
                data: userData
            });
            const createdAdminData = yield transactionClient.admin.create({
                data: req.body.admin
            });
            return createdAdminData;
        }));
        return result;
    }
    catch (error) {
        if (uploadedPublicId) {
            try {
                yield cloudinary_config_1.cloudinaryUpload.uploader.destroy(uploadedPublicId);
            }
            catch (cleanupErr) {
                // ignore cleanup errors
            }
        }
        throw error;
    }
});
const createClient = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    let uploadedPublicId;
    if (file) {
        // If multer stored the file in memory (buffer available), upload buffer to Cloudinary
        if (file.buffer) {
            const uploadedProfileImage = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(file.buffer, file.originalname || 'profile');
            req.body.client.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
            uploadedPublicId = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.public_id;
        }
        else if (file.path) {
            const uploadedProfileImage = yield cloudinary_config_1.cloudinaryUpload.uploader.upload(file.path, { resource_type: 'auto' });
            req.body.client.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
            uploadedPublicId = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.public_id;
        }
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, Number(config_1.default.salt_round));
    const userData = {
        email: req.body.client.email,
        password: hashedPassword,
        role: client_1.UserRole.CLIENT
    };
    console.log(userData);
    try {
        const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionClient.user.create({
                data: Object.assign(Object.assign({}, userData), { needPasswordChange: false })
            });
            const createdClientData = yield transactionClient.client.create({
                data: req.body.client
            });
            return createdClientData;
        }));
        return result;
    }
    catch (error) {
        if (uploadedPublicId) {
            // Try to remove the uploaded image from Cloudinary using the public_id
            try {
                yield cloudinary_config_1.cloudinaryUpload.uploader.destroy(uploadedPublicId);
            }
            catch (err) {
                // If cleanup fails, log it but rethrow the original error below
                // console.error('Failed to delete uploaded image from Cloudinary', err);
            }
        }
        throw error;
    }
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
        }
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const changeProfileStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    const updateUserStatus = yield prisma_1.default.user.update({
        where: {
            id
        },
        data: status
    });
    return updateUserStatus;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true,
        },
    });
    let profileInfo;
    if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: userInfo.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
                contactNumber: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.CLIENT) {
        profileInfo = yield prisma_1.default.client.findUnique({
            where: {
                email: userInfo.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
                contactNumber: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const file = req.file;
    let uploadedPublicId;
    if (file) {
        if (file.buffer) {
            const uploaded = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(file.buffer, file.originalname || 'profile');
            req.body.profilePhoto = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
        else if (file.path) {
            const uploaded = yield cloudinary_config_1.cloudinaryUpload.uploader.upload(file.path, { resource_type: 'auto' });
            req.body.profilePhoto = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
    }
    let profileInfo;
    try {
        if (userInfo.role === client_1.UserRole.ADMIN) {
            profileInfo = yield prisma_1.default.admin.update({
                where: {
                    email: userInfo.email
                },
                data: req.body
            });
        }
        else if (userInfo.role === client_1.UserRole.CLIENT) {
            profileInfo = yield prisma_1.default.client.update({
                where: {
                    email: userInfo.email
                },
                data: req.body
            });
        }
        return Object.assign({}, profileInfo);
    }
    catch (error) {
        if (uploadedPublicId) {
            try {
                yield cloudinary_config_1.cloudinaryUpload.uploader.destroy(uploadedPublicId);
            }
            catch (cleanupErr) {
                // ignore cleanup errors
            }
        }
        throw error;
    }
});
exports.userService = {
    createAdmin,
    createClient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
};
