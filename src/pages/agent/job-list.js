import React from 'react';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import VendorJobList from '@/components/jobs/VendorJobList';

function AgentJobListPage() {
    return (
        <AgentDashboard>
            <VendorJobList />
        </AgentDashboard>
    );
}

export default AgentJobListPage;
