




import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();


router.post("/success", PaymentController.successPayment);
router.get("/success", PaymentController.successPayment);

router.post("/fail", PaymentController.failPayment);
router.get("/fail", PaymentController.failPayment);

router.post("/cancel", PaymentController.cancelPayment);
router.get("/cancel", PaymentController.cancelPayment);

router.get("/payments-history", PaymentController.listPayments);

export const PaymentRoutes = router;

