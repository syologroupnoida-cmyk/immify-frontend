import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import UpdateProfile from '@/components/admin/UpdateProfile';

function update_profile() {
    return (
        <div>
            <SuperadminDashboard>
                <UpdateProfile />
            </SuperadminDashboard>
        </div>
    )
}

export default update_profile;
