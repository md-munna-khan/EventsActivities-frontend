// src/app/modules/Review/review.service.ts
import prisma from "../../../shared/prisma";
import httpStatus from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { jwtHelper } from "../../../helpers/jwtHelper";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

export const ReviewService = {
  async createReview(
    eventId: string,
    user: any,
    payload: { rating: number; comment?: string }
  ) {

    const ratingRaw = Number(payload.rating);
    if (!Number.isFinite(ratingRaw)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid rating value");
    }
    const rating = Math.floor(ratingRaw);
    if (rating < 1 || rating > 5) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
    }

   
    let userId: string | undefined;
    let email: string | undefined;

    if (user?.id) userId = user.id;
    if (user?.email) email = user.email;


    if (!userId && !email && user?.accessToken) {
      try {
        const decoded = jwtHelper.verifyToken(
          user.accessToken,
          config.jwt.jwt_secret as Secret
        ) as any;
      
        userId = decoded?.id ?? decoded?.userId ?? decoded?.sub ?? userId;
        email = decoded?.email ?? email;
      } catch (err) {
  
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
      }
    }

 
    if (userId && !email) {
      const u = await prisma.user.findUnique({ where: { id: userId } });
      if (!u) throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      email = u.email;
    }

    if (!email) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unable to identify user");
    }

   
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
    if (event.status !== "COMPLETED") {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You can only review completed events"
      );
    }

  
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Client profile not found");
    }


    const participant = await prisma.eventParticipant.findFirst({
      where: {
        eventId,
        clientId: client.id,
        participantStatus: "CONFIRMED",
      },
    });
    if (!participant) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You can only review events you attended"
      );
    }


    const existing = await prisma.review.findFirst({
      where: { eventId, clientId: client.id },
    });
    if (existing) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "You have already reviewed this event"
      );
    }

    
    return await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          rating,
          comment: payload.comment ?? null,
          eventId,
          clientId: client.id,
          hostId: event.hostId,
        },
      });

   
      const host = await tx.host.findUnique({ where: { id: event.hostId } });
      if (!host)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Host not found");

      const currentCount = host.ratingCount ?? 0;
      const currentRating = host.rating ?? 0;
      const newCount = currentCount + 1;

      const newRating = ((currentRating * currentCount) + rating) / newCount;

      await tx.host.update({
        where: { id: host.id },
        data: { rating: newRating, ratingCount: newCount },
      });

      return review;
    });
  },

  async listHostReviews(id: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.review.findMany({
        where: { eventId: id },
        include: {
          client: {
            select: { id: true, name: true, profilePhoto: true },
          },
          event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { eventId: id } }),
    ]);
    return { data, meta: { total, page, limit } };
  },


};
