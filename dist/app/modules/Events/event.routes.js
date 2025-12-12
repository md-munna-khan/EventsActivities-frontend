"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const event_controller_1 = require("./event.controller");
const router = express_1.default.Router();
// Participant: join / leave
router.post("/:id/join", (0, auth_1.default)(client_1.UserRole.CLIENT), event_controller_1.eventsController.joinEvent);
router.post("/:id/leave", (0, auth_1.default)(client_1.UserRole.CLIENT), event_controller_1.eventsController.leaveEvent);
router.get("/my-bookings", (0, auth_1.default)(client_1.UserRole.CLIENT), event_controller_1.eventsController.getMyBookings);
exports.eventsRoutes = router;
