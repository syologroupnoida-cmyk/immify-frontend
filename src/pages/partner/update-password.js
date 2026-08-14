import React from 'react';
import PartnerDashboard from '@/components/dashboard/PartnerDashboard';
import UpdatePassword from '@/components/partner/UpdatePassword';

function update_password() {
    return (
        <div>
            <PartnerDashboard>
                <UpdatePassword />
            </PartnerDashboard>
        </div>
    )
}

export default update_password;
