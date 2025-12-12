/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */


export interface IAdminFilters {
  searchTerm?: string;
  [key: string]: any;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


import { serverFetch } from "@/lib/server-fetch";

import { deleteCookie } from "../auth/tokenHandlers";

export async function applyHost() {
  try {
    const response = await serverFetch.post("/auth/apply-host");

    const result = await response.json();
    if (result.success) {

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    }
 
    return result;

  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

// Users, Hosts, Events management
export async function getAllUsers(filters: IAdminFilters = {}, options: IPaginationOptions = {}) {
  try {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== null) qs.set(k, String(v)); });
    Object.entries(options).forEach(([k, v]) => { if (v !== undefined && v !== null) qs.set(k, String(v)); });
    const res = await serverFetch.get(`/user?${qs.toString()}`);
    return await res.json();
  } catch (error: any) {
    console.error('getAllUsers error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to fetch users' };
  }
}

export async function updateUserStatus(Id: string, status: string) {
  try {
    const res = await serverFetch.patch(`/user/${Id}/status`, { body: JSON.stringify({ status }), headers: { 'Content-Type': 'application/json' } });
    return await res.json();
  } catch (error: any) {
    console.error('updateUserStatus error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to update user status' };
  }
}

export async function deleteUser(Id: string) {
  try {
    const res = await serverFetch.delete(`/user/${Id}`);
    return await res.json();
  } catch (error: any) {
    console.error('deleteUser error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to delete user' };
  }
}