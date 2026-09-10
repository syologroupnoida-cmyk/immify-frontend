import React from 'react';
import AgentDashboard from '@/components/dashboard/AgentDashboard';
import ServiceListingList, { VENDOR_SERVICE_LISTINGS_ENDPOINT } from '@/components/services/ServiceListingList';

function AgentServiceListingPage() {
    return (
        <div>
            <AgentDashboard>
                <ServiceListingList
                    endpoint={VENDOR_SERVICE_LISTINGS_ENDPOINT}
                    title="My Service Listings"
                    canReview={false}
                />
            </AgentDashboard>
        </div>
    );
}

export default AgentServiceListingPage;
