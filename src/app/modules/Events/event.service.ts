
import prisma from "../../../shared/prisma";
import config from "../../../config";

import { jwtHelper } from "../../../helpers/jwtHelper";
import { Secret } from "jsonwebtoken";
import { PaymentStatus, ParticipantStatus, EventStatus } from "@prisma/client";
import { SSLService } from "../SSlCommerz/sslCommerz.service";

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const joinEvent = async (eventId: string, user: any) => {
  try {
    // user can be either decoded token (req.user) or object with accessToken
    let email: string | undefined;
    if (user && typeof user.email === 'string') {
      email = user.email;
    } else if (user && typeof user.accessToken === 'string') {
      const decodedData = jwtHelper.verifyToken(user.accessToken, config.jwt.jwt_secret as Secret);
      email = (decodedData as any).email;
    }

    if (!email) throw new Error('Unauthorized: missing user email');

    // Find the client linked to this user
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) throw new Error("Unauthorized: Client profile not found");

    const clientId = client.id;

    // Use a transaction callback so DB changes roll back if SSL init fails
    const result = await prisma.$transaction(async (tx) => {
      // re-fetch event inside transaction and include participants count
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { participants: true },
      });
      if (!event) throw new Error("Event not found");
      if (event.status !== EventStatus.OPEN) throw new Error("Cannot join an inactive event");

      // prevent duplicate join
      const alreadyJoined = await tx.eventParticipant.findFirst({
        where: { eventId, clientId },
      });
      if (alreadyJoined) throw new Error("You have already joined this event");

      // check capacity
      if (event.capacity <= 0) throw new Error("Event is full");

      const amount = event.joiningFee;
      const tranId = getTransactionId();

      // create payment (PENDING)
      const payment = await tx.payment.create({
        data: {
          amount,
          eventId,
          clientId,
          hostId: event.hostId,
          tranId,
          currency: "BDT",
          status: PaymentStatus.PENDING,
        },
      });

      // create participant with PENDING status and link payment
      const participant = await tx.eventParticipant.create({
        data: {
          eventId,
          clientId,
          paymentId: payment.id,
          participantStatus: ParticipantStatus.PENDING,
        },
      });

      // decrement capacity and possibly set event status to FULL
      const newCapacity = event.capacity - 1;
      const newStatus = newCapacity <= 0 ? EventStatus.FULL : event.status;
      await tx.event.update({
        where: { id: eventId },
        data: { capacity: newCapacity, status: newStatus },
      });

      // prepare ssl payload using client info (use fields you have on client)
      const sslPayload = {
        address: client.location ?? "N/A",
        email: client.email,
        phoneNumber: client.contactNumber ?? "N/A",
        name: client.name,
        amount,
        transactionId: tranId,
        success_url: `${config.sslcommerz.success_backend_url}`, // server endpoints
        fail_url: `${config.sslcommerz.fail_backend_url}`,
        cancel_url: `${config.sslcommerz.cancel_backend_url}`,
        ipn_url: `${config.sslcommerz.ipn_url}`,
      };

      // initiate SSLCommerz payment (external). If this throws, transaction will rollback.
      const sslResponse = await SSLService.sslPaymentInit(sslPayload);

      return {
        paymentUrl: sslResponse.GatewayPageURL,
        paymentId: payment.id,
        participantId: participant.id,
        eventId: event.id,
        tranId,
      };
    }); // end transaction

    return {
      paymentUrl: result.paymentUrl,
      paymentId: result.paymentId,
      participantId: result.participantId,
      eventId: result.eventId,
      transactionId: result.tranId,
    };
  } catch (error: any) {
    console.error("joinEvent Error:", error.message);
    throw new Error(error.message || "Something went wrong joining event");
  }
};

const leaveEvent = async (eventId: string, user: any) => {
  // Extract client email
  let clientEmail: string | undefined;
  if (user?.email) {
    clientEmail = user.email;
  } else if (user?.accessToken) {
    const decodedData = jwtHelper.verifyToken(user.accessToken, config.jwt.jwt_secret as Secret);
    clientEmail = (decodedData as any).email;
  }

  if (!clientEmail) throw new Error("Unable to identify user");

  // Find client by email
  const client = await prisma.client.findUnique({ where: { email: clientEmail } });
  if (!client) throw new Error("Client profile not found");

  const clientId = client.id;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { participants: true },
  });
  
  const existing = await prisma.eventParticipant.findFirst({
    where: { eventId, clientId },
  });
  
  if (!existing) throw new Error("You are not joined to this event");

  // delete participant and restore capacity (no transaction for simplicity but you can wrap if needed)
  await prisma.eventParticipant.delete({ where: { id: existing.id } });

  if (event) {
    const restoredCapacity = event.capacity + 1;
    const newStatus = event.status === EventStatus.FULL ? EventStatus.OPEN : event.status;
    await prisma.event.update({
      where: { id: eventId },
      data: { capacity: restoredCapacity, status: newStatus },
    });
  }

  return { id: existing.id };
};

export const getMyBookings = async (user: any, eventId?: string) => {
  try {
    let clientEmail: string | undefined;

    // Extract client email from user object or JWT
    if (user?.email) {
      clientEmail = user.email;
    } else if (user?.accessToken) {
      const decodedData = jwtHelper.verifyToken(
        user.accessToken,
        config.jwt.jwt_secret as Secret
      );
      clientEmail = (decodedData as any).email;
    }

    if (!clientEmail) {
      throw new Error("Unable to identify user");
    }

    // Build Prisma where condition
    const whereCondition: any = {
      client: { email: clientEmail } // filter by email
    };

    if (eventId) {
      whereCondition.eventId = eventId;
    }

    // Fetch bookings with all details
    const bookings = await prisma.eventParticipant.findMany({
      where: whereCondition,
      include: {
        event: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
                rating: true,
               
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            tranId: true,
            createdAt: true
          }
        },
      
      },
    
      orderBy: { createdAt: 'desc' }
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
};


export const eventsService = {
  joinEvent,
  leaveEvent,
  getMyBookings,
};