import { getPendingEvents, getPendingHostApplications } from "@/services/admin/admin.service";


const DashboardOverview = async () => {
  // fetch some basic counts
  const pendingAppsRes = await getPendingHostApplications();
  const pendingEventsRes = await getPendingEvents();

  const pendingApps = (pendingAppsRes?.data || []).length || 0;
  const pendingEvents = (pendingEventsRes?.data || []).length || 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <div className="text-sm text-muted-foreground">Pending Applications</div>
        <div className="text-2xl font-bold">{pendingApps}</div>
      </div>
      <div className="p-4 border rounded">
        <div className="text-sm text-muted-foreground">Pending Events</div>
        <div className="text-2xl font-bold">{pendingEvents}</div>
      </div>
    </div>
  );
};

export default DashboardOverview;
