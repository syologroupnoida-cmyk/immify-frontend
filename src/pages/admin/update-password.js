import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import UpdatePassword from '@/components/admin/UpdatePassword';

function update_password() {
    return (
        <div>
            <SuperadminDashboard>
                <UpdatePassword />
            </SuperadminDashboard>
        </div>
    )
}

export default update_password;
