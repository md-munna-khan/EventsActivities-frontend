import React, { Suspense } from 'react';
import { getEvents, IEventFilters } from '@/services/host/hostService';

import { TableSkeleton } from '@/components/shared/TableSkeleton';
import AllEventsClient from '@/components/modules/Host/AllEventsClient';

interface AllEventsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AllEventsPage = async ({ searchParams }: AllEventsPageProps) => {
    const params = await searchParams;
    
    // Extract filters from search params
    const filters: IEventFilters = {
        category: typeof params.category === 'string' ? params.category : undefined,
        status: typeof params.status === 'string' ? params.status : undefined,
        search: typeof params.search === 'string' ? params.search : undefined,
        fromDate: typeof params.fromDate === 'string' ? params.fromDate : undefined,
        toDate: typeof params.toDate === 'string' ? params.toDate : undefined,
        page: params.page ? Number(params.page) : 1,
        limit: params.limit ? Number(params.limit) : 10,
    };

    // Fetch events
    const result = await getEvents(filters);
 
    // Debug logging
    console.log("AllEventsPage - Filters:", filters);
    console.log("AllEventsPage - Result:", JSON.stringify(result, null, 2));

    const events = result.success && result.data ? result.data : [];
    const meta = result.meta || { page: 1, limit: 10, total: 0, pages: 0 };

    // Debug logging
    console.log("AllEventsPage - Events count:", events.length);
    console.log("AllEventsPage - Meta:", meta);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">All Events</h1>
                <p className="text-muted-foreground">
                    View and manage all events in the system
                </p>
            </div>

            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <AllEventsClient 
                    initialEvents={events} 
                    initialMeta={meta}
                />
            </Suspense>
        </div>
    );
};

export default AllEventsPage;
