import React from 'react';
import LeadList from '@/components/leads/LeadList';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';

function add_services() {
    return (
        <div>
            <SuperadminDashboard>
                <LeadList />
            </SuperadminDashboard>
        </div>
    )
}

export default add_services;
