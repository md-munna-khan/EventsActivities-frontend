/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDashboardStats } from '@/services/admin/dashboard.service';

const AdminMetaDashboard = async () => {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="alert alert-error">
        <p>Failed to load dashboard statistics</p>
      </div>
    );
  }

  const {
    totals = {},
    eventsByStatus = {},
    successCount = 0,
    recentEvents = [],
  } = stats;

  
  const totalEvents = totals.events || 1;
  const successPercentage = Math.round((successCount / totalEvents) * 100);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-8">
    
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Monitor platform activity, manage resources, and track key metrics</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
          <div className="group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-2h8v2zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-2">Total Users</p>
              <p className="text-4xl font-bold text-foreground mb-3">{totals.users ?? 0}</p>
              <p className="text-xs text-muted-foreground">Registered across platform</p>
            </div>
          </div>

         
          <div className="group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.5 1.5H19a1 1 0 011 1v15a1 1 0 01-1 1h-13a1 1 0 01-1-1v-15a1 1 0 011-1zM4.5 4.5a1 1 0 00-1 1v10a1 1 0 001 1h.01a1 1 0 001-1v-10a1 1 0 00-1-1z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+5%</span>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-2">Total Clients</p>
              <p className="text-4xl font-bold text-foreground mb-3">{totals.clients ?? 0}</p>
              <p className="text-xs text-muted-foreground">Active client profiles</p>
            </div>
          </div>

   
          <div className="group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">✓ Verified</span>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-2">Total Hosts</p>
              <p className="text-4xl font-bold text-foreground mb-3">{totals.hosts ?? 0}</p>
              <p className="text-xs text-muted-foreground">Verified host accounts</p>
            </div>
          </div>

       
          <div className="group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-muted-foreground text-sm font-medium mb-2">Total Events</p>
              <p className="text-4xl font-bold text-foreground mb-3">{totals.events ?? 0}</p>
              <p className="text-xs text-muted-foreground">Platform events created</p>
            </div>
          </div>
        </div>

 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80  shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full -mr-20 -mt-20" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">Total Revenue</p>
                  <p className="text-5xl font-bold">${(totals.revenue ?? 0).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg  bg-opacity-20 backdrop-blur">
              
                </div>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-white/20">
                <div>
                  <p className="text-white/80 text-xs">{totals.paidPayments ?? 0} Paid Payments</p>
                </div>
              </div>
            </div>
          </div>

       
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-destructive to-destructive/80  shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full -mr-20 -mt-20" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">Pending Applications</p>
                  <p className="text-5xl font-bold">{totals.pendingHostApplications ?? 0}</p>
                </div>
             
              </div>
              <div className="pt-6 border-t border-white/20">
                <p className="text-white/80 text-xs">Awaiting your approval</p>
              </div>
            </div>
          </div>

     
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full -mr-20 -mt-20" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">Success Rate</p>
                  <p className="text-5xl font-bold">{successPercentage}%</p>
                </div>
                <div className="p-4 rounded-lg  bg-opacity-20 backdrop-blur">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <div className="pt-6 border-t border-white/20">
                <p className="text-white/80 text-xs">{successCount} completed events</p>
              </div>
            </div>
          </div>
        </div>

      
        <div className="rounded-2xl bg-card shadow-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Events Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(eventsByStatus).length === 0 ? (
              <p className="text-muted-foreground col-span-4">No event data available</p>
            ) : (
              Object.entries(eventsByStatus).map(([status, count]) => {
                const maxCount = Math.max(...Object.values(eventsByStatus as Record<string, number>), 1);
                const percentage = ((count as number) / maxCount) * 100;
                return (
                  <div key={status} className="flex flex-col">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-foreground capitalize mb-1">{status}</p>
                      <p className="text-2xl font-bold text-foreground">{count as number}</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

       
        <div className="rounded-2xl bg-card shadow-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Events</h2>
          {recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              </svg>
              <p className="text-slate-600">No recent events to display</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 font-semibold ">Event Title</th>
                    <th className="text-left py-4 px-4 font-semibold ">Status</th>
                    <th className="text-left py-4 px-4 font-semibold ">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event: any, idx: number) => (
                    <tr key={event.id} className={`border-b border-slate-100  transition-colors ${idx !== recentEvents.length - 1 ? '' : ''}`}>
                      <td className="py-4 px-4">
                        <p className="font-medium ">{event.title}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-400">
                        {new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getStatusBadgeColor(status: string): string {
  const statusColors: Record<string, string> = {
    OPEN: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export default AdminMetaDashboard;
