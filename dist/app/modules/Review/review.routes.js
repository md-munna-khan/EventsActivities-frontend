"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// router.get("/all-reviews", ReviewController.allReviews);
// src/app/modules/Events/event.routes.ts
router.post("/:id/reviews", (0, auth_1.default)(client_1.UserRole.CLIENT), review_controller_1.ReviewController.createReview);
router.get("/:id/reviews", review_controller_1.ReviewController.listHostReviews);
// src/app/modules/Host/host.routes.ts or general host endpoints
// router.get("/:hostId/reviews", ReviewController.listHostReviews);
exports.ReviewRoutes = router;
