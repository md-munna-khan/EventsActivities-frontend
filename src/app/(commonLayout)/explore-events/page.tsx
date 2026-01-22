import React, { Suspense } from 'react';
import { getEvents, IEventFilters } from '@/services/host/hostService';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import ExploreEventsClient from '@/components/modules/event/ExploreEventsClient';

interface ExploreEventsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ExploreEventsPage = async ({ searchParams }: ExploreEventsPageProps) => {
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


    const result = await getEvents(filters);
 
 
    console.log("ExploreEventsPage - Filters:", filters);
    console.log("ExploreEventsPage - Result:", JSON.stringify(result, null, 2));

    const events = result.success && result.data ? result.data : [];
    const meta = result.meta || { page: 1, limit: 10, total: 0, pages: 0 };


    console.log("ExploreEventsPage - Events count:", events.length);
    console.log("ExploreEventsPage - Meta:", meta);

    return (
        <div className="space-y-6 p-4 md:p-8 mx-auto">
           
            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <ExploreEventsClient 
                    initialEvents={events} 
                    initialMeta={meta}
                />
            </Suspense>
        </div>
    );
};

export default ExploreEventsPage;
