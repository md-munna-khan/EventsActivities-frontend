"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Calendar, 
    MapPin, 
    DollarSign, 
    Users, 
    ArrowLeft,
    Edit,
    Trash2,
    User
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDateTime } from '@/lib/formatters';
import Image from 'next/image';
import EditEventModal from '@/components/modules/Host/EditEventModal';
import { deleteEvent } from '@/services/host/hostService';

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
    participants?: Array<{
        id: string;
        clientId: string;
        participantStatus: string;
        client?: {
            id: string;
            name: string;
            email: string;
            profilePhoto?: string | null;
        };
    }>;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

interface EventDetailsClientProps {
    event: Event;
}

const EventDetailsClient = ({ event }: EventDetailsClientProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            OPEN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            FULL: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
            COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
            return;
        }

        startTransition(async () => {
            try {
                const result = await deleteEvent(event.id);

                if (result.success) {
                    toast.success('Event deleted successfully');
                    router.push('/host/dashboard/all-events');
                } else {
                    toast.error(result.message || 'Failed to delete event');
                }
            } catch (error) {
                toast.error('An error occurred while deleting the event');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Events
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                        disabled={isPending}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Event Image */}
            <Card className="overflow-hidden">
                <div className="relative h-96 w-full overflow-hidden bg-muted">
                    {event.image && event.image.trim() !== '' ? (
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            unoptimized
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <Calendar className="h-24 w-24 text-primary/30" />
                        </div>
                    )}
                    {/* Status Badge Overlay */}
                    <div className="absolute top-4 right-4">
                        <span
                            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow-lg ${getStatusColor(event.status)}`}
                        >
                            {event.status}
                        </span>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground shadow-lg">
                            {event.category}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Event Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Event Date</p>
                                        <p className="font-semibold">{formatDateTime(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="font-semibold">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Joining Fee</p>
                                        <p className="font-semibold">{formatCurrency(event.joiningFee)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Capacity</p>
                                        <p className="font-semibold">
                                            {event.participantCount || 0} / {event.capacity} participants
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participants */}
                    {event.participants && event.participants.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Participants ({event.participants.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {event.participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border"
                                        >
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0">
                                                {participant.client?.profilePhoto && participant.client.profilePhoto.trim() !== '' ? (
                                                    <Image
                                                        src={participant.client.profilePhoto}
                                                        alt={participant.client.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs font-semibold">
                                                        {participant.client?.name.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground">
                                                    {participant.client?.name || 'Unknown'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {participant.client?.email || 'No email'}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                participant.participantStatus === 'CONFIRMED' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                            }`}>
                                                {participant.participantStatus}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Host Info */}
                    {event.host && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Host Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted shrink-0">
                                        {event.host.profilePhoto && event.host.profilePhoto.trim() !== '' ? (
                                            <Image
                                                src={event.host.profilePhoto}
                                                alt={event.host.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-lg font-semibold">
                                                {event.host.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-lg">{event.host.name}</p>
                                        <p className="text-sm text-muted-foreground">{event.host.email}</p>
                                        {event.host.rating && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                ⭐ {event.host.rating.toFixed(1)} Rating
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Event Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Event Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                                    {event.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-semibold">{event.category}</span>
                            </div>
                            {event.createdAt && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span className="font-semibold text-sm">
                                        {formatDateTime(event.createdAt)}
                                    </span>
                                </div>
                            )}
                            {event.updatedAt && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span className="font-semibold text-sm">
                                        {formatDateTime(event.updatedAt)}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Modal */}
            <EditEventModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                event={event}
            />
        </div>
    );
};

export default EventDetailsClient;

