/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";

export async function applyHost() {
  try {
    const response = await serverFetch.post("/auth/apply-host");

    const result = await response.json();
    return result;

  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}
