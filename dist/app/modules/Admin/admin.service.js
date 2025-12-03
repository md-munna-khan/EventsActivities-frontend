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
// // fetch clients with pagination and optional search
// const getAllClients = async (params: { searchTerm?: string }, options: IPaginationOptions) => {
//     const { page, limit, skip } = paginationHelper.calculatePagination(options);
//     const { searchTerm } = params;
//     const where: any = { isDeleted: false };
//     if (searchTerm) {
//         where.OR = [
//             { name: { contains: searchTerm, mode: 'insensitive' } },
//             { email: { contains: searchTerm, mode: 'insensitive' } },
//         ];
//     }
//     const data = await prisma.client.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: { createdAt: 'desc' },
//     });
//     const total = await prisma.client.count({ where });
//     return {
//         meta: { page, limit, total },
//         data,
//     };
// };
// // fetch hosts with pagination and optional search
// const getAllHosts = async (params: { searchTerm?: string }, options: IPaginationOptions) => {
//     const { page, limit, skip } = paginationHelper.calculatePagination(options);
//     const { searchTerm } = params;
//     const where: any = { isDeleted: false };
//     if (searchTerm) {
//         where.OR = [
//             { name: { contains: searchTerm, mode: 'insensitive' } },
//             { email: { contains: searchTerm, mode: 'insensitive' } },
//         ];
//     }
//     const data = await prisma.host.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: { createdAt: 'desc' },
//     });
//     const total = await prisma.host.count({ where });
//     return {
//         meta: { page, limit, total },
//         data,
//     };
// };
exports.AdminService = {
    getAllFromDB,
    // getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    getPendingEvents,
    approveEvent,
    rejectEvent,
    //   
}; // 
