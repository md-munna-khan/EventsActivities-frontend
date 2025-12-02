import express from "express";
import { PaymentController } from "./payment.controller";



const router = express.Router();


router.get("/success", PaymentController.successPayment);
router.get("/fail", PaymentController.failPayment);
router.get("/cancel", PaymentController.cancelPayment);

export const PaymentRoutes = router;
