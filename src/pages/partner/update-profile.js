import React from 'react';
import PartnerDashboard from '@/components/dashboard/PartnerDashboard';
import UpdateProfile from '@/components/partner/UpdateProfile';

function update_profile() {
    return (
        <div>
            <PartnerDashboard>
                <UpdateProfile />
            </PartnerDashboard>
        </div>
    )
}

export default update_profile;
