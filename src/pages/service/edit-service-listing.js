import React from 'react';
import AddServiceListing from '@/components/services/AddServiceListing';
import AgentDashboard from '@/components/dashboard/AgentDashboard';

function EditServiceListingPage() {
    return (
        <div>
            <AgentDashboard>
                <AddServiceListing />
            </AgentDashboard>
        </div>
    );
}

export default EditServiceListingPage;
