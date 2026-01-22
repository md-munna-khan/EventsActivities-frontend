"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface PaymentRecord {
  id: string;
  tranId?: string;
  transactionId?: string;
  amount?: number;
  status?: string;
  currency?: string;
  method?: string;
  createdAt?: string;
  event?: { id: string; title: string };
  client?: { id: string; name: string; email: string };
  host?: { id: string; name: string };
}

export interface PaymentMeta {
  total?: number;
  page?: number;
  limit?: number;
}

export interface PaymentListResponse {
  data: PaymentRecord[];
  meta?: PaymentMeta;
  success?: boolean;
  message?: string;
}

export async function getPayments({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<PaymentListResponse> {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (status) params.set("status", status);

    const res = await serverFetch.get(`/payment/payments-history?${params.toString()}`);


    const json = await res.json();

 
    const data = json?.data ?? json?.results ?? [];
    const meta = json?.meta ?? json?.pagination ?? {};

    return {
      data,
      meta,
      success: res.ok,
      message: json?.message,
    };
  } catch (error) {
    console.error("getPayments error", error);
    return { data: [], meta: { total: 0, page: 1, limit: limit ?? 10 }, success: false, message: "Failed to fetch payments" };
  }
}
