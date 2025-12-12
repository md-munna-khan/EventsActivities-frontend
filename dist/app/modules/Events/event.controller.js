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
exports.eventsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = require("../../../shared/sendResponse");
const event_service_1 = require("./event.service");
// participant controllers
const joinEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: eventId } = req.params;
    const user = req.user; // must be authenticated client
    if (!user)
        throw new Error("Unauthorized");
    const participant = yield event_service_1.eventsService.joinEvent(eventId, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Joined event successfully",
        data: participant,
    });
}));
const leaveEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: eventId } = req.params;
    const user = req.user; // must be authenticated client
    if (!user)
        throw new Error("Unauthorized");
    const result = yield event_service_1.eventsService.leaveEvent(eventId, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Left event successfully",
        data: result
    });
}));
const getMyBookings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // must be authenticated client
    if (!user)
        throw new Error("Unauthorized");
    const bookings = yield event_service_1.eventsService.getMyBookings(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched my bookings successfully",
        data: bookings,
    });
}));
exports.eventsController = {
    joinEvent,
    leaveEvent,
    getMyBookings,
};
