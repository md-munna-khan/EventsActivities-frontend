/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/modules/admin/DeleteButton.client.tsx */
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
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteUser } from "@/services/user/userService";


type Props = {
  resource: string; // "users"
  id: string;
};

export default function DeleteButton({ resource, id }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

 
      const json = await deleteUser(id);

      if (json?.success === false) {
        throw new Error(json?.message || "Failed to delete");
      }

      toast.success("Deleted");
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error("delete error:", err);
      toast.error(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">Delete</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>Are you sure you want to delete this record? This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive" disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
