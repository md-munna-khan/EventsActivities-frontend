import  { Suspense } from 'react';
import { getMyEvents, IEventFilters } from '@/services/host/hostService';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import MyEventsHost from '@/components/modules/Host/MyEventsHost';


interface MyEventsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MyEventsPage = async ({ searchParams }: MyEventsPageProps) => {
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
    const result = await getMyEvents(filters);
 
    // Debug logging
    console.log("MyEventsPage - Filters:", filters);
    console.log("MyEventsPage - Result:", JSON.stringify(result, null, 2));

    const events = result.success && result.data ? result.data : [];
    const meta = result.meta || { page: 1, limit: 10, total: 0, pages: 0 };

    // Debug logging
    console.log("MyEventsPage - Events count:", events.length);
    console.log("MyEventsPage - Meta:", meta);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                <p className="text-muted-foreground">
                    View and manage your hosted events
                </p>
            </div>

            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <MyEventsHost 
                    initialEvents={events} 
                    initialMeta={meta}
                />
            </Suspense>
        </div>
    );
};

export default MyEventsPage;