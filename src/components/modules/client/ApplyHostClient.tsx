/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ApplyHostClient = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // modal state
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [prevWasPending, setPrevWasPending] = useState(false);
  const router = useRouter();

  // Fetch current user info to determine status/role
  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const result = await res.json();
      if (result.success && result.data) {
        const status = result.data.user?.status || result.data.status || null;
        const role = result.data.user?.role || result.data.role || null;
        setUserStatus(status);
        setUserRole(role);
      }
    } catch (error) {
      // ignore
    }
  };

  useEffect(() => {
    fetchMe();
    // poll every 10s to detect admin approval change
    const id = setInterval(fetchMe, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // if previously pending and now active + host -> redirect to login so user can re-login as host
    if (prevWasPending && userStatus === 'ACTIVE' && userRole === 'HOST') {
      toast.success('Your host application was approved. Please login again to access host features.');
      router.push('/login');
    }
    if (userStatus === 'PENDING') setPrevWasPending(true);
  }, [userStatus, userRole, prevWasPending, router]);

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/host/apply', { method: 'POST', credentials: 'include' });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || 'Host application submitted');
        // set local status to pending and keep user on page
        setUserStatus('PENDING');
      } else {
        toast.error(result.message || 'Failed to submit application');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const isPending = userStatus === 'PENDING';

  return (
    <div className="space-y-4">
      <p>
        By applying to become a host, your account will be marked <strong>PENDING</strong> until an admin
        reviews and approves your application.
      </p>

      {isPending ? (
        <div className="p-3 bg-yellow-50 rounded border">Please wait for admin approval. Your application is under review.</div>
      ) : (
        <Button onClick={() => setOpen(true)} disabled={loading}>
          {loading ? 'Submitting...' : 'Apply to become a host'}
        </Button>
      )}

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Host Application</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to apply to become a host? Your account will be pending until admin approval.</p>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={loading}>
              {loading ? 'Submitting...' : 'Yes, Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplyHostClient;
