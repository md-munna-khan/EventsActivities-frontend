"use strict";
// import prisma from "../../../shared/prisma";
// import { PaymentStatus, ParticipantStatus, EventStatus } from "@prisma/client";
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
exports.PaymentService = void 0;
// const _normalizeTran = (query: Record<string, string>) => {
//   return (query.transactionId ?? query.tranId ?? query.tran_id ?? query.transaction_id) as string;
// };
// const successPayment = async (query: Record<string, string>) => {
//   const tranId = _normalizeTran(query);
//   console.log("Processing success payment for transaction ID:", tranId);
//   if (!tranId) throw new Error("transaction id is required");
//   return await prisma.$transaction(async (tx) => {
//     const payment = await tx.payment.findUnique({ where: { tranId } });
//     if (!payment) throw new Error("Payment not found");
//     // update payment to PAID
//     const updatedPayment = await tx.payment.update({
//       where: { id: payment.id },
//       data: { status: PaymentStatus.PAID },
//     });
//     // find participant and set CONFIRMED
//     const participant = await tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
//     if (!participant) throw new Error("Participant not found for this payment");
//     await tx.eventParticipant.update({
//       where: { id: participant.id },
//       data: { participantStatus: ParticipantStatus.CONFIRMED },
//     });
//     // distribute income: 90% host, 10% admin
//     const adminShare = Number(payment.amount) * 0.1;
//     const hostShare = Number(payment.amount) * 0.9;
//     // increment host income
//     await tx.host.update({
//       where: { id: payment.hostId },
//       data: { income: { increment: hostShare } },
//     });
//     // pick an admin (first non-deleted) and increment income if exists
//     const admin = await tx.admin.findFirst({ where: { isDeleted: false } });
//     if (admin) {
//       await tx.admin.update({
//         where: { id: admin.id },
//         data: { income: { increment: adminShare } },
//       });
//     }
//     return { message: "Payment successful and processed.", payment: updatedPayment, participantId: participant.id };
//   });
// };
// const _failOrCancel = async (query: Record<string, string>, reason: "FAILED" | "CANCELLED") => {
//   const tranId = _normalizeTran(query);
//   if (!tranId) throw new Error("transaction id is required");
//   return await prisma.$transaction(async (tx) => {
//     const payment = await tx.payment.findUnique({ where: { tranId } });
//     console.log("Processing fail/cancel payment for transaction ID:", tranId);
//     if (!payment) throw new Error("Payment not found");
//     const participant = await tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
//     if (!participant) throw new Error("Participant not found for this payment");
//     // set participant LEFT
//     await tx.eventParticipant.update({
//       where: { id: participant.id },
//       data: { participantStatus: ParticipantStatus.LEFT },
//     });
//     // delete the payment record
//     await tx.payment.delete({ where: { id: payment.id } });
//     // restore event capacity and status if needed
//     const event = await tx.event.findUnique({ where: { id: payment.eventId } });
//     if (event) {
//       const restoredCapacity = event.capacity + 1;
//       const newStatus = event.status === EventStatus.FULL ? EventStatus.OPEN : event.status;
//       await tx.event.update({
//         where: { id: event.id },
//         data: { capacity: restoredCapacity, status: newStatus },
//       });
//     }
//     return { message: reason === "CANCELLED" ? "Payment cancelled" : "Payment failed" };
//   });
// };
// const failPayment = async (query: Record<string, string>) => {
//   return _failOrCancel(query, "FAILED");
// };
// const cancelPayment = async (query: Record<string, string>) => {
//   return _failOrCancel(query, "CANCELLED");
// };
// export const PaymentService = {
//   successPayment,
//   failPayment,
//   cancelPayment,
// };
// src/app/modules/Payment/payment.service.ts
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const _normalizeTran = (payload = {}) => {
    // catch all common keys that gateways send
    return (payload.transactionId ||
        payload.tranId ||
        payload.tran_id ||
        payload.transaction_id ||
        payload.tran_id_sslcommerz || // in case
        null);
};
const successPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = _normalizeTran(payload);
    console.log(tranId);
    if (!tranId) {
        // don't throw raw — return info so controller can handle redirect
        return { ok: false, message: "transaction id missing", tranId: null, debug: payload };
    }
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.findUnique({ where: { tranId } });
        if (!payment) {
            return { ok: false, message: "Payment record not found", tranId, debug: payload };
        }
        // update payment to PAID
        const updatedPayment = yield tx.payment.update({
            where: { id: payment.id },
            data: { status: client_1.PaymentStatus.PAID },
        });
        // find participant and set CONFIRMED
        const participant = yield tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
        if (!participant) {
            return { ok: false, message: "Participant not found for this payment", tranId, paymentId: payment.id };
        }
        yield tx.eventParticipant.update({
            where: { id: participant.id },
            data: { participantStatus: client_1.ParticipantStatus.CONFIRMED },
        });
        // distribute income safely (guard nulls)
        const amount = Number(payment.amount) || 0;
        const adminShare = amount * 0.1;
        const hostShare = amount * 0.9;
        if (payment.hostId) {
            yield tx.host.update({
                where: { id: payment.hostId },
                data: { income: { increment: hostShare } },
            });
        }
        const admin = yield tx.admin.findFirst({ where: { isDeleted: false } });
        if (admin) {
            yield tx.admin.update({
                where: { id: admin.id },
                data: { income: { increment: adminShare } },
            });
        }
        return { ok: true, message: "Payment successful and processed.", payment: updatedPayment, participantId: participant.id, tranId };
    }));
});
const _failOrCancel = (payload, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = _normalizeTran(payload);
    if (!tranId) {
        return { ok: false, message: "transaction id missing", tranId: null, debug: payload };
    }
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.findUnique({ where: { tranId } });
        if (!payment) {
            return { ok: false, message: "Payment not found", tranId };
        }
        const participant = yield tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
        if (!participant) {
            // maybe payment created but participant not linked — handle gracefully
            yield tx.payment.delete({ where: { id: payment.id } });
            return { ok: false, message: "Participant not found; payment removed", tranId };
        }
        // set participant LEFT
        yield tx.eventParticipant.update({
            where: { id: participant.id },
            data: { participantStatus: client_1.ParticipantStatus.LEFT },
        });
        // delete the payment record
        yield tx.payment.delete({ where: { id: payment.id } });
        // restore event capacity and status if needed
        const event = yield tx.event.findUnique({ where: { id: payment.eventId } });
        if (event) {
            const restoredCapacity = event.capacity + 1;
            const newStatus = event.status === client_1.EventStatus.FULL ? client_1.EventStatus.OPEN : event.status;
            yield tx.event.update({
                where: { id: event.id },
                data: { capacity: restoredCapacity, status: newStatus },
            });
        }
        return { ok: true, message: reason === "CANCELLED" ? "Payment cancelled" : "Payment failed", tranId };
    }));
});
const failPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () { return _failOrCancel(payload, "FAILED"); });
const cancelPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () { return _failOrCancel(payload, "CANCELLED"); });
const listAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.payment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            client: { select: { id: true, name: true, email: true } },
            event: { select: { id: true, title: true } },
        },
    });
});
exports.PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    listAllPayments
};
