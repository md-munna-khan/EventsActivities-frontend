/* eslint-disable @typescript-eslint/no-explicit-any */

import { getPendingHostApplications } from '@/services/admin/admin.service';
import ApproveRejectButtons from './ApproveRejectButtons.client';

// Server component: fetch pending host applications and render list
const HostApplicationsList = async () => {
  const result = await getPendingHostApplications();
  const apps = result?.data || [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Pending Host Applications</h2>
      {apps.length === 0 ? (
        <div>No pending applications</div>
      ) : (
        <div className="grid gap-4">
          {apps.map((app: any) => (
            <div key={app.id} className="p-4 border rounded-md flex justify-between items-center">
              <div>
                <div className="font-medium">{(app as any).name || app.user?.email}</div>
                <div className="text-sm text-muted-foreground">User ID: {app.userId}</div>
              </div>
              <div className="flex gap-2">
                <ApproveRejectButtons applicationId={app.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostApplicationsList;
