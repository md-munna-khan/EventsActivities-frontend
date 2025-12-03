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
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const _normalizeTran = (query) => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = query.transactionId) !== null && _a !== void 0 ? _a : query.tranId) !== null && _b !== void 0 ? _b : query.tran_id) !== null && _c !== void 0 ? _c : query.transaction_id);
};
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = _normalizeTran(query);
    if (!tranId)
        throw new Error("transaction id is required");
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.findUnique({ where: { tranId } });
        if (!payment)
            throw new Error("Payment not found");
        // update payment to PAID
        const updatedPayment = yield tx.payment.update({
            where: { id: payment.id },
            data: { status: client_1.PaymentStatus.PAID },
        });
        // find participant and set CONFIRMED
        const participant = yield tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
        if (!participant)
            throw new Error("Participant not found for this payment");
        yield tx.eventParticipant.update({
            where: { id: participant.id },
            data: { participantStatus: client_1.ParticipantStatus.CONFIRMED },
        });
        // distribute income: 90% host, 10% admin
        const adminShare = Number(payment.amount) * 0.1;
        const hostShare = Number(payment.amount) * 0.9;
        // increment host income
        yield tx.host.update({
            where: { id: payment.hostId },
            data: { income: { increment: hostShare } },
        });
        // pick an admin (first non-deleted) and increment income if exists
        const admin = yield tx.admin.findFirst({ where: { isDeleted: false } });
        if (admin) {
            yield tx.admin.update({
                where: { id: admin.id },
                data: { income: { increment: adminShare } },
            });
        }
        return { message: "Payment successful and processed.", payment: updatedPayment, participantId: participant.id };
    }));
});
const _failOrCancel = (query, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = _normalizeTran(query);
    if (!tranId)
        throw new Error("transaction id is required");
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.findUnique({ where: { tranId } });
        if (!payment)
            throw new Error("Payment not found");
        const participant = yield tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
        if (!participant)
            throw new Error("Participant not found for this payment");
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
        return { message: reason === "CANCELLED" ? "Payment cancelled" : "Payment failed" };
    }));
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return _failOrCancel(query, "FAILED");
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return _failOrCancel(query, "CANCELLED");
});
exports.PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
};
