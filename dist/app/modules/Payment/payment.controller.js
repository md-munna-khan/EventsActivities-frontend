"use strict";
// // ...existing code...
// import { Request, Response } from "express";
// import { PaymentService } from "./payment.service";
// import { catchAsync } from "../../../shared/catchAsync";
// import config from "../../../config";
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
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const catchAsync_1 = require("../../../shared/catchAsync");
const config_1 = __importDefault(require("../../../config"));
const _getPayload = (req) => {
    // SSLCommerz sometimes sends form-urlencoded (POST) or query params (GET)
    if (req.method === "POST") {
        // If body empty but urlencoded available, Express should parse it if middleware present
        if (req.body && Object.keys(req.body).length)
            return req.body;
        // also check raw query fallback
        if (req.query && Object.keys(req.query).length)
            return req.query;
        return {};
    }
    // GET or others
    return (req.query && Object.keys(req.query).length) ? req.query : {};
};
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const payload = _getPayload(req);
    console.log("=== Payment Callback ===");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Raw body:", req.body); // express.urlencoded should have parsed this
    console.log("Query:", req.query);
    const result = yield payment_service_1.PaymentService.successPayment(payload);
    console.log(result);
    // normalize transaction id for frontend redirect
    const tx = encodeURIComponent((_d = (_c = (_b = (_a = payload.transactionId) !== null && _a !== void 0 ? _a : payload.tranId) !== null && _b !== void 0 ? _b : payload.tran_id) !== null && _c !== void 0 ? _c : payload.transaction_id) !== null && _d !== void 0 ? _d : "");
    if (!result.ok) {
        // redirect to frontend fail URL with message (so user sees info)
        const msg = encodeURIComponent(result.message || "Payment processing failed");
        return res.redirect(`${config_1.default.sslcommerz.fail_frontend_url}?transactionId=${tx}&message=${msg}&status=FAILED`);
    }
    const msg = encodeURIComponent(result.message || "Payment successful");
    return res.redirect(`${config_1.default.sslcommerz.success_frontend_url}?transactionId=${tx}&message=${msg}&status=PAID`);
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const payload = _getPayload(req);
    console.log("Payment callback (fail) - method:", req.method);
    console.log("Payload received:", payload);
    const result = yield payment_service_1.PaymentService.failPayment(payload);
    const tx = encodeURIComponent((_d = (_c = (_b = (_a = payload.transactionId) !== null && _a !== void 0 ? _a : payload.tranId) !== null && _b !== void 0 ? _b : payload.tran_id) !== null && _c !== void 0 ? _c : payload.transaction_id) !== null && _d !== void 0 ? _d : "");
    const msg = encodeURIComponent(result.message || "Payment failed");
    return res.redirect(`${config_1.default.sslcommerz.fail_frontend_url}?transactionId=${tx}&message=${msg}&status=FAILED`);
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const payload = _getPayload(req);
    console.log("Payment callback (cancel) - method:", req.method);
    console.log("Payload received:", payload);
    const result = yield payment_service_1.PaymentService.cancelPayment(payload);
    const tx = encodeURIComponent((_d = (_c = (_b = (_a = payload.transactionId) !== null && _a !== void 0 ? _a : payload.tranId) !== null && _b !== void 0 ? _b : payload.tran_id) !== null && _c !== void 0 ? _c : payload.transaction_id) !== null && _d !== void 0 ? _d : "");
    const msg = encodeURIComponent(result.message || "Payment cancelled");
    return res.redirect(`${config_1.default.sslcommerz.cancel_frontend_url}?transactionId=${tx}&message=${msg}&status=CANCELLED`);
}));
const listPayments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_service_1.PaymentService.listAllPayments();
    res.status(200).json({
        success: true,
        data: payments,
    });
}));
exports.PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    listPayments,
};
