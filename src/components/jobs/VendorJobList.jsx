'use client';

import React from 'react';
import { JobListingsTable } from '@/components/jobs/AdminJobList';

const VENDOR_JOB_LISTINGS_ENDPOINT = '/vendor/job-listings';

export default function VendorJobList() {
    return (
        <JobListingsTable
            endpoint={VENDOR_JOB_LISTINGS_ENDPOINT}
            title="Job List"
            editPath="/agent/edit-job"
            canReview={false}
            showVendor={false}
        />
    );
}
