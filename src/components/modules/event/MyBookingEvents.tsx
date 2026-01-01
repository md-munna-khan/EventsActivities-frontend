/* app/events/my-bookings/page.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import ReviewModal from "./ReviewModal";


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
      : s === "PENDING"
      ? "bg-yellow-100 text-yellow-800"
      : s === "REJECTED"
      ? "bg-red-100 text-red-800"
      : s === "CANCELLED" || s === "CANCELED"
      ? "bg-red-100 text-red-800"
      : s === "OPEN"
      ? "bg-blue-100 text-blue-800"
      : s === "FULL"
      ? "bg-purple-100 text-purple-800"
      : "bg-gray-100 text-gray-800";

  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${className}`}>{s}</span>;
};

interface MyBookingEventsClientProps {
  bookings: any[];
}

const MyBookingEventsClient = ({ bookings }: MyBookingEventsClientProps) => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleOpenReviewModal = (event: any) => {
    setSelectedEvent(event);
    setReviewModalOpen(true);
  };

  return (
    <>
      {selectedEvent && (
        <ReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          onSuccess={() => {
            setReviewModalOpen(false);
          }}
        />
      )}
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">My Booked Events</h1>
          <div className="text-sm text-muted-foreground">{bookings.length} booking(s)</div>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-lg border bg-muted/10 p-8 text-center text-muted-foreground">
            You have no bookings yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking: any) => {
              const ev = booking.event ?? {};
              const participantStatus = booking.participantStatus ?? booking.status ?? "PENDING";
              const eventStatus = ev.status ?? ev.eventStatus ?? "UNKNOWN";

              return (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="relative w-full h-48 bg-muted/10">
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
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">Participant Status</span>
                          <ParticipantStatusBadge status={participantStatus} />
                          <span className="text-xs text-muted-foreground mt-2">Event Status</span>
                          <EventStatusBadge status={eventStatus} />
                        </div>

                        <div className="text-sm text-muted-foreground">{formatDate(booking.createdAt)}</div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Booking ID: <span className="font-medium">{booking.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a href={`/events/${ev.id}`} className="text-sm underline">
                        View event
                      </a>

                      {eventStatus === "COMPLETED" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleOpenReviewModal(ev)}
                          className="flex items-center gap-2"
                        >
                          <Star className="h-4 w-4" />
                          Review
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookingEventsClient;
