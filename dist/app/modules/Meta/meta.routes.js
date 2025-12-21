"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const meta_controller_1 = require("./meta.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Admin and Host dashboard meta
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), meta_controller_1.MetaController.fetchDashboardMetaData);
router.get('/home-meta', meta_controller_1.MetaController.fetchHomeMetaData);
exports.MetaRoutes = router;
