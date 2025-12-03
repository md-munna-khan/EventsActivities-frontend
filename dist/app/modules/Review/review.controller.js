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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const catchAsync_1 = require("../../../shared/catchAsync");
const review_service_1 = require("./review.service");
const sendResponse_1 = require("../../../shared/sendResponse");
const createReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id: eventId } = req.params; // route: /events/:id/reviews
    const user = (_b = (_a = req.user) !== null && _a !== void 0 ? _a : req.body.user) !== null && _b !== void 0 ? _b : req.user; // adapt to your auth middleware
    const payload = { rating: Number(req.body.rating), comment: req.body.comment };
    const review = yield review_service_1.ReviewService.createReview(eventId, user, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Review created",
        data: review,
    });
}));
const listHostReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { hostId } = req.params;
    const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    const limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 20);
    const result = yield review_service_1.ReviewService.listHostReviews(hostId, page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Reviews fetched",
        meta: result.meta,
        data: result.data,
    });
}));
exports.ReviewController = { createReview, listHostReviews };
