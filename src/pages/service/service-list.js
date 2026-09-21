import React from 'react';
import ServiceListingList from '@/components/services/ServiceListingList';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';

function ServiceListingListPage() {
    return (
        <div>
            <SuperadminDashboard>
                <ServiceListingList />
            </SuperadminDashboard>
        </div>
    );
}

export default ServiceListingListPage;
