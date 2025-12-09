// "use server";

// /* eslint-disable @typescript-eslint/no-explicit-any */


"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";




export async function joinEvent(eventId: string) {
  try {
    const response = await serverFetch.post(`/events/${eventId}/join`);
    // DEBUG: show raw response status + headers if available
    console.log("joinEvent response status:", response.status);
    const result = await response.json();
    console.log("joinEvent parsed result:", result);
    return result;
  } catch (error: any) {
    console.error("Error joining event:", error);
    return {
      success: false,
      message: error.message || "Failed to join event",
    };
  }
}

export async function leaveEvent(eventId: string) {
  try {
    const response = await serverFetch.post(`/events/${eventId}/leave`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error leaving event:", error);
    return {
      success: false,
      message: error.message || "Failed to leave event",
    };
  }
}

export async function checkEventParticipation(eventId: string) {
  try {
    const response = await serverFetch.get(`/events/${eventId}/participation-status`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    // If endpoint doesn't exist, return not joined
    return {
      success: false,
      data: { isJoined: false },
    };
  }
}

export async function getUserBookings() {
  try {
    const response = await serverFetch.get('/events/my-bookings');
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching user bookings:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch user bookings",
    };
  }
}