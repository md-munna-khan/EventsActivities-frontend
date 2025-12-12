"use strict";
// import express from "express";
// import { PaymentController } from "./payment.controller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
// const router = express.Router();
// router.post("/success", PaymentController.successPayment);
// router.get("/success", PaymentController.successPayment);
// router.post("/fail", PaymentController.failPayment);
// router.get("/fail", PaymentController.failPayment);
// router.post("/cancel", PaymentController.cancelPayment);
// router.get("/cancel", PaymentController.cancelPayment);
// // router.post("/success", PaymentController.successPayment);
// // router.post("/fail", PaymentController.failPayment);
// // router.post("/cancel", PaymentController.cancelPayment);
// export const PaymentRoutes = router;
// src/app/modules/Payment/payment.routes.ts (or where your router is)
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
// prefer POST for callbacks; keep GET only for manual testing if you want
router.post("/success", payment_controller_1.PaymentController.successPayment);
router.get("/success", payment_controller_1.PaymentController.successPayment);
router.post("/fail", payment_controller_1.PaymentController.failPayment);
router.get("/fail", payment_controller_1.PaymentController.failPayment);
router.post("/cancel", payment_controller_1.PaymentController.cancelPayment);
router.get("/cancel", payment_controller_1.PaymentController.cancelPayment);
router.get("/payments-history", payment_controller_1.PaymentController.listPayments);
exports.PaymentRoutes = router;
