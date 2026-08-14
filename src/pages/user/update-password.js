import React from 'react';
import UserDashboard from '@/components/dashboard/CustomerDashboard';
import UpdatePassword from '@/components/user/UpdatePassword';

function update_profile() {
    return (
        <div>
            <UserDashboard>
                <UpdatePassword />
            </UserDashboard>
        </div>
    )
}

export default update_profile;
