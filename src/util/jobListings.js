import MainApi from '@/util/MainApi';

export const JOB_LISTINGS_ENDPOINT = '/job-listings';
export const JOB_FILE_UPLOAD_ENDPOINT = '/uploads/file';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.immify.in/api/v1';

const FALLBACK_IMAGES = [
  '/images/home/home-hero-work.png',
  '/images/home/home-hero-immigration.png',
  '/images/home/home-hero-study.png',
  '/images/home/home-hero-documentation.png',
];

const LOGO_CLASSES = [
  'bg-[#F3F7FF] text-[#2563EB]',
  'bg-[#ECFDF5] text-[#059669]',
  'bg-[#FFF7ED] text-[#C2410C]',
  'bg-[#111827] text-white',
  'bg-white text-[#DB2777]',
];

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function getPayload(value) {
  return value?.data ?? value;
}

function findFirstNestedArray(value, depth = 0) {
  if (!value || depth > 3) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== 'object') return [];

  for (const item of Object.values(value)) {
    const nested = findFirstNestedArray(item, depth + 1);
    if (nested.length) return nested;
  }

  return [];
}

function getJobList(value) {
  const payload = getPayload(value);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.jobs)) return payload.jobs;
  if (Array.isArray(payload?.jobListings)) return payload.jobListings;
  if (Array.isArray(payload?.job_listings)) return payload.job_listings;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.content)) return payload.data.content;
  if (Array.isArray(payload?.data?.jobs)) return payload.data.jobs;
  if (Array.isArray(payload?.data?.jobListings)) return payload.data.jobListings;
  if (Array.isArray(payload?.data?.job_listings)) return payload.data.job_listings;
  return findFirstNestedArray(value);
}

function getJobObject(value) {
  const payload = getPayload(value);
  if (payload?.id) return payload;
  if (payload?.data?.id) return payload.data;
  if (payload?.job?.id) return payload.job;
  return null;
}

function getUploadUrl(responseData) {
  const data = responseData?.data ?? responseData ?? {};
  return (
    data?.url ||
    data?.fileUrl ||
    data?.file_url ||
    data?.location ||
    data?.path ||
    data?.data?.url ||
    data?.data?.fileUrl ||
    data?.data?.file_url ||
    data?.data?.location ||
    data?.data?.path ||
    ''
  );
}

function slugify(value) {
  return String(value || 'general')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general';
}

function getInitials(value) {
  const words = String(value || 'Job')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'J';
}

function getStableIndex(value, length) {
  const text = String(value || '');
  if (!text || !length) return 0;

  return Array.from(text).reduce((total, char) => total + char.charCodeAt(0), 0) % length;
}

function formatLocation(job) {
  return [job.cityRegion, job.country].filter(Boolean).join(', ') || 'Location not specified';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatPosted(value) {
  if (!value) return 'recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';

  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`;
  return formatDate(value);
}

function getCompany(job) {
  return (
    job.vendor?.companyName ||
    job.vendor?.businessName ||
    job.vendor?.name ||
    job.companyName ||
    'Immify Jobs'
  );
}

export function isPublicJob(job) {
  const status = String(job?.reviewStatus || job?.review_status || job?.status || job?.sourceStatus || '').toUpperCase();
  if (['REJECTED', 'DELETED', 'ARCHIVED', 'INACTIVE'].includes(status)) return false;
  return status === 'APPROVED' || status === 'PUBLISHED' || status === 'ACTIVE' || job?.isPublished === true || job?.isVisible === true || !status;
}

export function getJobCategoryLabel(category) {
  if (!category || category === 'all') return 'All Jobs';
  return String(category)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function normalizeJobListing(job = {}, index = 0) {
  const company = getCompany(job);
  const title = job.title || 'Untitled Job';
  const industry = job.industry || job.dynamicData?.industry || 'General';
  const responsibilities = toArray(job.responsibilities).filter(Boolean);
  const requiredSkills = toArray(job.requiredSkills).filter(Boolean);
  const tags = [job.experience, industry, job.qualification].filter(Boolean);
  const id = job.id || `${slugify(title)}-${index}`;
  const fallbackIndex = getStableIndex(id || title, FALLBACK_IMAGES.length);
  const imageUrl =
    job.imageUrl ||
    job.image_url ||
    job.bannerImage ||
    job.banner_image ||
    job.featuredImage ||
    job.featured_image ||
    job.image?.url ||
    job.image?.path ||
    job.media?.url ||
    job.dynamicData?.imageUrl ||
    job.dynamic_data?.imageUrl ||
    '';

  return {
    ...job,
    id,
    title,
    company,
    country: job.country || '',
    cityRegion: job.cityRegion || '',
    location: formatLocation(job),
    industry,
    category: slugify(industry),
    qualification: job.qualification || 'Not specified',
    experience: job.experience || 'Experience not specified',
    type: job.employmentType || 'Employment type not specified',
    salary: job.indicativeSalary || 'Salary not disclosed',
    visaWorkPermit: job.visaWorkPermit || 'Not specified',
    sourceStatus: job.sourceStatus || '',
    description: job.description || 'Full job description will be shared by the hiring team.',
    responsibilities,
    requiredSkills,
    vacancyCount: Number(job.vacancyCount) || 1,
    applicationEmail: job.applicationEmail || '',
    applicationUrl: job.applicationUrl || '',
    applicationDeadline: job.applicationDeadline || '',
    submittedOn: formatDate(job.submittedAt || job.createdAt),
    deadlineLabel: formatDate(job.applicationDeadline),
    posted: formatPosted(job.submittedAt || job.createdAt),
    logo: getInitials(company === 'Immify Jobs' ? title : company),
    logoClass: LOGO_CLASSES[index % LOGO_CLASSES.length],
    image: getAbsoluteImageUrl(imageUrl, fallbackIndex),
    tags: tags.length ? tags.slice(0, 3) : ['International Role'],
    isSaved: false,
    raw: job,
  };
}

export function getJobFallbackImage(index = 0) {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function getAbsoluteImageUrl(value, index = 0) {
  if (value && typeof value === 'object') {
    return getAbsoluteImageUrl(value.url || value.path || value.location || value.fileUrl || value.file_url, index);
  }

  if (typeof value !== 'string' || !value.trim()) return getJobFallbackImage(index);

  const text = value.trim();
  const markdownMatch = text.match(/\((https?:\/\/[^)]+)\)/i);
  const imageUrl = markdownMatch?.[1] || text;

  if (/^(https?:)?\/\//i.test(imageUrl) || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') || imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('uploads/')) {
    const normalizedBase = API_BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL.replace(/\/$/, '')}${imageUrl}`;
  }

  return imageUrl;
}

export async function fetchJobListings() {
  const response = await MainApi.get(JOB_LISTINGS_ENDPOINT, {
    params: { take: 20, skip: 0 },
    skipAuth: true,
    suppressAuthRedirect: true,
  });

  return getJobList(response.data)
    .filter(isPublicJob)
    .map((job, index) => normalizeJobListing(job, index));
}

export async function fetchJobListingById(id) {
  try {
    const response = await MainApi.get(`${JOB_LISTINGS_ENDPOINT}/${id}`, {
      skipAuth: true,
      suppressAuthRedirect: true,
    });
    const job = getJobObject(response.data);
    if (job) return normalizeJobListing(job);
  } catch {
    // Some APIs expose only the collection route; fall back to it below.
  }

  const jobs = await fetchJobListings();
  return jobs.find((job) => String(job.id) === String(id)) || null;
}

export async function uploadJobResume(file) {
  if (!file) return '';

  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('name', 'job-resume');
  uploadData.append('purpose', 'resume');

  const response = await MainApi.post(JOB_FILE_UPLOAD_ENDPOINT, uploadData, {
    skipAuth: true,
    suppressAuthRedirect: true,
  });

  const resumeUrl = getUploadUrl(response?.data);
  if (!resumeUrl) throw new Error('Resume upload succeeded but no file URL was returned.');

  return resumeUrl;
}

export async function submitJobApplication(jobId, payload) {
  return MainApi.post(`${JOB_LISTINGS_ENDPOINT}/${jobId}/applications`, payload, {
    skipAuth: true,
    suppressAuthRedirect: true,
  });
}
