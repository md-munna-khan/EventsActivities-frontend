import prisma from "../../../shared/prisma";
import { PaymentStatus, ParticipantStatus, EventStatus } from "@prisma/client";

const _normalizeTran = (query: Record<string, string>) => {
  return (query.transactionId ?? query.tranId ?? query.tran_id ?? query.transaction_id) as string;
};

const successPayment = async (query: Record<string, string>) => {
  const tranId = _normalizeTran(query);
  if (!tranId) throw new Error("transaction id is required");

  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { tranId } });
    if (!payment) throw new Error("Payment not found");

    // update payment to PAID
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.PAID },
    });

    // find participant and set CONFIRMED
    const participant = await tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
    if (!participant) throw new Error("Participant not found for this payment");

    await tx.eventParticipant.update({
      where: { id: participant.id },
      data: { participantStatus: ParticipantStatus.CONFIRMED },
    });

    // distribute income: 90% host, 10% admin
    const adminShare = Number(payment.amount) * 0.1;
    const hostShare = Number(payment.amount) * 0.9;

    // increment host income
    await tx.host.update({
      where: { id: payment.hostId },
      data: { income: { increment: hostShare } },
    });

    // pick an admin (first non-deleted) and increment income if exists
    const admin = await tx.admin.findFirst({ where: { isDeleted: false } });
    if (admin) {
      await tx.admin.update({
        where: { id: admin.id },
        data: { income: { increment: adminShare } },
      });
    }

    return { message: "Payment successful and processed.", payment: updatedPayment, participantId: participant.id };
  });
};

const _failOrCancel = async (query: Record<string, string>, reason: "FAILED" | "CANCELLED") => {
  const tranId = _normalizeTran(query);
  if (!tranId) throw new Error("transaction id is required");

  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { tranId } });
    if (!payment) throw new Error("Payment not found");

    const participant = await tx.eventParticipant.findFirst({ where: { paymentId: payment.id } });
    if (!participant) throw new Error("Participant not found for this payment");

    // set participant LEFT
    await tx.eventParticipant.update({
      where: { id: participant.id },
      data: { participantStatus: ParticipantStatus.LEFT },
    });

    // delete the payment record
    await tx.payment.delete({ where: { id: payment.id } });

    // restore event capacity and status if needed
    const event = await tx.event.findUnique({ where: { id: payment.eventId } });
    if (event) {
      const restoredCapacity = event.capacity + 1;
      const newStatus = event.status === EventStatus.FULL ? EventStatus.OPEN : event.status;
      await tx.event.update({
        where: { id: event.id },
        data: { capacity: restoredCapacity, status: newStatus },
      });
    }

    return { message: reason === "CANCELLED" ? "Payment cancelled" : "Payment failed" };
  });
};

const failPayment = async (query: Record<string, string>) => {
  return _failOrCancel(query, "FAILED");
};

const cancelPayment = async (query: Record<string, string>) => {
  return _failOrCancel(query, "CANCELLED");
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};