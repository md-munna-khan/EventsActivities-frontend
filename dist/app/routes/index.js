"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const admin_routes_1 = require("../modules/Admin/admin.routes");
const host_routes_1 = require("../modules/Host/host.routes");
const event_routes_1 = require("../modules/Events/event.routes");
const payment_routes_1 = require("../modules/Payment/payment.routes");
const review_routes_1 = require("../modules/Review/review.routes");
const meta_routes_1 = require("../modules/Meta/meta.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes
    },
    {
        path: '/user',
        route: user_routes_1.userRoutes
    },
    {
        path: '/admin',
        route: admin_routes_1.AdminRoutes
    },
    {
        path: '/events',
        route: event_routes_1.eventsRoutes
    },
    {
        path: '/hosts',
        route: host_routes_1.hostsRoutes
    },
    {
        path: '/payment',
        route: payment_routes_1.PaymentRoutes
    },
    {
        path: '/review',
        route: review_routes_1.ReviewRoutes
    },
    {
        path: '/meta',
        route: meta_routes_1.MetaRoutes
    },
    // Add more module routes here
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
