// src/app/modules/Review/review.service.ts
import prisma from "../../../shared/prisma";

import httpStatus from "http-status-codes";

import ApiError from "../../errors/ApiError";

export const ReviewService = {
  async createReview(eventId: string, user: any, payload: { rating: number; comment?: string }) {
    // 1. validate rating range
    const rating = Math.floor(payload.rating);
    if (rating < 1 || rating > 5) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
    }

    // 2. fetch event and check hostId
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");

    // 2.1 Check if event is COMPLETED - users can only review completed events
    if (event.status !== "COMPLETED") {
      throw new ApiError(httpStatus.FORBIDDEN, "You can only review completed events");
    }

    // 3. ensure the user is a client and has confirmed participant
    const client = await prisma.client.findUnique({ where: { email: user.email } });
    if (!client) throw new ApiError(httpStatus.UNAUTHORIZED, "Client profile not found");
    const participant = await prisma.eventParticipant.findFirst({
      where: { eventId, clientId: client.id, participantStatus: "CONFIRMED" },
    });
    if (!participant) {
      throw new ApiError(httpStatus.FORBIDDEN, "You can only review events you attended");
    }

    // 4. prevent duplicate review for same event by same client
    const existing = await prisma.review.findFirst({
      where: { eventId, clientId: client.id },
    });
    if (existing) throw new ApiError(httpStatus.CONFLICT, "You have already reviewed this event");

    // 5. create review and update host's rating atomically
    return await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          rating,
          comment: payload.comment,
          eventId,
          clientId: client.id,
          hostId: event.hostId,
        },
      });

      // update host aggregate rating
      const host = await tx.host.findUnique({ where: { id: event.hostId } });
      if (!host) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Host not found");

      const newCount = host.ratingCount + 1;
      const newRating = (((host.rating ?? 0) * host.ratingCount) + rating) / newCount;

      await tx.host.update({
        where: { id: host.id },
        data: { rating: newRating, ratingCount: newCount },
      });

      return review;
    });
  },

  async listHostReviews(hostId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.review.findMany({
        where: { hostId },
        include: { client: { select: { id: true, name: true, profilePhoto: true } }, event: { select: { id: true, title: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { hostId } }),
    ]);
    return { data, meta: { total, page, limit } };
  },
};