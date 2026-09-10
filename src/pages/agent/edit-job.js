import React from 'react';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import EditJobPost from '@/components/jobs/EditJobPost';

function EditJobPostPage() {
    return (
        <AgentDashboard>
            <EditJobPost />
        </AgentDashboard>
    );
}

export default EditJobPostPage;
