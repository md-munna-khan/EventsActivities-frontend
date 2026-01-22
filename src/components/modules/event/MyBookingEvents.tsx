/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Calendar as CalendarIcon, 
  CreditCard, 
  Ticket, 
  Clock, 
  ChevronRight,
  Inbox
} from "lucide-react";
import ReviewModal from "./ReviewModal";
import Link from "next/link";

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    const date = new Date(iso);
    return {
      full: date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
    };
  } catch {
    return { full: iso, day: "!", month: "!" };
  }
};

const ParticipantStatusBadge = ({ status }: { status?: string }) => {
  const s = (status ?? "PENDING").toUpperCase();
  const variants: Record<string, string> = {
    CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    LEFT: "bg-rose-100 text-rose-700 border-rose-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${variants[s] || "bg-slate-100 text-slate-700"}`}>
      {s}
    </span>
  );
};

const EventStatusBadge = ({ status }: { status?: string }) => {
  const s = (status ?? "UNKNOWN").toUpperCase();
  const variants: Record<string, string> = {
    COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
    OPEN: "bg-primary/10 text-primary border-primary/20",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
    FULL: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${variants[s] || "bg-slate-100 text-slate-700"}`}>
      {s}
    </span>
  );
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent py-8 md:py-12">
      {selectedEvent && (
        <ReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          onSuccess={() => setReviewModalOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              My <span className="text-primary">Bookings</span>
            </h1>
            <p className="text-slate-500 mt-1">Manage your event schedule and reviews</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border shadow-sm self-start">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Total Bookings</p>
              <p className="text-lg font-black leading-none mt-1">{bookings.length}</p>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="border-dashed border-2 py-20 flex flex-col items-center text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Inbox className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold">No bookings found</h3>
            <p className="text-slate-500 mb-6">Start exploring events to fill your dashboard!</p>
            <Link href="/explore-events">
              <Button className="rounded-full px-8">Browse Events</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => {
              const ev = booking.event ?? {};
              const pStatus = booking.participantStatus ?? "PENDING";
              const eStatus = ev.status ?? "UNKNOWN";
              const dateInfo: any = formatDate(ev.date);

              return (
                <Card key={booking.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side: Image & Date Badge */}
                    <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden shrink-0">
                      <Image
                        src={ev.image || "/placeholder.png"}
                        alt={ev.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      
                      {/* Floating Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-2 min-w-[55px] text-center shadow-lg border">
                        <p className="text-[10px] font-black uppercase text-primary leading-none">{dateInfo.month}</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{dateInfo.day}</p>
                      </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <EventStatusBadge status={eStatus} />
                            <ParticipantStatusBadge status={pStatus} />
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white line-clamp-1">
                            {ev.title}
                          </h2>
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border self-start">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Booking Fee</p>
                          <p className="text-lg font-black text-primary">${ev.joiningFee}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-dashed border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Schedule</p>
                            <p className="text-sm font-semibold truncate leading-none">{dateInfo.full}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Booked On</p>
                            <p className="text-sm font-semibold truncate leading-none">{formatDate(booking.createdAt).full}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:col-span-2 md:col-span-1">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Booking Ref</p>
                            <p className="text-sm font-mono font-medium truncate leading-none">#{booking.id.slice(-8)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 mt-auto border-t">
                        <Link href={`/explore-events/${ev.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2 group/btn font-bold">
                            View Details <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        
                        {eStatus === "COMPLETED" && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenReviewModal(ev)}
                            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                          >
                            <Star className="h-4 w-4 fill-white" />
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingEventsClient;