// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { getUserInfo } from "@/services/auth/getUserInfo";
// import { applyHost } from "@/services/user/applyHost";


// export const ApplyHostClient = () => {
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [userStatus, setUserStatus] = useState<string | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [prevWasPending, setPrevWasPending] = useState(false);
//   const router = useRouter();
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const fetchMe = async () => {
//     try {
//       const result = await getUserInfo();

//       if (result && result.success) {
//         const data = result.data || {};
//         const status = data.user?.status || data.status || data.host?.status || data.client?.status || null;
//         const role = data.user?.role || data.role || data.host?.role || data.client?.role || null;
//         setUserStatus(status || null);
//         setUserRole(role || null);
//       }
//     } catch {
//       // ignore
//     }
//   };

//   useEffect(() => {
//     fetchMe();
//     intervalRef.current = setInterval(fetchMe, 10000);
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (prevWasPending && userStatus === "ACTIVE" && userRole === "HOST") {
//       toast.success("Your host application was approved. Please login again to access host features.");
//       router.push("/login");
//     }
//     if (userStatus === "PENDING") setPrevWasPending(true);
//   }, [userStatus, userRole, prevWasPending, router]);

//   const handleApply = async () => {
//     setLoading(true);
//     try {
//       const result = await applyHost(); // ✅ call server function

//       if (result.success) {
//         toast.success(result.message || "Host application submitted");
//         setUserStatus("PENDING");
//       } else {
//         toast.error(result.message || "Failed to submit application");
//       }
//     } catch (error: any) {
//       toast.error(error?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//       setOpen(false);
//     }
//   };

//   const isPending = userStatus === "PENDING";

//   return (
//     <div className="space-y-4">
//       <p>
//         By applying to become a host, your account will be marked <strong>PENDING</strong> until an admin
//         reviews and approves your application.
//       </p>

//       {isPending  ? (
//   <div className="p-3 bg-red-500 rounded border">
//     {userRole === "HOST"
//       ? "You are already a host."
//       : "Please wait for admin approval. Your application is under review."}
//   </div>
// ) : (
//   <Button
//   onClick={() => setOpen(true)}
//   disabled={loading || isPending } // disable if pending 
// >
//   {loading ? "Submitting..." : "Apply to become a host"}
// </Button>

// )}


//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Host Application</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to apply to become a host? Your account will be pending until admin approval.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="flex justify-end space-x-2 mt-4">
//             <Button variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleApply} disabled={loading}>
//               {loading ? "Submitting..." : "Yes, Apply"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { applyHost } from "@/services/user/userService";

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
    } catch {
      // ignore
    }
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
      const result = await applyHost(); // call server function

      if (result.success) {
        toast.success(result.message || "Host application submitted");
        setUserStatus("PENDING");

        // redirect after successful application
        setTimeout(() => {
          router.push("/login");
        }, 1500); // 1.5s delay for toast to show
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
    <div className="space-y-4">
      <p>
        By applying to become a host, your account will be marked <strong>PENDING</strong> until an admin
        reviews and approves your application.
      </p>

      {isPending || isHost ? (
        <div className="p-3 bg-red-500 rounded border">
          {isHost
            ? "You are already a host."
            : "Please wait for admin approval. Your application is under review."}
        </div>
      ) : null}

      <Button
        onClick={() => setOpen(true)}
        disabled={loading || isPending || isHost} // disable if pending or already host
      >
        {loading ? "Submitting..." : "Apply to become a host"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Host Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply to become a host? Your account will be pending until admin approval.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={loading || isPending || isHost}>
              {loading ? "Submitting..." : "Yes, Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
