'use client';

import React from 'react';
import { Alert, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { JobPostForm } from '@/components/jobs/AddJobPost';

export default function EditJobPost() {
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
            jobListingId={String(jobListingId)}
            onCancel={() => router.push('/agent/job-list')}
            onSubmit={() => router.push('/agent/job-list')}
        />
    );
}
