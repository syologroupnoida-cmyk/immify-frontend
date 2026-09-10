'use client';

import React from 'react';
import { Alert, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { JobPostForm } from '@/components/jobs/AddJobPost';

const ADMIN_JOB_LISTINGS_ENDPOINT = '/admin/job-listings';

export default function AdminEditJobPost() {
    const router = useRouter();
    const jobListingId = router.query.jobListingId || router.query.id || '';

    if (!router.isReady) {
        return null;
    }

    if (!jobListingId) {
        return (
            <Box sx={{ width: '100%' }}>
                <Alert severity="error">Job listing ID is required to edit this job.</Alert>
            </Box>
        );
    }

    return (
        <JobPostForm
            mode="edit"
            endpoint={ADMIN_JOB_LISTINGS_ENDPOINT}
            jobListingId={String(jobListingId)}
            title="Edit Job Post"
            onCancel={() => router.push('/admin/job-list')}
            onSubmit={() => router.push('/admin/job-list')}
        />
    );
}
