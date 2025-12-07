import React from 'react';
import HostApplicationsList from '@/components/modules/admin/HostApplicationsList';

const HostApplicationsPage = async () => {
    return (
        <div className="space-y-6">
            <HostApplicationsList />
        </div>
    );
};

export default HostApplicationsPage;