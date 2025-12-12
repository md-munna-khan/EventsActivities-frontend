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
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const admin_constant_1 = require("./admin.constant");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: admin_constant_1.adminSearchAbleFields.map(field => ({
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
    andConditions.push({
        isDeleted: false
    });
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = yield prisma_1.default.admin.count({
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
// const getByIdFromDB = async (id: string): Promise<Admin | null> => {
//     const result = await prisma.admin.findUnique({
//         where: {
//             id,
//             isDeleted: false
//         }
//     })
//     return result;
// };
const updateIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.default.admin.update({
        where: {
            id
        },
        data
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.delete({
            where: {
                id
            }
        });
        yield transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });
        return adminDeletedData;
    }));
    return result;
});
const getPendingEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield prisma_1.default.event.findMany({
        where: { status: client_1.EventStatus.PENDING },
        include: { host: true },
    });
    return events;
});
const approveEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
    if (!event)
        throw new Error("Event not found");
    if (event.status !== client_1.EventStatus.PENDING)
        throw new Error("Only pending events can be approved");
    return yield prisma_1.default.event.update({
        where: { id: eventId },
        data: { status: client_1.EventStatus.OPEN },
        include: { host: true },
    });
});
const rejectEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
    if (!event)
        throw new Error("Event not found");
    if (event.status !== client_1.EventStatus.PENDING)
        throw new Error("Only pending events can be rejected");
    return yield prisma_1.default.event.update({
        where: { id: eventId },
        data: { status: client_1.EventStatus.REJECTED },
        include: { host: true },
    });
});
// ==================== HOST MANAGEMENT ====================
const getAllHosts = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, status } = params, filterData = __rest(params, ["searchTerm", "status"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { location: { contains: searchTerm, mode: 'insensitive' } }
            ]
        });
    }
    if (status) {
        andConditions.push({ status });
    }
    andConditions.push({ isDeleted: false });
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.host.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    status: true
                }
            },
            _count: {
                select: {
                    events: true,
                    reviews: true
                }
            }
        }
    });
    const total = yield prisma_1.default.host.count({ where: whereConditions });
    return {
        meta: { page, limit, total },
        data: result
    };
});
const updateHostStatus = (hostId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const host = yield prisma_1.default.host.findUniqueOrThrow({
        where: { id: hostId, isDeleted: false }
    });
    const updatedHost = yield prisma_1.default.host.update({
        where: { id: hostId },
        data: { status: status },
        include: {
            user: true
        }
    });
    return updatedHost;
});
const deleteHost = (hostId) => __awaiter(void 0, void 0, void 0, function* () {
    const host = yield prisma_1.default.host.findUniqueOrThrow({
        where: { id: hostId }
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Soft delete host
        const deletedHost = yield tx.host.update({
            where: { id: hostId },
            data: { isDeleted: true }
        });
        // Update user status
        yield tx.user.update({
            where: { email: host.email },
            data: { status: client_1.UserStatus.DELETED }
        });
        return deletedHost;
    }));
    return result;
});
exports.AdminService = {
    getAllFromDB,
    updateIntoDB,
    deleteFromDB,
    getPendingEvents,
    approveEvent,
    rejectEvent,
    // Host Management
    getAllHosts,
    updateHostStatus,
    deleteHost
}; // 
