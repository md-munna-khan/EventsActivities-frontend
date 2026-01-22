/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";

export async function homeMeta() {
  try {
    const response = await serverFetch.get('/meta/home-meta');
    const result = await response.json();

 
    return {
      statusCode: result?.statusCode ?? response.status,
      success: result?.success ?? Boolean(response.ok),
      message: result?.message ?? (response.ok ? 'Home meta data retrieval successful' : 'Failed to retrieve home meta data'),
      data: result?.data ?? null,
    };
  } catch (error: any) {
    console.error("Error fetching home metadata:", error);
    return {
      statusCode: 500,
      success: false,
      message: error?.message || "Failed to fetch home metadata",
      data: null,
    };
  }
}