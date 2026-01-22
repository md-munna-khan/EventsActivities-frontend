/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/modules/admin/UpdateStatusButton.client.tsx */
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
import { updateUserStatus } from "@/services/user/userService";


type Props = {
  resource: string; // "users"
  id: string;
  currentStatus?: string;
};

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"];

export default function UpdateStatusButton({ resource, id, currentStatus = "ACTIVE" }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const json = await updateUserStatus(id, status);

      if (json?.success === false) {
        throw new Error(json?.message || "Failed to update status");
      }

      toast.success("Status updated");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error("update status error:", err);
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Update</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update user status</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select onValueChange={(v) => setStatus(v)} defaultValue={currentStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading} >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
