/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

import { loginUser } from "./loginUser";
import { createClientValidation } from "@/zod/auth.validation";

export const registerClient = async (_currentState: any, formData: FormData): Promise<any> => {
  try {
    // Helper: safely extract a string from FormData
    const getString = (key: string) => {
      if (typeof formData.get !== "function") return "";
      const v = formData.get(key);
      return v === null ? "" : String(v);
    };

    // Interests: support multiple checkboxes (formData.getAll) or single entry
    const rawInterests = typeof formData.getAll === "function"
      ? formData.getAll("interests")
      : (formData.get("interests") ? [formData.get("interests")] : []);
    const interestsArray = Array.isArray(rawInterests) ? rawInterests.map((i: any) => String(i)) : [];

    // Build payload according to your Zod schema
    const payload = {
      password: getString("password"),
      client: {
        name: getString("name"),
        email: getString("email"),
        bio: getString("bio"),
        contactNumber: getString("contactNumber"),
        location: getString("location"),
        interests: interestsArray,
        // profilePhoto omitted on purpose — backend may set after upload
      },
    };

    // Debug: quick log of payload before validation
    console.log("[registerClient] payload before validation:", payload);

    // Validate payload with Zod
    const validationResult = zodValidator(payload, createClientValidation);
    if (validationResult.success === false) {
      // log details to help debugging (zodValidator's structure may vary)
      console.warn("[registerClient] validation failed:", validationResult);
      return validationResult;
    }
    const validatedPayload: any = validationResult.data;

    // Detect incoming file (either key 'file' or 'profilePhoto' from the original form)
    const incomingFile = (typeof formData.get === "function") ? (formData.get("file") ?? formData.get("profilePhoto")) : null;
    const hasFile = incomingFile && incomingFile instanceof File && incomingFile.size > 0;

    // Debug: show whether file was detected
    console.log("[registerClient] hasFile:", hasFile);

    let res: Response;
    if (hasFile) {
      // Build multipart FormData: include JSON data as a field + file
      const newFormData = new FormData();
      newFormData.append("data", JSON.stringify(validatedPayload));
      newFormData.append("file", incomingFile as File);

      // Debug: list FormData entries (can't show file binary, but will show key)
      for (const entry of newFormData.entries()) {
        console.log("[registerClient] newFormData entry:", entry[0], entry[1]);
      }

      // Do NOT set Content-Type manually — let serverFetch/browser set boundary
      res = await serverFetch.post("/user/create-client", {
        body: newFormData,
      });
    } else {
      // No file: send JSON (ensure Content-Type header present)
      res = await serverFetch.post("/user/create-client", {
        body: JSON.stringify(validatedPayload),
        headers: { "Content-Type": "application/json" },
      });
    }

    // Debug: response status
    console.log("[registerClient] fetch response status:", res.status);

    const result = await res.json();

    // Debug: full result
    console.log("[registerClient] server result:", result);

    if (result.success) {
      // Auto-login: create small FormData with only email & password
      // NOTE: if your loginUser expects a plain object, change this to loginUser(_currentState, { email, password })
      try {
        const loginForm = new FormData();
        loginForm.append("email", validatedPayload.client.email);
        loginForm.append("password", validatedPayload.password);
        await loginUser(_currentState, loginForm);
      } catch (loginErr) {
        console.warn("[registerClient] Auto-login failed (non-blocking):", loginErr);
      }
    }

    return result;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error("[registerClient] error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error?.message ?? "Registration Failed"
          : "Registration Failed. Please try again.",
    };
  }
};
