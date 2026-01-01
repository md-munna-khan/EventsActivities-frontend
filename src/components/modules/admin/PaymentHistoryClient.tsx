"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PaymentRecord, PaymentMeta } from "@/services/admin/payment.service";
import { formatCurrency } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Filter,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface PaymentHistoryClientProps {
  payments: PaymentRecord[];
  meta: PaymentMeta;
  statusFilter?: string;
}

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  CANCELLED: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const StatusBadge = ({ value }: { value?: string }) => {
  const key = (value || "").toUpperCase();
  return (
    <Badge className={`${statusColors[key] || "bg-muted text-foreground"} font-semibold`}> 
      {value || "N/A"}
    </Badge>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  description,
  gradient,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description: string;
  gradient: string;
}) => (
  <Card className={`border-0 shadow-xl overflow-hidden ${gradient}`}>
    <CardContent className="p-6 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 to-transparent" />
      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-white/80 font-semibold">{label}</p>
          <p className="text-4xl font-black leading-tight">{value}</p>
          <p className="text-xs text-white/80">{description}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const PaymentHistoryClient: React.FC<PaymentHistoryClientProps> = ({ payments, meta, statusFilter = "all" }) => {
  const { totalPaid, totalAmount, totalFailed, totalCancelled } = useMemo(() => {
    let paid = 0;
    let amount = 0;
    let failed = 0;
    let cancelled = 0;

    payments?.forEach((p) => {
      const status = (p.status || "").toUpperCase();
      if (status === "PAID") paid += 1;
      if (status === "FAILED") failed += 1;
      if (status === "CANCELLED") cancelled += 1;
      amount += Number(p.amount || 0);
    });

    return { totalPaid: paid, totalAmount: amount, totalFailed: failed, totalCancelled: cancelled };
  }, [payments]);

  const currentPage = meta?.page || 1;
  const limit = meta?.limit || 10;
  const total = meta?.total || payments?.length || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const buildPageLink = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    return `?${params.toString()}`;
  };

  // const filters = [
  //   { label: "All", value: "all" },
  //   { label: "Paid", value: "PAID" },
  //   { label: "Pending", value: "PENDING" },
  //   { label: "Failed", value: "FAILED" },
  //   { label: "Cancelled", value: "CANCELLED" },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-primary flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Admin / Payments
            </p>
            <h1 className="text-4xl font-black text-foreground mt-2">Payment History</h1>
            <p className="text-muted-foreground">Monitor transactions and booking confirmations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={CheckCircle2}
            label="Paid"
            value={totalPaid}
            description="Successful payments"
            gradient="bg-linear-to-br from-emerald-500 to-emerald-600"
          />
          <MetricCard
            icon={DollarSign}
            label="Total Amount"
            value={formatCurrency(totalAmount)}
            description="Gross revenue from bookings"
            gradient="bg-linear-to-br from-amber-500 to-orange-600"
          />
          <MetricCard
            icon={XCircle}
            label="Failed"
            value={totalFailed}
            description="Payments that failed"
            gradient="bg-linear-to-br from-rose-500 to-red-600"
          />
          <MetricCard
            icon={Clock}
            label="Cancelled"
            value={totalCancelled}
            description="Cancelled or reversed"
            gradient="bg-linear-to-br from-slate-500 to-slate-700"
          />
        </div>

        {/* Filters */}
        {/* <div className="flex flex-wrap items-center gap-3">
          {filters.map((f) => {
            const active = statusFilter === f.value || (!statusFilter && f.value === "all");
            return (
              <Link
                key={f.value}
                href={f.value === "all" ? "?page=1" : `?status=${f.value}&page=1`}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30"
                    : "bg-card hover:bg-muted border-border"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div> */}

        <Separator />

        {/* Table */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-black">Transactions</CardTitle>
            <Badge variant="outline" className="text-xs">
              Total: {total}
            </Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments && payments.length > 0 ? (
                  payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-semibold">{p.tranId || p.transactionId || p.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold">{p.event?.title || "N/A"}</p>
                          {p.event?.id && (
                            <p className="text-xs text-muted-foreground">ID: {p.event.id}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold">{p.client?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{p.client?.email || ""}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(p.amount || 0)}</TableCell>
                      <TableCell>
                        <StatusBadge value={p.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.createdAt ? formatDateTime(p.createdAt) : ""}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
              <Link href={buildPageLink(Math.max(1, currentPage - 1))} className="gap-2 flex items-center">
                <ArrowLeft className="h-4 w-4" /> Prev
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" disabled={currentPage >= totalPages}>
              <Link href={buildPageLink(Math.min(totalPages, currentPage + 1))} className="gap-2 flex items-center">
                Next <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryClient;
