/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TablePagination from "@/components/shared/TablePagination";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import CreateEventModal from "./CreateEventModal";
import EditEventModal from "./EditEventModal";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string | Date;
  location: string;
  joiningFee: number;
  image?: string | null;
  capacity: number;
  status: string;
  hostId: string;
  participantCount?: number;
  host?: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    rating?: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const MyEventsHost = ({
  initialEvents,
  initialMeta,
}: {
  initialEvents: Event[];
  initialMeta: any;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const events = initialEvents;
  const meta = initialMeta;

  const categoryOptions = [
    { label: "Sports", value: "SPORTS" },
    { label: "Music", value: "MUSIC" },
    { label: "Food", value: "FOOD" },
    { label: "Technology", value: "TECHNOLOGY" },
    { label: "Arts", value: "ARTS" },
    { label: "Business", value: "BUSINESS" },
    { label: "Education", value: "EDUCATION" },
    { label: "Health", value: "HEALTH" },
    { label: "Other", value: "OTHER" },
  ];

  const statusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Open", value: "OPEN" },
    { label: "Full", value: "FULL" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Completed", value: "COMPLETED" },
  ];

  const handleView = (event: Event) =>
    router.push(`/explore-events/${event.id}`);
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    startTransition(async () => {
      try {
        const { deleteEvent } = await import("@/services/host/hostService");
        const result = await deleteEvent(eventToDelete.id);
        if (result.success) {
          toast.success("Event deleted successfully");
          setIsDeleteDialogOpen(false);
          router.refresh();
        } else {
          toast.error(result.message || "Failed to delete event");
        }
      } catch (err) {
        toast.error("An error occurred");
      } finally {
        setIsDeleting(false);
      }
    });
  };

  const handleStatusUpdate = async (event: Event, newStatus: string) => {
    startTransition(async () => {
      try {
        const { updateEventStatus } =
          await import("@/services/host/hostService");
        const result = await updateEventStatus(event.id, newStatus);
        if (result.success) {
          toast.success(`Event status updated to ${newStatus}`);
          router.refresh();
        } else {
          toast.error(result.message || "Update failed");
        }
      } catch (err) {
        toast.error("Error updating status");
      }
    });
  };

  const getStatusStyles = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-amber-500/10 text-amber-600 border-amber-200",
      OPEN: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      FULL: "bg-orange-500/10 text-orange-600 border-orange-200",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
      CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
      COMPLETED: "bg-primary/10 text-primary border-primary/20",
    };
    return styles[status] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="space-y-6">
  
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/30  p-4 rounded-2xl border">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <SearchFilter placeholder="Filter events..." paramName="search" />
          <SelectFilter
            paramName="category"
            placeholder="Category"
            options={categoryOptions}
          />
          <SelectFilter
            paramName="status"
            placeholder="Status"
            options={statusOptions}
          />
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 h-11 px-6"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-3xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {events.length === 0 ? (
          <Card className="py-20 border-dashed border-2 bg-muted/10">
            <CardContent className="flex flex-col items-center text-center">
              <div className="p-4 bg-background rounded-full shadow-inner mb-4">
                <Calendar className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-black  uppercase tracking-tight mb-2">
                No Active Records
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6 text-balance font-medium">
                You haven&apos;t hosted any events matching these criteria yet.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-full"
              >
                Create New Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => {
              const fillPercentage = Math.min(
                ((event.participantCount || 0) / event.capacity) * 100,
                100,
              );
              return (
                <Card
                  key={event.id}
                  className="group bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col rounded-3xl"
                >
                
                  <div className="relative h-48 overflow-hidden">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-muted-foreground/20" />
                      </div>
                    )}

               
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

              
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge
                        variant="secondary"
                        className="bg-white/10 backdrop-blur-md text-white border-white/20 font-medium text-[10px] uppercase tracking-wider px-2.5 py-1"
                      >
                        {event.category}
                      </Badge>
                      <Badge
                        className={`font-bold shadow-lg ${getStatusStyles(event.status)}`}
                      >
                        {event.status}
                      </Badge>
                    </div>

                    {/* Date Overlay */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                      <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold tracking-wide">
                        {formatDateTime(event.date).split(",")[0]}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="p-5 pb-2 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </CardTitle>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full bg-secondary/50 hover:bg-secondary"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-52 rounded-2xl p-2"
                        >
                          <DropdownMenuItem
                            className="rounded-lg"
                            onClick={() => handleView(event)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-lg"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {event.status === "OPEN" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(event, "COMPLETED")
                              }
                              className="text-blue-600 rounded-lg"
                            >
                              <Check className="mr-2 h-4 w-4" /> Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(event)}
                            className="text-destructive font-bold rounded-lg"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-6 flex-grow">
         
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                          Attendance
                        </span>
                        <span className="text-xs font-black">
                          {event.participantCount || 0}{" "}
                          <span className="text-muted-foreground font-medium">
                            / {event.capacity}
                          </span>
                        </span>
                      </div>
                      <Progress
                        value={fillPercentage}
                        className="h-2 bg-secondary"
                      />
                    </div>

              
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground">
                          Fee
                        </span>
                        <div className="flex items-center gap-1.5 text-sm font-bold">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                          {formatCurrency(event.joiningFee)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground">
                          Location
                        </span>
                        <div className="flex items-center gap-1.5 text-sm font-bold truncate">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0">
                    <Button
                      onClick={() => handleView(event)}
                      className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border-none shadow-none rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 py-6"
                    >
                      Manage Event
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

 
      <CreateEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <EditEventModal
        open={isEditModalOpen}
        onOpenChange={(o) => {
          setIsEditModalOpen(o);
          if (!o) setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={eventToDelete?.title}
        isDeleting={isDeleting}
      />

      {meta.pages > 1 && (
        <div className="pt-6">
          <TablePagination currentPage={meta.page} totalPages={meta.pages} />
        </div>
      )}
    </div>
  );
};

export default MyEventsHost;
