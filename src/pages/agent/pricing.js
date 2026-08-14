import React from 'react';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import Pricing from '@/components/pricing/AgentPlansPricing';

function pricing() {
    return (
        <div>
            <AgentDashboard>
                <Pricing />
            </AgentDashboard>
        </div>
    )
}

export default pricing
