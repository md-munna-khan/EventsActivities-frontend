"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";

export async function getUserProfile(userId: string) {
  try {
    const response = await serverFetch.get(`/user/profile/${userId}`);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to fetch user profile",
    };
  }
}

export async function getUserEvents(userId: string, type: "hosted" | "joined" = "joined") {
  try {
    const endpoint = type === "hosted" 
      ? `/user/${userId}/hosted-events`
      : `/user/${userId}/joined-events`;
    
    const response = await serverFetch.get(endpoint);
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching user events:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch events",
    };
  }
}

export async function getMyProfile() {
  try {
    const response = await serverFetch.get("/user/me");
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching my profile:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to fetch profile",
    };
  }
}

export async function updateMyProfile(formData: FormData) {
  try {
    const response = await fetch("/user/update-my-profile", {
      method: "PATCH",
      body: formData,
    });
    
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

