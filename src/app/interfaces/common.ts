import { UserRole } from "@prisma/client";

export type IAuthUser = {
    email: string;
    role: UserRole
} | null;

// src/types/common.ts

export interface QueryOptions {
  filter?: Record<string, any>;
  pagination?: {
    page?: number;
    limit?: number;
  };
}

