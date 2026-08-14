import React from 'react';
import UserDashboard from '@/components/dashboard/CustomerDashboard';
import UpdateProfile from '@/components/user/UpdateProfile';

function update_profile() {
    return (
        <div>
            <UserDashboard>
                <UpdateProfile />
            </UserDashboard>
        </div>
    )
}

export default update_profile;
