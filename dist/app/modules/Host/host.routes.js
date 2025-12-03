"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const host_validation_1 = require("./host.validation");
const host_controller_1 = require("./host.controller");
const multer_config_1 = require("../../../config/multer.config");
const router = express_1.default.Router();
router.post("/create-event", (0, auth_1.default)(client_1.UserRole.HOST), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = host_validation_1.eventValidation.createHostValidation.parse(JSON.parse(req.body.data));
    return host_controller_1.hostController.createEvent(req, res, next);
});
// Get list with filters & pagination (public)
router.get("/", host_controller_1.hostController.getEvents);
// Get single event
router.get("/:id", host_controller_1.hostController.getSingleEvent);
// Update event (host/admin) - allow optional file upload
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.HOST, client_1.UserRole.ADMIN), // allow host or admin; inside service we check ownership
multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = host_validation_1.eventValidation.updateHostValidation.parse(JSON.parse(req.body.data));
    return host_controller_1.hostController.updateEvent(req, res, next);
});
// Delete event
router.delete("/:id", (0, auth_1.default)(), host_controller_1.hostController.deleteEvent);
exports.hostsRoutes = router;
