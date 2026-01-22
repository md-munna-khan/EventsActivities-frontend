import React from "react";
import { getAllUsers } from "@/services/user/userService";
import UpdateStatusButton from "../admin/UpdateStatusButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Mail, Calendar, ShieldCheck, MoreHorizontal } from "lucide-react";

type User = {
  id: string;
  email?: string | null;
  role?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const HostsManagement = async () => {
  const res = await getAllUsers({ role: "HOST" }, { page: 1, limit: 50 });
  const users: User[] = Array.isArray(res?.data) ? res.data : [];

  if (!res || res.success === false) {
    return (
      <Card className="w-full border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">System Error</CardTitle>
          <CardDescription>Failed to load host records: {res?.message ?? "Unknown error"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'BLOCKED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
            Hosts <span className="text-primary not-italic">Management</span>
          </h2>
          <p className="text-muted-foreground font-medium">Verify credentials and manage status for all platform hosts.</p>
        </div>
        
      
      </div>

    
      <Card className="border-none shadow-2xl bg-card overflow-hidden rounded-[var(--radius-xl)]">
        <CardContent className="p-0">
          <div className="w-full overflow-auto no-scrollbar">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left pl-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Host Identity</th>
                  <th className="text-left py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Role Type</th>
                  <th className="text-left py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Status</th>
                  <th className="text-right pr-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-muted/20 transition-colors">
                    <td className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-1 ring-border group-hover:ring-primary/30 transition-all">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {u.email?.charAt(0).toUpperCase() ?? "H"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-2">
                            {u.email?.split('@')[0] ?? "Unknown Host"}
                            {u.status === 'ACTIVE' && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {u.email}</span>
                            <span className="hidden lg:flex items-center gap-1"><Calendar className="h-3 w-3" /> {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 hidden sm:table-cell">
                      <Badge variant="outline" className="rounded-md bg-secondary/30 border-secondary/50 font-bold text-[10px] px-2 py-0">
                        {u.role ?? "HOST"}
                      </Badge>
                    </td>

                    <td className="py-5">
                      <Badge className={`rounded-full border px-3 py-0.5 text-[10px] font-black tracking-tighter ${getStatusStyles(u.status ?? "")}`}>
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
            <div className="py-20 flex flex-col items-center text-center">
               <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground/30" />
               </div>
               <p className="font-black italic uppercase text-muted-foreground">No host records found</p>
            </div>
          )}
          
          <div className="p-6 bg-muted/10 border-t border-border flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Showing <span className="text-foreground">{users.length}</span> verified hosts
              </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostsManagement;