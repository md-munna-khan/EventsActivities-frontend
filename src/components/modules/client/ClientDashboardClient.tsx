/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Calendar, 
    TrendingUp, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    DollarSign,
    Ticket,
    Star,
    MapPin,
    ArrowRight,
    Activity,
    Users,
    AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDateTime } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ClientDashboardClientProps {
    bookings: any[];
}

const ClientDashboardClient = ({ bookings }: ClientDashboardClientProps) => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

    // Calculate statistics
    const totalBookings = bookings.length;
    const upcomingEvents = bookings.filter(b => 
        b.event?.status === 'OPEN' || b.event?.status === 'PENDING'
    ).length;
    const completedEvents = bookings.filter(b => 
        b.event?.status === 'COMPLETED' && b.participantStatus === 'CONFIRMED'
    ).length;
    const cancelledEvents = bookings.filter(b => 
        b.event?.status === 'CANCELLED' || b.participantStatus === 'CANCELLED'
    ).length;
    
    const totalSpent = bookings.reduce((sum, b) => {
        if (b.participantStatus === 'CONFIRMED') {
            return sum + (b.event?.joiningFee || 0);
        }
        return sum;
    }, 0);

    // Filter bookings
    const filteredBookings = bookings.filter(booking => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'upcoming') {
            return booking.event?.status === 'OPEN' || booking.event?.status === 'PENDING';
        }
        if (selectedFilter === 'completed') {
            return booking.event?.status === 'COMPLETED';
        }
        if (selectedFilter === 'cancelled') {
            return booking.event?.status === 'CANCELLED' || booking.participantStatus === 'CANCELLED';
        }
        return true;
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            COMPLETED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto p-6 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text  animate-gradient-x">
                                My Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">Track your events, bookings, and activity</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Primary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Bookings Card */}
                    <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-all duration-500 hover:shadow-2xl hover:scale-105">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <CardContent className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                                    <Ticket className="h-8 w-8" />
                                </div>
                                <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Total
                                </span>
                            </div>
                            <p className="text-white/80 text-sm font-semibold mb-2">Total Bookings</p>
                            <p className="text-5xl font-black mb-2">{totalBookings}</p>
                            <p className="text-white/70 text-xs">All time events</p>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events Card */}
                    <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white transition-all duration-500 hover:shadow-2xl hover:scale-105">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <CardContent className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                                    <Clock className="h-8 w-8" />
                                </div>
                                <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Active
                                </span>
                            </div>
                            <p className="text-white/80 text-sm font-semibold mb-2">Upcoming Events</p>
                            <p className="text-5xl font-black mb-2">{upcomingEvents}</p>
                            <p className="text-white/70 text-xs">Events to attend</p>
                        </CardContent>
                    </Card>

                    {/* Completed Events Card */}
                    <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transition-all duration-500 hover:shadow-2xl hover:scale-105">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <CardContent className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Done
                                </span>
                            </div>
                            <p className="text-white/80 text-sm font-semibold mb-2">Completed</p>
                            <p className="text-5xl font-black mb-2">{completedEvents}</p>
                            <p className="text-white/70 text-xs">Attended events</p>
                        </CardContent>
                    </Card>

                    {/* Total Spent Card */}
                    <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white transition-all duration-500 hover:shadow-2xl hover:scale-105">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <CardContent className="p-8 relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                                    <DollarSign className="h-8 w-8" />
                                </div>
                                <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Total
                                </span>
                            </div>
                            <p className="text-white/80 text-sm font-semibold mb-2">Total Spent</p>
                            <p className="text-5xl font-black mb-2">{formatCurrency(totalSpent)}</p>
                            <p className="text-white/70 text-xs">On all bookings</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Stats - Activity Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-green-500/10">
                                    <Activity className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
                                    <p className="text-3xl font-black text-foreground">
                                        {totalBookings > 0 ? Math.round((completedEvents / totalBookings) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-red-500/10">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground font-medium">Cancelled</p>
                                    <p className="text-3xl font-black text-foreground">{cancelledEvents}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/10">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground font-medium">Average Spend</p>
                                    <p className="text-3xl font-black text-foreground">
                                        {totalBookings > 0 ? formatCurrency(totalSpent / totalBookings) : formatCurrency(0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                            selectedFilter === 'all'
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                                : 'bg-card hover:bg-muted border border-border'
                        }`}
                    >
                        All Events ({totalBookings})
                    </button>
                    <button
                        onClick={() => setSelectedFilter('upcoming')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                            selectedFilter === 'upcoming'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                                : 'bg-card hover:bg-muted border border-border'
                        }`}
                    >
                        Upcoming ({upcomingEvents})
                    </button>
                    <button
                        onClick={() => setSelectedFilter('completed')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                            selectedFilter === 'completed'
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                                : 'bg-card hover:bg-muted border border-border'
                        }`}
                    >
                        Completed ({completedEvents})
                    </button>
                    <button
                        onClick={() => setSelectedFilter('cancelled')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                            selectedFilter === 'cancelled'
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                                : 'bg-card hover:bg-muted border border-border'
                        }`}
                    >
                        Cancelled ({cancelledEvents})
                    </button>
                </div>

                {/* Events List */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-card via-card/95 to-primary/5">
                    <CardHeader className="border-b border-border/50 pb-6">
                        <CardTitle className="text-3xl font-black flex items-center gap-3">
                            <span className="w-1.5 h-10 bg-gradient-to-b from-primary to-accent rounded-full" />
                            My Bookings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8">
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6">
                                    <AlertCircle className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">No bookings found</h3>
                                <p className="text-muted-foreground mb-6">
                                    {selectedFilter === 'all' 
                                        ? 'Start exploring events and make your first booking!'
                                        : `No ${selectedFilter} bookings at the moment.`
                                    }
                                </p>
                                <Link href="/explore-events">
                                    <Button size="lg" className="gap-2">
                                        Explore Events <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredBookings.map((booking: any) => (
                                    <Link 
                                        key={booking.id} 
                                        href={`/explore-events/${booking.event?.id}`}
                                        className="group"
                                    >
                                        <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-card to-card/50 hover:scale-105">
                                            <div className="relative h-48 w-full overflow-hidden bg-muted">
                                                {booking.event?.image ? (
                                                    <Image
                                                        src={booking.event.image}
                                                        alt={booking.event.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                                        <Calendar className="h-16 w-16 text-primary/40" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                
                                                {/* Status Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${getStatusColor(booking.event?.status || 'PENDING')}`}>
                                                        {booking.event?.status || 'PENDING'}
                                                    </span>
                                                </div>

                                                {/* Category Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 text-gray-800 backdrop-blur-md">
                                                        {booking.event?.category || 'Event'}
                                                    </span>
                                                </div>

                                                {/* Title Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <h3 className="text-white font-black text-lg line-clamp-2 drop-shadow-lg">
                                                        {booking.event?.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <CardContent className="p-5 space-y-4">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                                                        <span className="font-semibold text-foreground">
                                                            {booking.event?.date ? formatDateTime(booking.event.date) : 'TBA'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                                        <span className="text-muted-foreground line-clamp-1">
                                                            {booking.event?.location || 'Location TBA'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                                                        <span className="font-bold text-foreground">
                                                            {formatCurrency(booking.event?.joiningFee || 0)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.participantStatus)}`}>
                                                        {booking.participantStatus}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        View Details
                                                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/10 via-card to-accent/10 hover:shadow-2xl transition-all duration-300 group">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                                    <Users className="h-10 w-10 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-foreground mb-2">Explore Events</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Discover amazing events happening around you</p>
                                    <Link href="/explore-events">
                                        <Button variant="default" className="gap-2 group-hover:gap-3 transition-all">
                                            Browse Events <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-accent/10 via-card to-primary/10 hover:shadow-2xl transition-all duration-300 group">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
                                    <Star className="h-10 w-10 text-accent" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-foreground mb-2">Become a Host</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Start hosting your own events and grow your community</p>
                                    <Link href="/dashboard/apply-host">
                                        <Button variant="outline" className="gap-2 group-hover:gap-3 transition-all">
                                            Apply Now <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboardClient;
