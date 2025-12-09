/* app/events/my-bookings/page.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserBookings } from "@/services/events/eventService";

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

const ParticipantStatusBadge = ({ status }: { status?: string }) => {
  const s = (status ?? "PENDING").toUpperCase();
  const className =
    s === "CONFIRMED"
      ? "bg-green-100 text-green-800"
      : s === "LEFT"
      ? "bg-red-100 text-red-800"
      : s === "PENDING"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-gray-100 text-gray-800";

  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${className}`}>{s}</span>;
};

const EventStatusBadge = ({ status }: { status?: string }) => {
  const s = (status ?? "UNKNOWN").toUpperCase();
  const className =
    s === "COMPLETED"
      ? "bg-green-100 text-green-800"
      : s === "UPCOMING"
      ? "bg-blue-100 text-blue-800"
      : s === "CANCELLED" || s === "CANCELED"
      ? "bg-red-100 text-red-800"
      : s === "ONGOING"
      ? "bg-purple-100 text-purple-800"
      : "bg-gray-100 text-gray-800";

  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${className}`}>{s}</span>;
};

const MyBookingEvents = async () => {
  const res = await getUserBookings();
  const bookings: any[] = res?.data || [];
  console.log(bookings);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">My Booked Events</h1>
        <div className="text-sm text-muted-foreground">{bookings.length} booking(s)</div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border bg-muted/10 p-8 text-center text-muted-foreground">
          You have no bookings yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking: any) => {
            const ev = booking.event ?? {};
            const participantStatus = booking.participantStatus ?? booking.status ?? "PENDING";
            const eventStatus = ev.status ?? ev.eventStatus ?? "UNKNOWN";

            return (
              <Card key={booking.id} className="overflow-hidden">
                <div className="relative w-full h-48 bg-muted/10">
                  {/* Next/Image: ensure your next.config.js allows the Cloudinary domain */}
                  <Image
                    src={ev.image || "/placeholder.png"}
                    alt={ev.title || ev.name || "event image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold truncate">{ev.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ev.description}</p>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <div>
                          <span className="font-medium">Category:</span> <span className="text-muted-foreground">{ev.category}</span>
                        </div>

                        <div>
                          <span className="font-medium">Location:</span> <span className="text-muted-foreground">{ev.location}</span>
                        </div>

                        <div>
                          <span className="font-medium">Fee:</span> <span className="text-muted-foreground">${ev.joiningFee}</span>
                        </div>

                        <div>
                          <span className="font-medium">When:</span> <span className="text-muted-foreground">{formatDate(ev.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Show both participant status and the event's own status */}
                      <div className="flex flex-col items-end gap-1">
                        Participant Status <ParticipantStatusBadge status={participantStatus} />
                       Event Status <EventStatusBadge status={eventStatus} />
                      </div>

                      <div className="text-sm text-muted-foreground">{formatDate(booking.createdAt)}</div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Booking ID: <span className="font-medium">{booking.id}</span></div>

                  <div className="flex items-center gap-3">
                    {/* replace with real CTA routes if you have them */}
                    <a href={`/events/${ev.id}`} className="text-sm underline">
                      View event
                    </a>

                    {/* If you support cancellation, show a button here */}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingEvents;
