/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from '@/lib/server-fetch';

export interface DashboardStats {
  role: string;
  totals?: {
    users?: number;
    clients?: number;
    hosts?: number;
    events?: number;
    paidPayments?: number;
    revenue?: number;
    pendingHostApplications?: number;
  };
  eventsByStatus?: Record<string, number>;
  successCount?: number;
  failedCount?: number;
  recentEvents?: any[];
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const res = await serverFetch.get('/meta');
    const result = await res.json();
    return result?.data || result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
    console.error('getDashboardStats error', message);
    return null;
  }
}
