import React from 'react';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import UpdateProfile from '@/components/agent/UpdateProfile';

function update_profile() {
    return (
        <div>
            <AgentDashboard>
                <UpdateProfile />
            </AgentDashboard>
        </div>
    )
}

export default update_profile;
