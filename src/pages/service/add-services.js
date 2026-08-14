import React from 'react';
import AddServices from '@/components/services/AddServices';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';

function add_services() {
    return (
        <div>
            <SuperadminDashboard>
                <AddServices />
            </SuperadminDashboard>
        </div>
    )
}

export default add_services;
