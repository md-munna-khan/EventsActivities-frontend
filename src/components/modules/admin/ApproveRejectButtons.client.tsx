/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  applicationId: string;
}

const base = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5000/api/v1';

export default function ApproveRejectButtons({ applicationId }: Props) {
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    if (!confirm('Approve this application?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/admin/${applicationId}/approve`, { method: 'PATCH', credentials: 'include' });
      const result = await res.json();
      if (result.success) {
        toast.success('Application approved');
        // reload
        window.location.reload();
      } else {
        toast.error(result.message || 'Failed to approve');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (!confirm('Reject this application?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/admin/${applicationId}/reject`, { method: 'PATCH', credentials: 'include' });
      const result = await res.json();
      if (result.success) {
        toast.success('Application rejected');
        window.location.reload();
      } else {
        toast.error(result.message || 'Failed to reject');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button className="btn btn-approve" onClick={approve} disabled={loading}>Approve</button>
      <button className="btn btn-reject" onClick={reject} disabled={loading}>Reject</button>
    </div>
  );
}
