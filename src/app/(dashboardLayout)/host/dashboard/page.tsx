/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react';
import { getMyEvents, IEventFilters } from '@/services/host/hostService';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import MyEventsClient from '@/components/modules/Host/MyEventsHost';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    Calendar, 
    Users, 
    TrendingUp, 
    DollarSign, 
    Plus, 
    BarChart3,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HostDashboardPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const HostDashboardPage = async ({ searchParams }: HostDashboardPageProps) => {
    const params = await searchParams;
    
    const filters: IEventFilters = {
        category: typeof params.category === 'string' ? params.category : undefined,
        status: typeof params.status === 'string' ? params.status : undefined,
        search: typeof params.search === 'string' ? params.search : undefined,
        fromDate: typeof params.fromDate === 'string' ? params.fromDate : undefined,
        toDate: typeof params.toDate === 'string' ? params.toDate : undefined,
        page: params.page ? Number(params.page) : 1,
        limit: params.limit ? Number(params.limit) : 10,
    };

    const result = await getMyEvents({ limit: 1000 });
    const allEvents = result.success && result.data ? result.data : [];
    
    const totalEvents = allEvents.length;
    const upcomingEvents = allEvents.filter((e: any) => {
        const eventDate = new Date(e.date);
        return eventDate > new Date() && e.status === 'OPEN';
    }).length;
    const totalParticipants = allEvents.reduce((sum: number, e: any) => sum + (e.participantCount || 0), 0);
    const totalRevenue = allEvents.reduce((sum: number, e: any) => {
        return sum + ((e.participantCount || 0) * (e.joiningFee || 0) * 0.9);
    }, 0);

    const paginatedResult = await getMyEvents(filters);
    const events = paginatedResult.success && paginatedResult.data ? paginatedResult.data : [];
    const meta = paginatedResult.meta || { page: 1, limit: 10, total: 0, pages: 0 };

    return (
        <div className="container mx-auto px-4 py-8 space-y-10 ">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase ">
                        Host <span className="text-primary not-italic">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-md leading-relaxed">
                        Analyze your event performance, manage attendees, and track your revenue growth.
                    </p>
                </div>
                
             
            </div>

            {/* Performance Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat 
                    label="Total Events" 
                    value={totalEvents} 
                    icon={BarChart3} 
                    desc="Events hosted all-time"
                    trend="+12% from last month"
                />
                <DashboardStat 
                    label="Upcoming" 
                    value={upcomingEvents} 
                    icon={Calendar} 
                    desc="Active scheduled events"
                    variant="primary"
                />
                <DashboardStat 
                    label="Participants" 
                    value={totalParticipants} 
                    icon={Users} 
                    desc="Engaged community members"
                    trend="+48 new this week"
                />
                <DashboardStat 
                    label="Revenue (90%)" 
                    value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    icon={DollarSign} 
                    desc="Net earnings after fees"
                    variant="accent"
                />
            </div>

            {/* Event Management Table Section */}
            <Card className="border-none shadow-2xl bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 border-b p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Event Catalog</CardTitle>
                            <CardDescription className="font-medium">
                                Showing <span className="text-foreground font-bold">{events.length}</span> of {meta.total} total events
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <TrendingUp className="h-5 w-5" />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <Suspense fallback={
                        <div className="p-6">
                            <TableSkeleton columns={7} rows={10} />
                        </div>
                    }>
                        <MyEventsClient 
                            initialEvents={events} 
                            initialMeta={meta}
                        />
                    </Suspense>
                </CardContent>
            </Card>

            {/* Support Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-secondary/20 rounded-2xl border border-border flex items-center justify-between group cursor-pointer hover:bg-secondary/30 transition-colors">
                    <div className="space-y-1">
                        <h4 className="font-bold text-lg">Need help with hosting?</h4>
                        <p className="text-sm text-muted-foreground">Read our guide on creating high-conversion events.</p>
                    </div>
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                    <div className="space-y-1">
                        <h4 className="font-bold text-lg text-primary">Payout Settings</h4>
                        <p className="text-sm text-primary/70">Connect your bank account to receive automatic payouts.</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-primary" />
                </div>
            </div>
        </div>
    );
};

/* --- Refined Stat Component --- */

const DashboardStat = ({ label, value, icon: Icon, desc, trend, variant }: any) => {
    const isPrimary = variant === 'primary';
    const isAccent = variant === 'accent';

    return (
        <Card className={`relative overflow-hidden border-none shadow-xl transition-all duration-300 hover:-translate-y-1 ${
            isPrimary ? 'bg-primary text-primary-foreground' : 
            isAccent ? 'bg-slate-900 text-white' : 'bg-card'
        }`}>
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl ${
                        isPrimary || isAccent ? 'bg-white/10' : 'bg-primary/10 text-primary'
                    }`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    {trend && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            isPrimary || isAccent ? 'bg-white/20' : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tight">{value}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                        isPrimary || isAccent ? 'opacity-70' : 'text-muted-foreground'
                    }`}>
                        {label}
                    </p>
                </div>
                <p className={`text-[11px] font-medium leading-tight ${
                    isPrimary || isAccent ? 'opacity-60' : 'text-muted-foreground/80'
                }`}>
                    {desc}
                </p>
            </CardContent>
        </Card>
    );
};

export default HostDashboardPage;