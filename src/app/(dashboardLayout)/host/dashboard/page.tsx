/* eslint-disable @typescript-eslint/no-explicit-any */
import  { Suspense } from 'react';
import { getMyEvents, IEventFilters } from '@/services/host/hostService';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import MyEventsClient from '@/components/modules/Host/MyEventsHost';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, DollarSign } from 'lucide-react';

interface HostDashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const HostDashboardPage = async ({ searchParams }: HostDashboardPageProps) => {
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

  // Fetch events for stats
  const result = await getMyEvents({ limit: 1000 });
  const allEvents = result.success && result.data ? result.data : [];
  
  // Calculate stats
  const totalEvents = allEvents.length;
  const upcomingEvents = allEvents.filter((e: any) => {
    const eventDate = new Date(e.date);
    return eventDate > new Date() && e.status === 'OPEN';
  }).length;
  const totalParticipants = allEvents.reduce((sum: number, e: any) => sum + (e.participantCount || 0), 0);
  const totalRevenue = allEvents.reduce((sum: number, e: any) => {
    return sum + ((e.participantCount || 0) * (e.joiningFee || 0) * 0.9); // 90% host share
  }, 0);

  // Fetch paginated events
  const paginatedResult = await getMyEvents(filters);
  const events = paginatedResult.success && paginatedResult.data ? paginatedResult.data : [];
  const meta = paginatedResult.meta || { page: 1, limit: 10, total: 0, pages: 0 };

  return (
    <div className=" container mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your events and track your performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              All your hosted events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events scheduled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Your share (90%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Events Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>
            View and manage all your hosted events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
            <MyEventsClient 
              initialEvents={events} 
              initialMeta={meta}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostDashboardPage;
