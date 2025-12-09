/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/modules/admin/DeleteHostButton.client.tsx */
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
import { toast } from "sonner";

import { deleteHost } from "@/services/host/hostService";

type Props = {
  hostId: string;
};

export default function DeleteHostButton({ hostId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const result = await deleteHost(hostId);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to delete host");
      }

      toast.success("Host deleted successfully");
      setOpen(false);

      router.refresh();
    } catch (err: any) {
      console.error("host delete error:", err);
      toast.error(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The host will be permanently removed.
        </p>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
