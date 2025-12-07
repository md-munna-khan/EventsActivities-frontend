/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { approveEvent, rejectEvent } from "@/services/admin/admin.service";
import React, { useState } from "react";
import { toast } from "sonner";


export default function EventApproveRejectButtons({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Approve this event?")) return;

    setLoading(true);
    const result = await approveEvent(eventId); // <-- server action

    if (result.success) {
      toast.success(result.message || "Event approved");
      window.location.reload();
    } else {
      toast.error(result.message || "Failed to approve");
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!confirm("Reject this event?")) return;

    setLoading(true);
    const result = await rejectEvent(eventId); // <-- server action

    if (result.success) {
      toast.success(result.message || "Event rejected");
      window.location.reload();
    } else {
      toast.error(result.message || "Failed to reject");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <button
        className="btn btn-approve"
        onClick={handleApprove}
        disabled={loading}
      >
        {loading ? "Processing..." : "Approve"}
      </button>

      <button
        className="btn btn-reject"
        onClick={handleReject}
        disabled={loading}
      >
        {loading ? "Processing..." : "Reject"}
      </button>
    </div>
  );
}
