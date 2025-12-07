import ApplyHostClient from '@/components/modules/client/ApplyHostClient';
import React from 'react';

const ApplyHostPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apply to Become a Host</h1>
        <p className="text-muted-foreground">Submit an application to become a host. An admin will review your request.</p>
      </div>

      <ApplyHostClient />
    </div>
  );
};

export default ApplyHostPage;