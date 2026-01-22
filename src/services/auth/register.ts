
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createClientValidation } from "@/zod/auth.validation";
import { loginUser } from "./loginUser";

export const registerClient = async (_currentState: any, formData: FormData): Promise<any> => {
  try {

    const getString = (key: string) => {
      if (typeof formData.get !== "function") return "";
      const v = formData.get(key);
      return v === null ? "" : String(v);
    };


    const rawInterests = typeof formData.getAll === "function"
      ? formData.getAll("interests")
      : (formData.get("interests") ? [formData.get("interests")] : []);
    const interestsArray = Array.isArray(rawInterests) ? rawInterests.map((i: any) => String(i)) : [];


    const payload = {
      password: getString("password"),
      client: {
        name: getString("name"),
        email: getString("email"),
        bio: getString("bio"),
        contactNumber: getString("contactNumber"),
        location: getString("location"),
        interests: interestsArray,
     
      },
    };

    
    const validation = zodValidator(payload, createClientValidation);
    if (validation.success === false) {
      return {
        success: false,
        errors: validation.errors,
        message: "Please fix the validation errors and try again",
      };
    }
    const validatedPayload: any = validation.data;



    const incomingFile = typeof formData.get === "function" ? (formData.get("file") ?? formData.get("profilePhoto")) : null;
    const hasFile = incomingFile && incomingFile instanceof File && incomingFile.size > 0;

    
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
     
      const token = result?.data?.token ?? result?.token ?? result?.accessToken ?? result?.data?.accessToken ?? null;
      const userFromApi = result?.data?.user ?? result?.data?.client ?? null;

      if (token) {
      
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

    
      try {
     
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
      
        if (loginErr?.digest?.startsWith?.("NEXT_REDIRECT")) {
          throw loginErr;
        }
      
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


    return {
      success: false,
      errors: result.errors || [],
      message: result.message || "Registration failed. Please try again.",
    };
  } catch (error: any) {
  
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