import React from "react";
import { getAllUsers } from "@/services/user/userService";
import UpdateStatusButton from "./UpdateStatusButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle2,
  Mail,
  Calendar,
  Activity,
  ShieldAlert,
} from "lucide-react";

type User = {
  id: string;
  email?: string | null;
  role?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const ClientsManagement = async () => {
  const res = await getAllUsers({ role: "CLIENT" }, { page: 1, limit: 50 });
  const users: User[] = Array.isArray(res?.data) ? res.data : [];

  if (!res || res.success === false) {
    return (
      <Card className="w-full border-destructive/20 bg-destructive/5">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-full">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-destructive font-black uppercase italic">
              Access Denied
            </CardTitle>
            <CardDescription>
              Failed to sync client records: {res?.message ?? "Unknown error"}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getStatusStyles = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "ACTIVE")
      return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    if (s === "BLOCKED")
      return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-amber-500/10 text-amber-600 border-amber-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase  text-foreground">
            Client{" "}
            <span className="text-primary not-italic text-secondary-foreground">
              Database
            </span>
          </h2>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Monitoring{" "}
            <span className="text-foreground font-bold">
              {users.length} registered clients
            </span>
          </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-card overflow-hidden rounded-[var(--radius-xl)] ring-1 ring-border">
        <CardContent className="p-0">
          <div className="w-full overflow-auto no-scrollbar">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    User Identity
                  </th>
                  <th className="text-left py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                    Privileges
                  </th>
                  <th className="text-left py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Current Status
                  </th>
                  <th className="text-right pr-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Quick Management
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="group hover:bg-primary/[0.02] transition-colors"
                  >
                    <td className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-1 ring-border transition-all group-hover:ring-primary/40">
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {u.email?.charAt(0).toUpperCase() ?? "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${u.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {u.email?.split("@")[0] ?? "Anonymous User"}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {u.email}
                            </span>
                            <span className="hidden lg:flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3" />{" "}
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString()
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 hidden sm:table-cell">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/30 text-[10px] font-bold text-secondary-foreground border border-secondary/50 uppercase">
                        <UserCircle2 className="h-3 w-3" />
                        {u.role ?? "CLIENT"}
                      </div>
                    </td>

                    <td className="py-5">
                      <Badge
                        className={`rounded-full border px-3 py-0.5 text-[10px] font-black tracking-tighter shadow-sm ${getStatusStyles(u.status ?? "")}`}
                      >
                        {u.status ?? "PENDING"}
                      </Badge>
                    </td>

                    <td className="pr-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <UpdateStatusButton
                          resource="users"
                          id={u.id}
                          currentStatus={u.status ?? "ACTIVE"}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="py-24 flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <UserCircle2 className="h-10 w-10 text-muted-foreground/20" />
              </div>
              <h3 className="text-xl font-black italic uppercase text-muted-foreground">
                Zero Clients Registered
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mt-2">
                The client list is currently empty. New users will appear here
                once they register.
              </p>
            </div>
          )}

          <div className="p-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Verified Records Index:{" "}
              <span className="text-foreground">{users.length} Profiles</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground">
                Admin Access Only
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsManagement;
