
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createClientValidation } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";

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

    // Build payload according to your Zod schema (keep field names same as your form)
    const payload = {
      password: getString("password"),
      client: {
        name: getString("name"),
        email: getString("email"),
        bio: getString("bio"),
        contactNumber: getString("contactNumber"),
        location: getString("location"),
        interests: interestsArray,
        // profilePhoto/file handled separately below
      },
    };

    // Validate with Zod
    const validation = zodValidator(payload, createClientValidation);
    if (validation.success === false) {
      return {
        success: false,
        errors: validation.errors,
        message: "Please fix the validation errors and try again",
      };
    }
    const validatedPayload: any = validation.data;


    // Detect incoming file (either key 'file' or 'profilePhoto' from the original form)
    const incomingFile = typeof formData.get === "function" ? (formData.get("file") ?? formData.get("profilePhoto")) : null;
    const hasFile = incomingFile && incomingFile instanceof File && incomingFile.size > 0;

    // Prepare request body
    let res: Response;
    if (hasFile) {
      const newFormData = new FormData();
      newFormData.append("data", JSON.stringify({
        password: validatedPayload.password,
        client: validatedPayload.client,
      }));
      newFormData.append("file", incomingFile as File);

      res = await serverFetch.post("/user/create-client", {
        body: newFormData, 
      });
    } else {
      res = await serverFetch.post("/user/create-client", {
        body: JSON.stringify({
          password: validatedPayload.password,
          client: validatedPayload.client,
        }),
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await res.json();

    if (result.success) {
      // Try to normalize token and user from common possible shapes
      const token = result?.data?.token ?? result?.token ?? result?.accessToken ?? result?.data?.accessToken ?? null;
      const userFromApi = result?.data?.user ?? result?.data?.client ?? null;

      if (token) {
        // Return consistent shape so client can persist auth (localStorage / context)
        return {
          success: true,
          message: result.message ?? "Registration successful",
          data: {
            user: userFromApi ?? validatedPayload.client,
            token,
            raw: result,
          },
        };
      }

      // Fallback: try auto-login (keeps original behavior when backend doesn't return token)
      try {
        // reuse original formData for loginUser as your loginUser likely expects same fields
        await loginUser(_currentState, formData);
        return {
          success: true,
          message: result.message ?? "Registration successful (auto-login attempted)",
          data: {
            user: userFromApi ?? validatedPayload.client,
            raw: result,
          },
        };
      } catch (loginErr: any) {
        // If loginUser performed redirect(), re-throw NEXT_REDIRECT so Next.js handles it
        if (loginErr?.digest?.startsWith?.("NEXT_REDIRECT")) {
          throw loginErr;
        }
        // Non-blocking: log and still return success so client can set local state
        console.warn("[registerClient] Auto-login failed (non-blocking):", loginErr);
        return {
          success: true,
          message: result.message ?? "Registration successful (auto-login failed)",
          data: {
            user: userFromApi ?? validatedPayload.client,
            raw: result,
          },
        };
      }
    }

    // Not successful — forward the backend response with proper error structure
    return {
      success: false,
      errors: result.errors || [],
      message: result.message || "Registration failed. Please try again.",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT so Next.js handles server-side redirect signals
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[registerClient] error:", error);
    return {
      success: false,
      errors: [],
      message:
        process.env.NODE_ENV === "development"
          ? error?.message ?? "Registration Failed"
          : "Registration Failed. Please try again.",
    };
  }
};