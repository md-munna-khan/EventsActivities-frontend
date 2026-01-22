/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { applyHost } from "@/services/user/userService";
import { CheckCircle2, Clock, ShieldCheck, Star } from "lucide-react";

export const ApplyHostClient = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMe = async () => {
    try {
      const result = await getUserInfo();
      if (result && result.success) {
        const data = result.data || {};
        const status = data.user?.status || data.status || data.host?.status || data.client?.status || null;
        const role = data.user?.role || data.role || data.host?.role || data.client?.role || null;
        setUserStatus(status || null);
        setUserRole(role || null);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchMe();
    intervalRef.current = setInterval(fetchMe, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleApply = async () => {
    setLoading(true);
    try {
      const result = await applyHost();
      if (result.success) {
        toast.success(result.message || "Host application submitted successfully!");
        setUserStatus("PENDING");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const isPending = userStatus === "PENDING";
  const isHost = userRole === "HOST";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
 
      {isPending && (
        <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <Clock className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-bold">Application Under Review</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">
            Your request to become a host is being processed by our team. We&apos;ll notify you once your account is verified.
          </AlertDescription>
        </Alert>
      )}

      {isHost && (
        <Alert className="mb-8 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="text-emerald-800 dark:text-emerald-400 font-bold">You are a Host!</AlertTitle>
          <AlertDescription className="text-emerald-700 dark:text-emerald-500">
            Welcome to the team! You already have access to all host features.
          </AlertDescription>
        </Alert>
      )}

   

    
      <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Host Application</CardTitle>
            <Badge variant={isHost ? "default" : isPending ? "secondary" : "outline"}>
              {isHost ? "Active Host" : isPending ? "Pending" : "Not Started"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              By submitting this application, you agree to our Host Terms of Service. Our admin team will review your profile to ensure quality standards.
            </p>
            <div className="flex flex-col gap-3">
               <Button
                size="lg"
                className="w-full text-lg h-12 shadow-lg"
                onClick={() => setOpen(true)}
                disabled={loading || isPending || isHost}
              >
                {loading ? "Submitting Request..." : isHost ? "Already a Host" : "Apply to Become a Host"}
              </Button>
              {!isHost && !isPending && (
                <p className="text-[11px] text-center text-muted-foreground uppercase tracking-widest">
                  Process takes 24-48 hours
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

     
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">Confirm Application</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Ready to start hosting? This will send your profile to our administrators for review.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setOpen(false)}>
              Not yet
            </Button>
            <Button 
              className="w-full sm:w-auto px-8" 
              onClick={handleApply} 
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};