/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function createEventReview(eventId: string, rating: number, comment: string) {
  try {
    if (!comment || !comment.trim()) {
      return {
        success: false,
        message: "Comment cannot be empty",
      };
    }

    if (rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Rating must be between 1 and 5 stars",
      };
    }

    const response = await serverFetch.post(`/review/${eventId}/reviews`, {
      body: JSON.stringify({ rating, comment }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  

    const result = await response.json();


    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "You must be logged in to review this event",
        };
      }
      if (response.status === 403) {
        return {
          success: false,
          message: result.message || "You cannot review this event. Make sure you attended it.",
        };
      }
      if (response.status === 409) {
        return {
          success: false,
          message: "You have already reviewed this event",
        };
      }
    }

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create review";
    console.error("Error creating review:", error);
    return {
      success: false,
      message: message,
    };
  }
}

export async function getEventReviews(eventId: string) {
  try {
    const response = await serverFetch.get (`/review/${eventId}/reviews`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: result.message || "Failed to fetch reviews",
      };
    }

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      data: [],
      message: message,
    };
  }
}



