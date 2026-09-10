import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import AdminEditJobPost from '@/components/jobs/AdminEditJobPost';

function AdminEditJobPage() {
    return (
        <SuperadminDashboard>
            <AdminEditJobPost />
        </SuperadminDashboard>
    );
}

export default AdminEditJobPage;
