// src/app/modules/Review/review.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";

import { sendResponse } from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { id: eventId } = req.params; // route: /events/:id/reviews
  const user = (req as any).user || req.cookies // Get user from auth middleware
  
  if (!user) {
    throw new Error("User information is missing in the request");
  }

  const payload = { rating: Number(req.body.rating), comment: req.body.comment };
  const review = await ReviewService.createReview(eventId, user, payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created",
    data: review,
  });
});

const listHostReviews = catchAsync(async (req: Request, res: Response) => {
  const { hostId } = req.params;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const result = await ReviewService.listHostReviews(hostId, page, limit);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews fetched",
    meta: result.meta,
    data: result.data,
  });
});

// const allReviews = catchAsync(async (req: Request, res: Response) => {
//   const result = await ReviewService.allReviews();
//   sendResponse(res, { 
//     statusCode: 200,
//     success: true,
//     message: "All reviews fetched",
//     data: result 
//   });
// });

export const ReviewController = { createReview, listHostReviews };