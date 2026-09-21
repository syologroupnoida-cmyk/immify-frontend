import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import AdminJobList from '@/components/jobs/AdminJobList';

function AdminJobListPage() {
    return (
        <SuperadminDashboard>
            <AdminJobList />
        </SuperadminDashboard>
    );
}

export default AdminJobListPage;
