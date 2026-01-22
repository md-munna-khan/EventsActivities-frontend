


/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getPendingHostApplications } from "@/services/admin/admin.service";
import ApproveRejectButtons from "./ApproveRejectButtons.client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HostApplicationsList = async () => {
  const result = await getPendingHostApplications();

  const apps: any[] = result?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold">Pending Host Applications</h2>
        <Badge variant="outline" className="text-sm">
          {apps.length} pending
        </Badge>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-lg border bg-muted/10 p-6 text-center text-muted-foreground">
          No pending applications
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app: any) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="truncate">UserName: {app.name || app.user?.email}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  User ID: {app.userId}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <div className="text-sm text-muted-foreground line-clamp-2">
              
                  Email: {app.user?.email || "-"}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <ApproveRejectButtons applicationId={app.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostApplicationsList;

