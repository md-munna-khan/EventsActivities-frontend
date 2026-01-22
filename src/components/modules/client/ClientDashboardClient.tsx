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
import { Badge } from '@/components/ui/badge';

interface ClientDashboardClientProps {
    bookings: any[];
}

const ClientDashboardClient = ({ bookings }: ClientDashboardClientProps) => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

    // Stats Calculation Logic (No changes to functionality)
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

    const filteredBookings = bookings.filter(booking => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'upcoming') return booking.event?.status === 'OPEN' || booking.event?.status === 'PENDING';
        if (selectedFilter === 'completed') return booking.event?.status === 'COMPLETED';
        if (selectedFilter === 'cancelled') return booking.event?.status === 'CANCELLED' || booking.participantStatus === 'CANCELLED';
        return true;
    });

    const getStatusStyles = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900',
            CONFIRMED: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900',
            CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
            OPEN: 'bg-primary/10 text-primary border-primary/20',
            COMPLETED: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {/* Header Section - Responsive Stack */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                            My <span className="text-primary">Dashboard</span>
                        </h1>
                        <p className="text-muted-foreground max-w-md">
                            Welcome back! You have <span className="text-foreground font-semibold">{upcomingEvents} upcoming</span> events this month.
                        </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">System Status: Active</p>
                        <p className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard 
                        title="Total Bookings" 
                        value={totalBookings} 
                        icon={Ticket} 
                        variant="primary" 
                        footer="Lifetime activity"
                    />
                    <StatCard 
                        title="Upcoming" 
                        value={upcomingEvents} 
                        icon={Clock} 
                        variant="secondary" 
                        footer="Awaiting events"
                    />
                    <StatCard 
                        title="Completed" 
                        value={completedEvents} 
                        icon={CheckCircle2} 
                        variant="success" 
                        footer="Events attended"
                    />
                    <StatCard 
                        title="Total Spent" 
                        value={formatCurrency(totalSpent)} 
                        icon={DollarSign} 
                        variant="accent" 
                        footer="Invested in events"
                    />
                </div>

                {/* Secondary Activity Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ActivityMiniCard 
                        icon={Activity} 
                        label="Attendance Rate" 
                        value={`${totalBookings > 0 ? Math.round((completedEvents / totalBookings) * 100) : 0}%`}
                        color="text-emerald-500"
                    />
                    <ActivityMiniCard 
                        icon={XCircle} 
                        label="Cancellations" 
                        value={cancelledEvents} 
                        color="text-destructive"
                    />
                    <ActivityMiniCard 
                        icon={TrendingUp} 
                        label="Avg. Per Event" 
                        value={totalBookings > 0 ? formatCurrency(totalSpent / totalBookings) : formatCurrency(0)}
                        color="text-primary"
                    />
                </div>

                {/* Filter Navigation - Custom Scroll for Mobile */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            Recent Bookings
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        <FilterButton 
                            active={selectedFilter === 'all'} 
                            onClick={() => setSelectedFilter('all')}
                            label={`All (${totalBookings})`}
                        />
                        <FilterButton 
                            active={selectedFilter === 'upcoming'} 
                            onClick={() => setSelectedFilter('upcoming')}
                            label="Upcoming"
                            color="active:bg-primary"
                        />
                        <FilterButton 
                            active={selectedFilter === 'completed'} 
                            onClick={() => setSelectedFilter('completed')}
                            label="Completed"
                        />
                        <FilterButton 
                            active={selectedFilter === 'cancelled'} 
                            onClick={() => setSelectedFilter('cancelled')}
                            label="Cancelled"
                        />
                    </div>
                </div>

                {/* Events List Grid */}
                <div className="min-h-[400px]">
                    {filteredBookings.length === 0 ? (
                        <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 text-center">
                            <div className="p-4 rounded-full bg-muted mb-4">
                                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">No events found</h3>
                            <p className="text-muted-foreground mb-6">Try changing your filters or explore new events.</p>
                            <Link href="/explore-events">
                                <Button>Find New Events</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {filteredBookings.map((booking: any) => (
                                <Link key={booking.id} href={`/explore-events/${booking.event?.id}`} className="group">
                                    <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
                                        <div className="relative aspect-video overflow-hidden">
                                            {booking.event?.image ? (
                                                <Image
                                                    src={booking.event.image}
                                                    alt={booking.event.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                                                    <Calendar className="h-12 w-12 text-secondary" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                                <Badge variant="outline" className={`backdrop-blur-md shadow-sm ${getStatusStyles(booking.event?.status || 'PENDING')}`}>
                                                    {booking.event?.status}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                                <Badge className="mb-2 bg-primary/90 text-primary-foreground hover:bg-primary">
                                                    {booking.event?.category || 'General'}
                                                </Badge>
                                                <h3 className="text-white font-bold line-clamp-1">{booking.event?.title}</h3>
                                            </div>
                                        </div>

                                        <CardContent className="p-5 space-y-4">
                                            <div className="grid gap-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    <span className="truncate font-medium text-foreground">
                                                        {booking.event?.date ? formatDateTime(booking.event.date) : 'TBA'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    <span className="truncate">{booking.event?.location || 'Location TBA'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <DollarSign className="h-4 w-4 text-primary" />
                                                    <span className="font-bold text-lg text-foreground">
                                                        {formatCurrency(booking.event?.joiningFee || 0)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Your Status</span>
                                                    <span className={`text-sm font-bold ${booking.participantStatus === 'CONFIRMED' ? 'text-emerald-600' : 'text-primary'}`}>
                                                        {booking.participantStatus}
                                                    </span>
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ActionCard 
                        title="Explore Events"
                        description="Find your next favorite activity nearby."
                        icon={Users}
                        href="/explore-events"
                        btnText="Browse All"
                        variant="primary"
                    />
                    <ActionCard 
                        title="Become a Host"
                        description="Share your passion and lead your own community."
                        icon={Star}
                        href="/dashboard/apply-host"
                        btnText="Apply to Host"
                        variant="secondary"
                    />
                </div>
            </div>
        </div>
    );
};

/* --- Refined Sub-components for better Clean Code --- */

const StatCard = ({ title, value, icon: Icon, variant, footer }: any) => {
    const variants: any = {
        primary: "bg-primary text-primary-foreground shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground shadow-secondary/20",
        success: "bg-emerald-600 text-white shadow-emerald-200",
        accent: "bg-slate-900 text-white shadow-slate-200",
    };

    return (
        <Card className={`relative overflow-hidden border-none shadow-lg transition-transform hover:-translate-y-1 duration-300 ${variants[variant]}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-md">
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-extrabold">{value}</h3>
                    <p className="text-xs font-medium opacity-80 uppercase tracking-widest">{title}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-medium opacity-70">
                    {footer}
                </div>
            </CardContent>
        </Card>
    );
};

const ActivityMiniCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-2 rounded-xl bg-muted`}>
                <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </CardContent>
    </Card>
);

const FilterButton = ({ active, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
            active 
            ? 'bg-primary text-primary-foreground border-primary shadow-md' 
            : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
        }`}
    >
        {label}
    </button>
);

const ActionCard = ({ title, description, icon: Icon, href, btnText, variant }: any) => (
    <Card className={`group border-none shadow-xl overflow-hidden`}>
        <CardContent className="p-0">
            <div className={`p-6 sm:p-8 flex items-center gap-6 ${variant === 'primary' ? 'bg-primary/5' : 'bg-secondary/5'}`}>
                <div className={`hidden sm:flex p-4 rounded-2xl ${variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <Link href={href} className="inline-block">
                        <Button variant={variant === 'primary' ? 'default' : 'outline'} className="gap-2 group-hover:translate-x-1 transition-transform">
                            {btnText} <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default ClientDashboardClient;