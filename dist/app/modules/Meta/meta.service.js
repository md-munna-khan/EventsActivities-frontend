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
exports.MetaService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
/**
 * Fetch dashboard meta data based on user role.
 * Accepts a `user` object (as set by auth middleware) or a cookie object fallback.
 */
const fetchDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // support both req.user (auth middleware) and req.cookies fallback
    const ctx = (user === null || user === void 0 ? void 0 : user.user) || (user === null || user === void 0 ? void 0 : user.cookies) || user;
    const role = (ctx && (ctx.role || (ctx === null || ctx === void 0 ? void 0 : ctx.role)));
    // ADMIN dashboard
    if (role === client_1.UserRole.ADMIN || role === 'ADMIN') {
        const [totalUsers, totalClients, totalHosts, totalEvents, eventsByStatus, totalPaidPayments, revenueObj, pendingHostApplications, recentEvents] = yield Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.client.count({ where: { isDeleted: false } }).catch(() => 0),
            prisma_1.default.host.count({ where: { isDeleted: false } }).catch(() => 0),
            prisma_1.default.event.count(),
            prisma_1.default.event.groupBy({ by: ['status'], _count: { _all: true } }).catch(() => []),
            prisma_1.default.payment.count({ where: { status: client_1.PaymentStatus.PAID } }).catch(() => 0),
            prisma_1.default.payment.aggregate({ _sum: { amount: true }, where: { status: client_1.PaymentStatus.PAID } }).catch(() => ({ _sum: { amount: 0 } })),
            // host applications pending (if model exists)
            prisma_1.default.hostApplication.count({ where: { status: 'PENDING' } }).catch(() => 0),
            prisma_1.default.event.findMany({ take: 10, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, createdAt: true, hostId: true } }).catch(() => []),
        ]);
        const eventsStatusCounts = {};
        (eventsByStatus || []).forEach((r) => {
            var _a, _b, _c;
            eventsStatusCounts[r.status] = (_c = (_b = (_a = r._count) === null || _a === void 0 ? void 0 : _a._all) !== null && _b !== void 0 ? _b : r._count) !== null && _c !== void 0 ? _c : 0;
        });
        // classify success/failed roughly
        const successCount = (_a = eventsStatusCounts[client_1.EventStatus.COMPLETED]) !== null && _a !== void 0 ? _a : 0;
        const failedCount = ((_b = eventsStatusCounts[client_1.EventStatus.CANCELLED]) !== null && _b !== void 0 ? _b : 0) + ((_c = eventsStatusCounts[client_1.EventStatus.REJECTED]) !== null && _c !== void 0 ? _c : 0);
        return {
            role: client_1.UserRole.ADMIN,
            totals: {
                users: totalUsers,
                clients: totalClients,
                hosts: totalHosts,
                events: totalEvents,
                paidPayments: totalPaidPayments,
                revenue: Number((_e = (_d = revenueObj._sum) === null || _d === void 0 ? void 0 : _d.amount) !== null && _e !== void 0 ? _e : 0),
                pendingHostApplications,
            },
            eventsByStatus: eventsStatusCounts,
            successCount,
            failedCount,
            recentEvents,
        };
    }
    // HOST dashboard
    if (role === client_1.UserRole.HOST || role === 'HOST') {
        const email = ctx === null || ctx === void 0 ? void 0 : ctx.email;
        if (!email)
            throw new Error('User email not found in token');
        const host = yield prisma_1.default.host.findFirst({ where: { email, isDeleted: false } });
        if (!host)
            throw new Error('Host profile not found');
        const [totalEvents, eventsByStatus, revenueObj, totalBookings, bookingsByStatus, recentEvents] = yield Promise.all([
            prisma_1.default.event.count({ where: { hostId: host.id } }),
            prisma_1.default.event.groupBy({ by: ['status'], where: { hostId: host.id }, _count: { _all: true } }).catch(() => []),
            prisma_1.default.payment.aggregate({ _sum: { amount: true }, where: { hostId: host.id, status: client_1.PaymentStatus.PAID } }).catch(() => ({ _sum: { amount: 0 } })),
            prisma_1.default.eventParticipant.count({ where: { event: { hostId: host.id } } }).catch(() => 0),
            prisma_1.default.eventParticipant.groupBy({ by: ['participantStatus'], where: { event: { hostId: host.id } }, _count: { _all: true } }).catch(() => []),
            prisma_1.default.event.findMany({ where: { hostId: host.id }, take: 10, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, status: true, createdAt: true, joiningFee: true, capacity: true, _count: { select: { participants: true } } } }).catch(() => []),
        ]);
        const eventsStatusCounts = {};
        (eventsByStatus || []).forEach((r) => { var _a, _b, _c; return (eventsStatusCounts[r.status] = (_c = (_b = (_a = r._count) === null || _a === void 0 ? void 0 : _a._all) !== null && _b !== void 0 ? _b : r._count) !== null && _c !== void 0 ? _c : 0); });
        const bookingsStatusCounts = {};
        (bookingsByStatus || []).forEach((r) => { var _a, _b, _c; return (bookingsStatusCounts[r.participantStatus] = (_c = (_b = (_a = r._count) === null || _a === void 0 ? void 0 : _a._all) !== null && _b !== void 0 ? _b : r._count) !== null && _c !== void 0 ? _c : 0); });
        return {
            role: client_1.UserRole.HOST,
            host: { id: host.id, name: host.name, email: host.email, income: (_f = host.income) !== null && _f !== void 0 ? _f : 0 },
            totals: { events: totalEvents, bookings: totalBookings },
            eventsByStatus: eventsStatusCounts,
            bookingsByStatus: bookingsStatusCounts,
            totalRevenue: Number((_h = (_g = revenueObj._sum) === null || _g === void 0 ? void 0 : _g.amount) !== null && _h !== void 0 ? _h : 0),
            recentEvents,
        };
    }
    // fallback public meta
    const users = yield prisma_1.default.user.count();
    return { role: role !== null && role !== void 0 ? role : 'UNKNOWN', totals: { users } };
});
const fetchHomeMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    // public/home meta: show events and hosts counts
    const [totalEvents, totalHosts, totalUsers] = yield Promise.all([
        prisma_1.default.event.count(),
        prisma_1.default.host.count(),
        prisma_1.default.user.count()
    ]);
    return {
        totalEvents,
        totalHosts,
        totalUsers
    };
});
exports.MetaService = {
    fetchDashboardMetaData,
    fetchHomeMetaData,
};
