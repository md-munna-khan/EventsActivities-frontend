/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useTransition, useEffect } from 'react';
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
    User,
    Clock,
    Star,
    Share2,
    Bookmark,
    TrendingUp
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDateTime } from '@/lib/formatters';
import Image from 'next/image';
import EditEventModal from '@/components/modules/Host/EditEventModal';
import { deleteEvent } from '@/services/host/hostService';
import { joinEvent, leaveEvent, checkEventParticipation } from '@/services/events/eventService';
import { getUserInfo } from '@/services/auth/getUserInfo';
import { getEventReviews } from '@/services/events/reviewService';
import SpinnerLoader from '@/components/shared/SpinnerLoader';

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
    currentUserId?: string | null;
}

const EventDetailsClient = ({ event, currentUserId }: EventDetailsClientProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    
    // Check if current user is the host
    const isHost = currentUserId && event.hostId && String(currentUserId) === String(event.hostId);
    
    // Check if event date is over
    const isEventPast = new Date(event.date) < new Date();
    
    // Check participation status and user role
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const userInfo = await getUserInfo();
                setUserRole(userInfo?.role || null);
                
                if (userInfo && !isHost) {
                    const participation = await checkEventParticipation(event.id);
                    if (participation.success && participation.data) {
                        setIsJoined(participation.data.isJoined || false);
                    } else {
                        // Check if user is in participants list
                        const userEmail = userInfo.email || userInfo.client?.email || userInfo.host?.email;
                        const isInParticipants = event.participants?.some(
                            (p: any) => p.client?.email === userEmail || p.clientId === userInfo.id || p.clientId === userInfo.client?.id
                        );
                        setIsJoined(isInParticipants || false);
                    }
                }
            } catch (_error) {
                console.error("Error checking participation:", _error);
            } finally {
                setIsChecking(false);
            }
        };
        
        checkStatus();
    }, [event.id, event.participants, isHost]);

    useEffect(() => {
        // Clear reviews immediately when event changes to prevent showing stale reviews
        setReviews([]);
        setIsLoadingReviews(true);

        let isMounted = true; // Track if component is still mounted to prevent state updates after unmount

        const fetchReviews = async () => {
            try {
                const res = await getEventReviews(event.id);
                
                if (!isMounted) return; // Prevent state updates if component unmounted
                
                if (res && res.success === false) {
                    toast.error(res.message || 'Failed to load reviews');
                    setReviews([]);
                    return;
                }

                const data = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray((res as any)?.reviews)
                        ? (res as any).reviews
                        : Array.isArray(res)
                            ? (res as any)
                            : [];

                if (isMounted) {
                    setReviews(data);
                }
            } catch (error: any) {
                if (isMounted) {
                    toast.error(error?.message || 'Failed to load reviews');
                    setReviews([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingReviews(false);
                }
            }
        };

        fetchReviews();

        // Cleanup function to prevent state updates from outdated requests
        return () => {
            isMounted = false;
        };
    }, [event.id]);

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
                    router.push('/explore-events');
                } else {
                    toast.error(result.message || 'Failed to delete event');
                }
            } catch {
                toast.error('An error occurred while deleting the event');
            }
        });
    };

    const handleJoin = async () => {
        startTransition(async () => {
            try {
                const result = await joinEvent(event.id);
               
                if (result.success) {
                    if (result.data?.paymentUrl) {
                        // Redirect to payment page
                        window.location.href = result.data.paymentUrl;
                    } else {
                        toast.success('Joined event successfully!');
                        setIsJoined(true);
                        router.refresh();
                    }
                } else {
                    toast.error(result.message || 'Failed to join event');
                }
            } catch (error: any) {
                toast.error(error.message || 'An error occurred while joining the event');
            }
        });
    };

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this event?')) {
            return;
        }

        startTransition(async () => {
            try {
                const result = await leaveEvent(event.id);
                if (result.success) {
                    toast.success('Left event successfully');
                    setIsJoined(false);
                    router.refresh();
                } else {
                    toast.error(result.message || 'Failed to leave event');
                }
            } catch (error: any) {
                toast.error(error.message || 'An error occurred while leaving the event');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Floating Header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="gap-2 hover:gap-3 transition-all duration-300 group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Events
                        </Button>
                        <div className="flex gap-2">
                            {!isHost && (
                                <>
                                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            {isHost && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(true)}
                                        disabled={isPending}
                                        className="hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={isPending}
                                        className="hover:shadow-lg transition-shadow"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section with Image */}
            <div className="relative max-w-7xl mx-auto px-4 pt-6">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                    <div className="relative h-[500px] w-full overflow-hidden">
                        {event.image && event.image.trim() !== '' ? (
                            <>
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    unoptimized
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary via-primary/60 to-accent animate-gradient-xy">
                                <Calendar className="h-32 w-32 text-white/30" />
                            </div>
                        )}
                        
                        {/* Floating Badges */}
                        <div className="absolute top-6 right-6 flex flex-col gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold shadow-2xl backdrop-blur-md border border-white/20 ${getStatusColor(event.status)} animate-in fade-in slide-in-from-top-4 duration-500`}
                            >
                                {event.status}
                            </span>
                        </div>
                        <div className="absolute top-6 left-6">
                            <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-gray-800 shadow-2xl border border-white/40 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
                                {event.category}
                            </span>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <h1 className="text-5xl font-black mb-4 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-semibold">{formatDateTime(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-semibold">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-semibold">{formatCurrency(event.joiningFee)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Details */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                                <p className="text-xs text-muted-foreground font-medium">Event Date</p>
                                <p className="text-sm font-bold text-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <DollarSign className="h-6 w-6 text-green-600 mb-2" />
                                <p className="text-xs text-muted-foreground font-medium">Joining Fee</p>
                                <p className="text-sm font-bold text-foreground mt-1">{formatCurrency(event.joiningFee)}</p>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Users className="h-6 w-6 text-purple-600 mb-2" />
                                <p className="text-xs text-muted-foreground font-medium">Attendees</p>
                                <p className="text-sm font-bold text-foreground mt-1">{event.participantCount || 0}/{event.capacity}</p>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <MapPin className="h-6 w-6 text-orange-600 mb-2" />
                                <p className="text-xs text-muted-foreground font-medium">Location</p>
                                <p className="text-sm font-bold text-foreground mt-1 truncate">{event.location}</p>
                            </div>
                        </div>

                        {/* Description Card */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="text-2xl font-black flex items-center gap-2">
                                    <span className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
                                    About This Event
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Participants */}
                        {event.participants && event.participants.length > 0 && (
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                <CardHeader className="border-b border-border/50">
                                    <CardTitle className="text-2xl font-black flex items-center gap-2">
                                        <span className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
                                        Attendees ({event.participants.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {event.participants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-md"
                                            >
                                                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 shrink-0 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                                                    {participant.client?.profilePhoto && participant.client.profilePhoto.trim() !== '' ? (
                                                        <Image
                                                            src={participant.client.profilePhoto}
                                                            alt={participant.client.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-primary text-sm font-black">
                                                            {participant.client?.name.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {participant.client?.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {participant.client?.email || 'No email'}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    participant.participantStatus === 'CONFIRMED' 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
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
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                                <CardHeader className="border-b border-border/50 relative">
                                    <CardTitle className="text-lg font-black flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Event Host
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 relative">
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-30 animate-pulse" />
                                            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 ring-4 ring-background">
                                                {event.host.profilePhoto && event.host.profilePhoto.trim() !== '' ? (
                                                    <Image
                                                        src={event.host.profilePhoto}
                                                        alt={event.host.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary text-3xl font-black">
                                                        {event.host.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-black text-xl text-foreground">{event.host.name}</p>
                                            <p className="text-sm text-muted-foreground">{event.host.email}</p>
                                            {event.host.rating && (
                                                <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
                                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                                                        {event.host.rating.toFixed(1)} Rating
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Event Stats */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="text-lg font-black flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Event Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary">
                                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                                    <span className={`font-bold px-3 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-accent/5 to-transparent border-l-4 border-accent">
                                    <span className="text-sm font-medium text-muted-foreground">Category</span>
                                    <span className="font-bold text-sm">{event.category}</span>
                                </div>
                                {event.createdAt && (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-transparent border-l-4 border-blue-500">
                                        <span className="text-sm font-medium text-muted-foreground">Created</span>
                                        <span className="font-bold text-xs">
                                            {formatDateTime(event.createdAt)}
                                        </span>
                                    </div>
                                )}
                                {event.updatedAt && (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-500/5 to-transparent border-l-4 border-green-500">
                                        <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                                        <span className="font-bold text-xs">
                                            {formatDateTime(event.updatedAt)}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Join/Leave Button - Only show for non-hosts */}
                        {!isHost && userRole === 'CLIENT' && !isChecking && (
                            <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary via-primary to-accent overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
                                <CardContent className="pt-6 relative">
                                    {isJoined ? (
                                        <Button
                                            variant="destructive"
                                            className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                            onClick={handleLeave}
                                            disabled={isPending}
                                        >
                                            Leave Event
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full h-14 bg-white text-primary hover:bg-white/90 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                            onClick={handleJoin}
                                            disabled={isPending || event.status !== 'OPEN' || (event.participantCount || 0) >= event.capacity || isEventPast}
                                        >
                                            {isPending ? 'Processing...' : (
                                                <span className="flex items-center gap-2">
                                                    <DollarSign className="h-5 w-5" />
                                                    Join Event - {formatCurrency(event.joiningFee)}
                                                </span>
                                            )}
                                        </Button>
                                    )}
                                    {event.status !== 'OPEN' && (
                                        <p className="text-sm text-white/90 mt-3 text-center font-semibold">
                                            This event is not open for joining
                                        </p>
                                    )}
                                    {(event.participantCount || 0) >= event.capacity && event.status === 'OPEN' && !isEventPast && (
                                        <p className="text-sm text-white/90 mt-3 text-center font-semibold">
                                            This event is full
                                        </p>
                                    )}
                                    {isEventPast && (
                                        <p className="text-sm text-white/90 mt-3 text-center font-semibold">
                                            This event has already passed
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-card via-card/95 to-accent/5">
                    <CardHeader className="border-b border-border/50 pb-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-3xl font-black flex items-center gap-3">
                                <span className="w-1.5 h-10 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                                What People Are Saying
                            </CardTitle>
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
                                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                    <span className="font-black text-lg text-amber-700 dark:text-amber-400">
                                        {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        {isLoadingReviews ? (
                            <div className="py-12 flex justify-center">
                                <SpinnerLoader />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-4">
                                    <Star className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <p className="text-lg font-semibold text-muted-foreground">No reviews yet</p>
                                <p className="text-sm text-muted-foreground mt-2">Be the first to leave a review after attending!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review: any, idx: number) => (
                                    <div 
                                        key={review.id} 
                                        className="group relative rounded-2xl border border-border/50 p-6 bg-gradient-to-br from-card to-card/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative">
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity" />
                                                        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary flex items-center justify-center font-black text-lg ring-2 ring-background">
                                                            {(review.client?.name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg text-foreground group-hover:text-primary transition-colors">{review.client?.name || 'Anonymous'}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map((_, idx) => (
                                                        <Star 
                                                            key={idx} 
                                                            className={`h-5 w-5 ${
                                                                idx < (review.rating ?? 0) 
                                                                    ? 'text-amber-500 fill-amber-500' 
                                                                    : 'text-gray-300 dark:text-gray-600'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <div className="pl-[72px]">
                                                    <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-line">{review.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Modal - Only show for host */}
            {isHost && (
                <EditEventModal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    event={event}
                />
            )}
            </div>
        </div>
    );
};

export default EventDetailsClient;

