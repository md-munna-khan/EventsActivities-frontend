


/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import EventApproveRejectButtons from "./EventApproveRejectButtons.client";
import { getPendingEvents } from "@/services/admin/admin.service";

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
};

const PendingEventsList = async () => {
  const result = await getPendingEvents();
  const events: any[] = result?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold">Pending Events</h2>
        <Badge variant="outline" className="text-sm">
          {events.length} pending
        </Badge>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          No pending events
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev: any) => (
            <Card key={ev.id} className="overflow-hidden">
              {/* Thumbnail */}
              <div className="relative w-full h-44 bg-muted/10">
                {/* Next/Image - ensure next.config.js allows external domain or use remotePatterns */}
                <Image
                  src={ev.image || "/placeholder.png"}
                  alt={ev.title || "event image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium leading-tight truncate">{ev.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{ev.description}</p>

                    <div className="mt-3 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Category:</span>
                        <Badge variant="secondary">{ev.category ?? "OTHER"}</Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium">Location:</span>
                        <span className="text-sm text-muted-foreground truncate">{ev.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium">Host:</span>
                        <span className="text-sm text-muted-foreground truncate">
                          {ev.host?.name ?? ev.host?.email ?? `id:${ev.hostId ?? "-"}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium">Fee:</span>
                        <span className="text-sm text-muted-foreground">${ev.joiningFee ?? 0}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium">When:</span>
                        <span className="text-sm text-muted-foreground">{formatDate(ev.date)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <Badge className="font-medium">
                          {ev.status ?? "UNKNOWN"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right column: capacity / status chip */}
                  <div className="hidden md:flex flex-col items-end justify-between">
                    <div className="text-right">
                      <div className="text-sm font-medium">{ev.capacity ?? "-"}</div>
                      <div className="text-xs text-muted-foreground">Capacity</div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-3">
                
                 

                  {/* EventApproveRejectButtons is a client component (already .client) */}
                  <EventApproveRejectButtons eventId={ev.id} />
                </div>

                <div className="text-xs text-muted-foreground">
                  Created: {formatDate(ev.createdAt)} · Updated: {formatDate(ev.updatedAt)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingEventsList;


