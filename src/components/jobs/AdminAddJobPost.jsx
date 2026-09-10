'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { JobPostForm } from '@/components/jobs/AddJobPost';

const ADMIN_JOB_LISTINGS_ENDPOINT = '/admin/job-listings';

export default function AdminAddJobPost() {
    const router = useRouter();

    return (
        <JobPostForm
            endpoint={ADMIN_JOB_LISTINGS_ENDPOINT}
            title="Add Job Post"
            onCancel={() => router.push('/admin/job-list')}
            onSubmit={() => router.push('/admin/job-list')}
        />
    );
}
