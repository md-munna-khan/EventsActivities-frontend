/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/modules/admin/UpdateHostStatusButton.client.tsx */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

import { updateHostStatus } from "@/services/host/hostService";

type Props = {
  hostId: string;
  currentStatus: string;
};

const HOST_STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"];

export default function UpdateHostStatusButton({ hostId, currentStatus }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const result = await updateHostStatus(hostId, status);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to update host status");
      }

      toast.success("Host status updated successfully");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error("Host status update error:", err);
      toast.error(err?.message || "Status update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Update Status</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Host Status</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <label className="block text-sm font-medium mb-2">Status</label>

          <Select onValueChange={setStatus} defaultValue={status}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>

            <SelectContent>
              {HOST_STATUS_OPTIONS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
