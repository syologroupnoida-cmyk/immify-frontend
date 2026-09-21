import React from 'react';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import AddJobPost from '@/components/jobs/AddJobPost';

function AddJobPostPage() {
    return (
        <AgentDashboard>
            <AddJobPost />
        </AgentDashboard>
    );
}

export default AddJobPostPage;
