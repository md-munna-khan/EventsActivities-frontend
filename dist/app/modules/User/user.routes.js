"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const multer_config_1 = require("../../../config/multer.config");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.getAllFromDB);
router.get('/me', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CLIENT, client_1.UserRole.HOST), user_controller_1.userController.getMyProfile);
router.post("/create-admin", (0, auth_1.default)(client_1.UserRole.ADMIN), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = user_validation_1.userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createAdmin(req, res, next);
});
router.post("/create-client", multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = user_validation_1.userValidation.createClient.parse(JSON.parse(req.body.data));
    console.log(req.body);
    return user_controller_1.userController.createClient(req, res, next);
});
router.patch('/:id/status', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(user_validation_1.userValidation.updateStatus), user_controller_1.userController.changeProfileStatus);
router.patch("/update-my-profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CLIENT, client_1.UserRole.HOST), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.userController.updateMyProfile(req, res, next);
});
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.deleteUser);
exports.userRoutes = router;
