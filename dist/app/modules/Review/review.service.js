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
exports.ReviewService = {
    createReview(eventId, user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. validate rating range
            const rating = Math.floor(payload.rating);
            if (rating < 1 || rating > 5) {
                throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Rating must be between 1 and 5");
            }
            // 2. fetch event and check hostId
            const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
            if (!event)
                throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Event not found");
            // 3. ensure the user is a client and has confirmed participant
            const client = yield prisma_1.default.client.findUnique({ where: { email: user.email } });
            if (!client)
                throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Client profile not found");
            const participant = yield prisma_1.default.eventParticipant.findFirst({
                where: { eventId, clientId: client.id, participantStatus: "CONFIRMED" },
            });
            if (!participant) {
                throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only review events you attended");
            }
            // 4. prevent duplicate review for same event by same client
            const existing = yield prisma_1.default.review.findFirst({
                where: { eventId, clientId: client.id },
            });
            if (existing)
                throw new ApiError_1.default(http_status_codes_1.default.CONFLICT, "You have already reviewed this event");
            // 5. create review and update host's rating atomically
            return yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const review = yield tx.review.create({
                    data: {
                        rating,
                        comment: payload.comment,
                        eventId,
                        clientId: client.id,
                        hostId: event.hostId,
                    },
                });
                // update host aggregate rating
                const host = yield tx.host.findUnique({ where: { id: event.hostId } });
                if (!host)
                    throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Host not found");
                const newCount = host.ratingCount + 1;
                const newRating = ((((_a = host.rating) !== null && _a !== void 0 ? _a : 0) * host.ratingCount) + rating) / newCount;
                yield tx.host.update({
                    where: { id: host.id },
                    data: { rating: newRating, ratingCount: newCount },
                });
                return review;
            }));
        });
    },
    listHostReviews(hostId_1) {
        return __awaiter(this, arguments, void 0, function* (hostId, page = 1, limit = 20) {
            const skip = (page - 1) * limit;
            const [data, total] = yield Promise.all([
                prisma_1.default.review.findMany({
                    where: { hostId },
                    include: { client: { select: { id: true, name: true, profilePhoto: true } }, event: { select: { id: true, title: true } } },
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
                }),
                prisma_1.default.review.count({ where: { hostId } }),
            ]);
            return { data, meta: { total, page, limit } };
        });
    },
};
