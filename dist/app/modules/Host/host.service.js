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
exports.hostService = void 0;
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const createEvent = (req, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const accessToken = user.accessToken;
    const decodedData = jwtHelper_1.jwtHelper.verifyToken(accessToken, config_1.default.jwt.jwt_secret);
    const payload = req.body;
    const file = req.file;
    let uploadedPublicId;
    if (file) {
        if (file.buffer) {
            const uploaded = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(file.buffer, file.originalname || 'event');
            req.body.image = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
        else if (file.path) {
            const uploaded = yield cloudinary_config_1.cloudinaryUpload.uploader.upload(file.path, { resource_type: 'auto' });
            req.body.image = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
    }
    const dbUser = yield prisma_1.default.user.findUnique({
        where: { id: decodedData.userId }
    });
    if (!dbUser)
        throw new Error("User not found");
    // const host = await prisma.host.findUnique({
    //     where: { email: dbUser.email }
    // });
    let host = yield prisma_1.default.host.findFirst({
        where: { email: dbUser.email }
    });
    if (!host) {
        throw new Error("Host profile not found for email: " + dbUser.email);
    }
    const hostId = String(host.id);
    // convert date string to Date object
    payload.date = new Date(payload.date);
    if (payload.joiningFee !== undefined)
        payload.joiningFee = Number(payload.joiningFee);
    if (payload.capacity !== undefined)
        payload.capacity = Number(payload.capacity);
    const event = yield prisma_1.default.event.create({
        data: {
            title: payload.title,
            category: payload.category,
            description: payload.description,
            date: payload.date,
            location: payload.location,
            joiningFee: (_a = payload.joiningFee) !== null && _a !== void 0 ? _a : 0,
            image: (_b = payload.image) !== null && _b !== void 0 ? _b : "",
            capacity: payload.capacity,
            hostId: hostId,
            status: payload.status, // optional
        },
    });
    return event;
});
const getEvents = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {}) {
    var _a, _b;
    const filter = (_a = options.filter) !== null && _a !== void 0 ? _a : {};
    const pagination = (_b = options.pagination) !== null && _b !== void 0 ? _b : { page: 1, limit: 10 };
    const where = {};
    // build where from filter (category, status, fromDate, toDate, search)
    if (filter.category)
        where.category = filter.category;
    if (filter.status)
        where.status = filter.status;
    if (filter.search) {
        where.OR = [
            { title: { contains: filter.search, mode: "insensitive" } },
            { description: { contains: filter.search, mode: "insensitive" } },
            { location: { contains: filter.search, mode: "insensitive" } },
        ];
    }
    if (filter.fromDate || filter.toDate) {
        where.date = {};
        if (filter.fromDate)
            where.date.gte = new Date(filter.fromDate);
        if (filter.toDate)
            where.date.lte = new Date(filter.toDate);
    }
    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 10);
    const skip = (page - 1) * limit;
    const [total, events] = yield Promise.all([
        prisma_1.default.event.count({ where }),
        prisma_1.default.event.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date: "asc" },
            include: {
                host: { select: { id: true, name: true, email: true, profilePhoto: true, rating: true } },
                participants: true, // can be used to get count
            },
        }),
    ]);
    // map to include participantCount
    const data = events.map((e) => {
        var _a, _b;
        return (Object.assign(Object.assign({}, e), { participantCount: (_b = (_a = e.participants) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 }));
    });
    return {
        meta: { page, limit, total, pages: Math.ceil(total / limit) },
        data,
    };
});
const getSingleEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const event = yield prisma_1.default.event.findUnique({
        where: { id },
        include: {
            host: { select: { id: true, name: true, email: true, profilePhoto: true, rating: true } },
            participants: { include: { client: { select: { id: true, name: true, email: true, profilePhoto: true } } } },
            reviews: true,
        },
    });
    if (!event)
        throw new Error("Event not found");
    return Object.assign(Object.assign({}, event), { participantCount: (_b = (_a = event.participants) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 });
});
const updateEvent = (id, payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    // optional: check host ownership before update (recommended)
    const existing = yield prisma_1.default.event.findUnique({ where: { id },
        include: { host: true } });
    if (!existing)
        throw new Error("Event not found");
    // 2) require auth info
    if (!req)
        throw new Error("Request required for authorization");
    const requester = req.user;
    if (!requester)
        throw new Error("Unauthorized: missing user info");
    // 3) admin can update anything
    if (requester.role === "ADMIN") {
        // continue to update below
    }
    else {
        // 4) non-admin: find host record for this requester by email
        const host = yield prisma_1.default.host.findFirst({ where: { email: requester.email } });
        if (!host)
            throw new Error("Unauthorized: host profile not found for your account");
        // 5) check ownership: host.id must match event.hostId
        if (String(host.id) !== String(existing.hostId)) {
            throw new Error("Unauthorized to update this event");
        }
    }
    // handle file if new upload provided
    const file = req === null || req === void 0 ? void 0 : req.file;
    let uploadedPublicId;
    if (file) {
        if (file.buffer) {
            const uploaded = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(file.buffer, file.originalname || 'event');
            if (uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url)
                payload.image = uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
        else if (file.path) {
            const uploaded = yield cloudinary_config_1.cloudinaryUpload.uploader.upload(file.path, { resource_type: 'auto' });
            if (uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url)
                payload.image = uploaded.secure_url;
            uploadedPublicId = uploaded === null || uploaded === void 0 ? void 0 : uploaded.public_id;
        }
    }
    if (payload.date)
        payload.date = new Date(payload.date);
    if (payload.joiningFee !== undefined)
        payload.joiningFee = Number(payload.joiningFee);
    if (payload.capacity !== undefined)
        payload.capacity = Number(payload.capacity);
    const updated = yield prisma_1.default.event.update({
        where: { id },
        data: payload,
    });
    return updated;
});
const deleteEvent = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    // optional: ownership check
    const existing = yield prisma_1.default.event.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Event not found");
    if (!existing)
        throw new Error("Event not found");
    // 2) require auth info
    if (!req)
        throw new Error("Request required for authorization");
    const requester = req.user;
    if (!requester)
        throw new Error("Unauthorized: missing user info");
    // 3) admin can update anything
    if (requester.role === "ADMIN") {
        // continue to update below
    }
    else {
        // 4) non-admin: find host record for this requester by email
        const host = yield prisma_1.default.host.findFirst({ where: { email: requester.email } });
        if (!host)
            throw new Error("Unauthorized: host profile not found for your account");
        // 5) check ownership: host.id must match event.hostId
        if (String(host.id) !== String(existing.hostId)) {
            throw new Error("Unauthorized to update this event");
        }
    }
    // remove participants first (or cascade configured)
    yield prisma_1.default.$transaction([
        prisma_1.default.eventParticipant.deleteMany({ where: { eventId: id } }),
        prisma_1.default.event.delete({ where: { id } }),
    ]);
    return { id };
});
exports.hostService = {
    createEvent,
    getEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent,
};
