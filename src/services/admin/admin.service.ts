"use server"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from '@/lib/server-fetch';

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

export async function getAllAdmins(filters: IAdminFilters = {}, options: IPaginationOptions = {}) {
  try {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    });
    Object.entries(options).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    });

    const res = await serverFetch.get(`/admin?${qs.toString()}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('getAllAdmins error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to fetch admins' };
  }
}

export async function updateAdmin(id: string, data: Partial<any>) {
  try {
    const res = await serverFetch.patch(`/admin/${id}`, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('updateAdmin error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to update admin' };
  }
}

export async function deleteAdmin(id: string) {
  try {
    const res = await serverFetch.delete(`/admin/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('deleteAdmin error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to delete admin' };
  }
}

// Host application management
export async function getPendingHostApplications() {
  try {
    const res = await serverFetch.get('/admin/pending-host-applications');
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('getPendingHostApplications error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to fetch pending host applications' };
  }
}

export async function approveHostApplication(applicationId: string) {
  try {
    const res = await serverFetch.patch(`/admin/${applicationId}/approve`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('approveHostApplication error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to approve host application' };
  }
}

export async function rejectHostApplication(applicationId: string) {
  try {
    const res = await serverFetch.patch(`/admin/${applicationId}/reject`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('rejectHostApplication error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to reject host application' };
  }
}

// Event approval flows
export async function getPendingEvents() {
  try {
    const res = await serverFetch.get('/admin/events/pending-event-applications');
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('getPendingEvents error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to fetch pending events' };
  }
}

export async function approveEvent(eventId: string) {
  try {
    const res = await serverFetch.patch(`/admin/events/${eventId}/approve`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('approveEvent error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to approve event' };
  }
}

export async function rejectEvent(eventId: string) {
  try {
    const res = await serverFetch.patch(`/admin/events/${eventId}/reject`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error('rejectEvent error', error?.message || error);
    return { success: false, message: error?.message || 'Failed to reject event' };
  }
}






