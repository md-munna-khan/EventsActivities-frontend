/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import EventApproveRejectButtons from './EventApproveRejectButtons.client';
import { getPendingEvents } from '@/services/admin/admin.service';

const PendingEventsList = async () => {
  const result = await getPendingEvents();
  const events = result?.data || [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Pending Events</h2>
      {events.length === 0 ? (
        <div>No pending events</div>
      ) : (
        <div className="grid gap-4">
          {events.map((ev: any) => (
            <div key={ev.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-sm text-muted-foreground">Host: {ev.host?.name || ev.host?.email}</div>
                  <div className="text-sm">Status: {ev.status}</div>
                </div>
                <div>
                  <EventApproveRejectButtons eventId={ev.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingEventsList;
