

// src/app/modules/Payment/payment.controller.ts
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../../shared/catchAsync";
import config from "../../../config";

const _getPayload = (req: Request) => {
  // SSLCommerz sometimes sends form-urlencoded (POST) or query params (GET)
  if (req.method === "POST") {
    // If body empty but urlencoded available, Express should parse it if middleware present
    if (req.body && Object.keys(req.body).length) return req.body;
    // also check raw query fallback
    if (req.query && Object.keys(req.query).length) return req.query;
    return {};
  }
  // GET or others
  return (req.query && Object.keys(req.query).length) ? req.query : {};
};

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = _getPayload(req);
 console.log("=== Payment Callback ===");
console.log("Method:", req.method);
console.log("URL:", req.originalUrl);
console.log("Headers:", JSON.stringify(req.headers, null, 2));
console.log("Raw body:", req.body);   // express.urlencoded should have parsed this
console.log("Query:", req.query);


  const result = await PaymentService.successPayment(payload);
console.log(result)

  const tx = encodeURIComponent(payload.transactionId ?? payload.tranId ?? payload.tran_id ?? payload.transaction_id ?? "");

  if (!result.ok) {

    const msg = encodeURIComponent(result.message || "Payment processing failed");
    return res.redirect(`${config.sslcommerz.fail_frontend_url}?transactionId=${tx}&message=${msg}&status=FAILED`);
  }

  const msg = encodeURIComponent(result.message || "Payment successful");
  return res.redirect(`${config.sslcommerz.success_frontend_url}?transactionId=${tx}&message=${msg}&status=PAID`);
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = _getPayload(req);
  console.log("Payment callback (fail) - method:", req.method);
  console.log("Payload received:", payload);

  const result = await PaymentService.failPayment(payload);
  const tx = encodeURIComponent(payload.transactionId ?? payload.tranId ?? payload.tran_id ?? payload.transaction_id ?? "");
  const msg = encodeURIComponent(result.message || "Payment failed");

  return res.redirect(`${config.sslcommerz.fail_frontend_url}?transactionId=${tx}&message=${msg}&status=FAILED`);
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = _getPayload(req);
  console.log("Payment callback (cancel) - method:", req.method);
  console.log("Payload received:", payload);

  const result = await PaymentService.cancelPayment(payload);
  const tx = encodeURIComponent(payload.transactionId ?? payload.tranId ?? payload.tran_id ?? payload.transaction_id ?? "");
  const msg = encodeURIComponent(result.message || "Payment cancelled");

  return res.redirect(`${config.sslcommerz.cancel_frontend_url}?transactionId=${tx}&message=${msg}&status=CANCELLED`);
});

const listPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await PaymentService.listAllPayments();
  res.status(200).json({
    success: true,
    data: payments,
  });
});
export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  listPayments,
};
