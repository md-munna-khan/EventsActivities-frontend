/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TablePagination from '@/components/shared/TablePagination';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Calendar, 
    MapPin, 
    DollarSign, 
    Users, 
    Eye,
    Filter,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDateTime } from '@/lib/formatters';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

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
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface ExploreEventsClientProps {
    initialEvents: Event[];
    initialMeta: Meta;
}

const ExploreEventsClient = ({ initialEvents, initialMeta }: ExploreEventsClientProps) => {
    const router = useRouter();
    const [isPending] = useTransition();
    
    const events = initialEvents;
    const meta = initialMeta;

    const categoryOptions = [
        { label: 'Sports', value: 'SPORTS' },
        { label: 'Music', value: 'MUSIC' },
        { label: 'Food', value: 'FOOD' },
        { label: 'Technology', value: 'TECHNOLOGY' },
        { label: 'Arts', value: 'ARTS' },
        { label: 'Business', value: 'BUSINESS' },
        { label: 'Education', value: 'EDUCATION' },
        { label: 'Health', value: 'HEALTH' },
        { label: 'Other', value: 'OTHER' },
    ];

    const getStatusStyles = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
            OPEN: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            FULL: 'bg-orange-100 text-orange-700 border-orange-200',
            COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
        };
        return styles[status] || 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-10 max-w-7xl">
        
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase ">
                        Discover <span className="text-primary ">Events</span>
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-md">
                        Explore the best activities, workshops, and gatherings in your city.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    {meta.total} Events Live
                </div>
            </div>

    
            <div className="sticky top-4 z-20 bg-white/80 dark:bg-card/80 backdrop-blur-md p-4 rounded-2xl border shadow-xl flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Search className="h-5 w-5 text-primary" />
                    </div>
                    <SearchFilter 
                        placeholder="Search by title, location or keywords..." 
                        paramName="search"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <SelectFilter
                        paramName="category"
                        placeholder="All Categories"
                        options={categoryOptions}
                    />
                    <div className="h-8 w-px bg-border hidden lg:block" />
                    <Button variant="outline" className="rounded-xl font-bold h-11">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </div>
            </div>

           
            <div className="relative min-h-[500px]">
                {isPending && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-30 flex items-center justify-center rounded-3xl">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                )}

                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                        <div className="bg-muted p-6 rounded-full">
                            <Calendar className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-black  uppercase">No events found</h3>
                        <p className="text-muted-foreground max-w-xs">Adjust your search or filters to find what you&apos;re looking for.</p>
                        <Button onClick={() => router.push('/explore-events')} variant="link" className="text-primary font-bold">
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <Card 
                                key={event.id} 
                                className="group h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 pt-0 overflow-hidden flex flex-col bg-card"
                            >
                              
                                <div className="relative h-56 overflow-hidden">
                                    {event.image ? (
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                                            <Calendar className="h-16 w-16 text-primary/20" />
                                        </div>
                                    )}
                                    
                                   
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <Badge className="bg-white/90 text-black border-none font-bold uppercase text-[10px] tracking-widest shadow-lg">
                                            {event.category}
                                        </Badge>
                                        <Badge className={`font-bold border backdrop-blur-md shadow-lg ${getStatusStyles(event.status)}`}>
                                            {event.status}
                                        </Badge>
                                    </div>

                                  
                                    <div className="absolute bottom-4 left-4">
                                        <div className="bg-primary text-white px-3 py-1.5 rounded-xl shadow-xl border border-primary-foreground/20">
                                            <p className="text-sm font-black tracking-tighter">
                                                {event.joiningFee === 0 ? 'FREE' : formatCurrency(event.joiningFee)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                           
                                <CardHeader className="p-5 pb-2">
                                    <CardTitle className="text-xl font-black  uppercase tracking-tighter line-clamp-2 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-5 pt-0 flex-grow space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                                        {event.description}
                                    </p>
                                    
                                    <div className="space-y-2 pt-4 border-t border-dashed">
                                        <div className="flex items-center gap-3 text-sm font-semibold">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <span>{formatDateTime(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                            <Users className="h-4 w-4 text-primary" />
                                            <span>{event.participantCount || 0} / {event.capacity} Joined</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-5 pt-0">
                                    <Button 
                                        className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 group/btn active:scale-95 transition-all"
                                        onClick={() => router.push(`/explore-events/${event.id}`)}
                                    >
                                        View Event
                                        <ArrowUpRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

           
            {meta.pages > 1 && (
                <div className="pt-10 flex justify-center border-t">
                    <TablePagination
                        currentPage={meta.page}
                        totalPages={meta.pages}
                    />
                </div>
            )}
        </div>
    );
};

export default ExploreEventsClient;