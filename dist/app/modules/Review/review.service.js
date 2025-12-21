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
exports.ReviewService = void 0;
// src/app/modules/Review/review.service.ts
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
exports.ReviewService = {
    createReview(eventId, user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // 0. basic payload validation
            const ratingRaw = Number(payload.rating);
            if (!Number.isFinite(ratingRaw)) {
                throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid rating value");
            }
            const rating = Math.floor(ratingRaw);
            if (rating < 1 || rating > 5) {
                throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Rating must be between 1 and 5");
            }
            // 1. Resolve user email or id safely
            let userId;
            let email;
            if (user === null || user === void 0 ? void 0 : user.id)
                userId = user.id;
            if (user === null || user === void 0 ? void 0 : user.email)
                email = user.email;
            // if user provided only accessToken, decode it
            if (!userId && !email && (user === null || user === void 0 ? void 0 : user.accessToken)) {
                try {
                    const decoded = jwtHelper_1.jwtHelper.verifyToken(user.accessToken, config_1.default.jwt.jwt_secret);
                    // try common fields
                    userId = (_c = (_b = (_a = decoded === null || decoded === void 0 ? void 0 : decoded.id) !== null && _a !== void 0 ? _a : decoded === null || decoded === void 0 ? void 0 : decoded.userId) !== null && _b !== void 0 ? _b : decoded === null || decoded === void 0 ? void 0 : decoded.sub) !== null && _c !== void 0 ? _c : userId;
                    email = (_d = decoded === null || decoded === void 0 ? void 0 : decoded.email) !== null && _d !== void 0 ? _d : email;
                }
                catch (err) {
                    // invalid token
                    throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid or expired token");
                }
            }
            // if only userId available, fetch user to get email (because client relation uses email)
            if (userId && !email) {
                const u = yield prisma_1.default.user.findUnique({ where: { id: userId } });
                if (!u)
                    throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not found");
                email = u.email;
            }
            if (!email) {
                throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unable to identify user");
            }
            // 2. fetch event and validate status
            const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
            if (!event)
                throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Event not found");
            if (event.status !== "COMPLETED") {
                throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only review completed events");
            }
            // 3. fetch client by email
            const client = yield prisma_1.default.client.findUnique({ where: { email } });
            if (!client) {
                throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Client profile not found");
            }
            // 4. Check if user attended the event (confirmed participant)
            const participant = yield prisma_1.default.eventParticipant.findFirst({
                where: {
                    eventId,
                    clientId: client.id,
                    participantStatus: "CONFIRMED",
                },
            });
            if (!participant) {
                throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only review events you attended");
            }
            // 5. Prevent duplicate review for same event by same client
            const existing = yield prisma_1.default.review.findFirst({
                where: { eventId, clientId: client.id },
            });
            if (existing) {
                throw new ApiError_1.default(http_status_codes_1.default.CONFLICT, "You have already reviewed this event");
            }
            // 6. Create review and update host's rating atomically
            return yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const review = yield tx.review.create({
                    data: {
                        rating,
                        comment: (_a = payload.comment) !== null && _a !== void 0 ? _a : null,
                        eventId,
                        clientId: client.id,
                        hostId: event.hostId,
                    },
                });
                // Update host aggregate rating
                const host = yield tx.host.findUnique({ where: { id: event.hostId } });
                if (!host)
                    throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Host not found");
                const currentCount = (_b = host.ratingCount) !== null && _b !== void 0 ? _b : 0;
                const currentRating = (_c = host.rating) !== null && _c !== void 0 ? _c : 0;
                const newCount = currentCount + 1;
                // calculate weighted average correctly
                const newRating = ((currentRating * currentCount) + rating) / newCount;
                yield tx.host.update({
                    where: { id: host.id },
                    data: { rating: newRating, ratingCount: newCount },
                });
                return review;
            }));
        });
    },
    listHostReviews(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, page = 1, limit = 20) {
            const skip = (page - 1) * limit;
            const [data, total] = yield Promise.all([
                prisma_1.default.review.findMany({
                    where: { eventId: id },
                    include: {
                        client: {
                            select: { id: true, name: true, profilePhoto: true },
                        },
                        event: { select: { id: true, title: true } },
                    },
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
                }),
                prisma_1.default.review.count({ where: { eventId: id } }),
            ]);
            return { data, meta: { total, page, limit } };
        });
    },
    // fixed allReviews method syntax
    // async allReviews() {
    //   const reviews = await prisma.review.findMany({
    //     include: {
    //       client: {
    //         select: { id: true, name: true, profilePhoto: true },
    //       },
    //       event: { select: { id: true, title: true } },
    //       host: {
    //         select: { id: true, name: true, email: true },
    //       },
    //     },
    //     orderBy: { createdAt: "desc" },
    //   });
    //   return reviews;
    // },
};
