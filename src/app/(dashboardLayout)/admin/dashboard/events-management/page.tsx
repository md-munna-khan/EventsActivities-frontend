import React from 'react';
import PendingEventsList from '@/components/modules/admin/PendingEventsList';

const EventsManagementPage = async () => {
    return (
        <div className="space-y-6">
            <PendingEventsList />
        </div>
    );
};

export default EventsManagementPage;