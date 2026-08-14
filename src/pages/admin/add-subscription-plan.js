import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import AddPricingPlan from '@/components/pricing/AddSubscription';

function add_subscription_plan() {
    return (
        <div>
            <SuperadminDashboard>
                <AddPricingPlan />
            </SuperadminDashboard>

        </div>
    )
}

export default add_subscription_plan;
