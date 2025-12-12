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
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const admin_constant_1 = require("./admin.constant");
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../../shared/sendResponse");
const catchAsync_1 = require("../../../shared/catchAsync");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const getAllFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, admin_constant_1.adminFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield admin_service_1.AdminService.getAllFromDB(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data
    });
}));
// const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await AdminService.getByIdFromDB(id);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Admin data fetched by id!",
//         data: result
//     });
// })
const updateIntoDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.updateIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin data updated!",
        data: result
    });
}));
const deleteFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.deleteFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    });
}));
const fetchPendingEventApplications = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getPendingEvents();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pending event applications fetched',
        data: result
    });
}));
const approveEventController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: eventId } = req.params;
    const updatedEvent = yield admin_service_1.AdminService.approveEvent(eventId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Event approved successfully",
        data: updatedEvent,
    });
}));
const rejectEventController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: eventId } = req.params;
    const updatedEvent = yield admin_service_1.AdminService.rejectEvent(eventId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Event rejected successfully",
        data: updatedEvent,
    });
}));
// Approve host application (transactional):
const HostApprove = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId } = req.params; // use application id in route
    // load application + user
    const application = yield prisma_1.default.hostApplication.findUniqueOrThrow({
        where: { id: applicationId },
    });
    console.log(application);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // fetch user
        const userData = yield tx.user.findUniqueOrThrow({ where: { id: application.userId } });
        // create Host record
        const host = yield tx.host.create({
            data: {
                email: userData.email,
                name: (_a = application.name) !== null && _a !== void 0 ? _a : userData.email.split('@')[0],
                profilePhoto: '',
                contactNumber: '',
                bio: '',
                location: '',
                status: client_1.hostsStatus.APPROVED,
            },
        });
        // remove Client profile if exists (prevent double profiles)
        const client = yield tx.client.findUnique({ where: { email: userData.email } });
        if (client) {
            yield tx.client.delete({ where: { id: client.id } });
        }
        // update user role -> HOST and reactivate user
        yield tx.user.update({
            where: { id: userData.id },
            data: { role: client_1.UserRole.HOST, status: client_1.UserStatus.ACTIVE },
        });
        // mark application approved
        const updatedApp = yield tx.hostApplication.update({
            where: { id: applicationId },
            data: { status: 'APPROVED' },
        });
        return { host, updatedApp };
    }));
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Host application approved and host created',
        data: result,
    });
}));
// Reject host application (transactional):
const HostReject = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId } = req.params;
    const application = yield prisma_1.default.hostApplication.findUniqueOrThrow({
        where: { id: applicationId },
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // set application status rejected
        const updatedApp = yield tx.hostApplication.update({
            where: { id: applicationId },
            data: { status: 'REJECTED' },
        });
        // restore user status to ACTIVE so they can login again
        yield tx.user.update({
            where: { id: application.userId },
            data: { status: client_1.UserStatus.ACTIVE },
        });
        return updatedApp;
    }));
    return (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Host application rejected',
        data: result,
    });
}));
// fetch pending host applications
const fetchPendingHostApplications = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pending = yield prisma_1.default.hostApplication.findMany({ where: { status: 'PENDING' } });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pending host applications fetched',
        data: pending,
    });
}));
// ==================== HOST MANAGEMENT ====================
const getAllHosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ['searchTerm', 'status']);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield admin_service_1.AdminService.getAllHosts(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Hosts fetched successfully',
        meta: result.meta,
        data: result.data
    });
}));
const updateHostStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield admin_service_1.AdminService.updateHostStatus(id, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Host status updated successfully',
        data: result
    });
}));
const deleteHost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminService.deleteHost(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Host deleted successfully',
        data: result
    });
}));
exports.AdminController = {
    getAllFromDB,
    updateIntoDB,
    deleteFromDB,
    HostApprove,
    HostReject,
    fetchPendingHostApplications,
    approveEventController,
    rejectEventController,
    fetchPendingEventApplications,
    // Host Management
    getAllHosts,
    updateHostStatus,
    deleteHost
};
