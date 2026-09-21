import React from 'react';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import AgentList from '@/components/agent/AgentList';

function agent_list() {
    return (
        <div>
            <SuperadminDashboard>
                <AgentList />
            </SuperadminDashboard>

        </div>
    )
}

export default agent_list;
