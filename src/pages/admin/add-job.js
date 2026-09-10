import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import AdminAddJobPost from '@/components/jobs/AdminAddJobPost';

function AdminAddJobPage() {
    return (
        <SuperadminDashboard>
            <AdminAddJobPost />
        </SuperadminDashboard>
    );
}

export default AdminAddJobPage;
