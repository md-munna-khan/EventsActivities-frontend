"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validations_1 = require("./admin.validations");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.getAllFromDB);
// router.get(
//     '/:id',
//     auth( UserRole.ADMIN),
//     AdminController.getByIdFromDB
// );
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(admin_validations_1.adminValidationSchemas.update), admin_controller_1.AdminController.updateIntoDB);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.deleteFromDB);
// list clients and hosts
// router.get('/user-clients', auth(UserRole.ADMIN), AdminController.getAllClients);
// router.get('/user-hosts', auth(UserRole.ADMIN), AdminController.getAllHosts);
// dashboard / metadata
// host event approval/rejection routes
router.patch('/:applicationId/approve', (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.HostApprove);
router.patch('/:applicationId/reject', (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.HostReject);
// fetch pending events route
router.get("/events/pending", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.fetchPendingHostApplications);
// approve an event
router.patch("/events/:id/approve", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.approveEventController);
// reject an event
router.patch("/events/:id/reject", (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.rejectEventController);
exports.AdminRoutes = router;
