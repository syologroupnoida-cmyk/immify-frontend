import React from 'react';
import EditService from '@/components/services/EditService';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';

function edit_service() {
    return (
        <div>
            <SuperadminDashboard>
                <EditService />
            </SuperadminDashboard>
        </div>
    )
}

export default edit_service;
