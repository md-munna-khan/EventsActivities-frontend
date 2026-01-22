
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, X, Loader2 } from "lucide-react";

import { approveHostApplication, rejectHostApplication } from "@/services/admin/admin.service";

interface Props {
  applicationId: string;
}

export default function ApproveRejectButtons({ applicationId }: Props) {
  const [loadingAction, setLoadingAction] = useState<null | "approve" | "reject">(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const runAction = async (action: "approve" | "reject") => {
    setLoadingAction(action);
    try {
      const result =
        action === "approve"
          ? await approveHostApplication(applicationId)
          : await rejectHostApplication(applicationId);

      if (result?.success) {
        toast.success(result.message || `Application ${action}d successfully`);
       
        window.location.reload(); 
        setOpenApprove(false);
        setOpenReject(false);
      } else {
        toast.error(result?.message || `Failed to ${action}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || `Error while trying to ${action}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex gap-2">
   
      <Dialog open={openApprove} onOpenChange={setOpenApprove}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this host application?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenApprove(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => runAction("approve")}
              disabled={loadingAction !== null}
            >
              {loadingAction === "approve" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Processing
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Confirm Approve
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

 
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this host application?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenReject(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => runAction("reject")}
              disabled={loadingAction !== null}
            >
              {loadingAction === "reject" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Processing
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <X className="h-4 w-4" /> Confirm Reject
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
