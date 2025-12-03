"use strict";
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
    // SSLCommerz sometimes sends as query params (redirect) or as POST body
    return Object.keys(req.body || {}).length ? req.body : req.query;
};
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const payload = _getPayload(req);
    const result = yield payment_service_1.PaymentService.successPayment(payload);
    const tx = encodeURIComponent((_c = (_b = (_a = payload.transactionId) !== null && _a !== void 0 ? _a : payload.tranId) !== null && _b !== void 0 ? _b : payload.tran_id) !== null && _c !== void 0 ? _c : "");
    res.redirect(`${config_1.default.sslcommerz.success_frontend_url}?transactionId=${tx}&message=${encodeURIComponent((_d = result.message) !== null && _d !== void 0 ? _d : "success")}&status=PAID`);
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const payload = _getPayload(req);
    const result = yield payment_service_1.PaymentService.failPayment(payload);
    const tx = encodeURIComponent((_c = (_b = (_a = payload.transactionId) !== null && _a !== void 0 ? _a : payload.tranId) !== null && _b !== void 0 ? _b : payload.tran_id) !== null && _c !== void 0 ? _c : "");
    res.redirect(`${config_1.default.sslcommerz.fail_frontend_url}?transactionId=${tx}&message=${encodeURIComponent((_d = result.message) !== null && _d !== void 0 ? _d : "failed")}&status=FAILED`);
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const payload = _getPayload(req);
    const result = yield payment_service_1.PaymentService.cancelPayment(payload);
    const tx = encodeURIComponent((_c = (_b = (_a = payload.transactionId) !== null && _a !== void 0 ? _a : payload.tranId) !== null && _b !== void 0 ? _b : payload.tran_id) !== null && _c !== void 0 ? _c : "");
    res.redirect(`${config_1.default.sslcommerz.cancel_frontend_url}?transactionId=${tx}&message=${encodeURIComponent((_d = result.message) !== null && _d !== void 0 ? _d : "cancelled")}&status=CANCELLED`);
}));
exports.PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
};
