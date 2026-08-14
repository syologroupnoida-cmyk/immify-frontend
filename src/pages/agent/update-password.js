import React from 'react';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import UpdatePassword from '@/components/agent/UpdatePassword';

function update_password() {
    return (
        <div>
            <AgentDashboard>
                <UpdatePassword />
            </AgentDashboard>
        </div>
    )
}

export default update_password;
