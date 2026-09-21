"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import Swal from "sweetalert2";
import { fetchJobListingById, fetchJobListings, submitJobApplication, uploadJobResume } from "@/util/jobListings";

function DetailItem({ label, value }) {
  if (!value && value !== 0) return null;

  return (
    <div className="border-b border-slate-100 pb-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function DetailGrid({ items }) {
  const visibleItems = items.filter((item) => item.value || item.value === 0);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
      {visibleItems.map((item) => (
        <DetailItem key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}

function BulletList({ title, items }) {
  if (!items.length) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircleIcon sx={{ fontSize: 17, color: "#2563EB", marginTop: "1px", flexShrink: 0 }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SuggestedJobCard({ job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="relative h-36 w-full overflow-hidden">
        <img src={job.image} alt={job.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 shadow-sm">
          {job.industry}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 text-sm font-bold shadow-sm ${job.logoClass}`}>
            {job.logo}
          </span>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-950 group-hover:text-blue-700">{job.title}</h3>
            <p className="mt-1 truncate text-xs font-medium text-slate-500">{job.company}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-xs text-slate-600">
          <p className="flex items-center gap-1.5">
            <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "#64748b" }} />
            <span className="truncate">{job.location}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <WorkHistoryOutlinedIcon sx={{ fontSize: 15, color: "#64748b" }} />
            <span className="truncate">{job.experience}</span>
          </p>
        </div>
        <p className="mt-auto pt-4 text-sm font-bold text-blue-700">{job.salary}</p>
      </div>
    </Link>
  );
}

const initialApplicationForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  currentLocation: "",
  yearsExperience: "",
  noticePeriod: "",
  coverLetter: "",
  linkedinUrl: "",
  portfolioUrl: "",
  resumeUrl: "",
  consent: false,
};

function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

function getApiMessage(payload, fallback) {
  return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

function removeEmptyPayloadFields(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "")
  );
}

function JobApplicationForm({ job }) {
  const [formData, setFormData] = useState(initialApplicationForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleConsentChange = (event) => {
    setFormData((current) => ({ ...current, consent: event.target.checked }));
    setErrors((current) => ({ ...current, consent: "" }));
  };

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0] || null;
    event.target.value = "";

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setResumeFile(null);
      setFormData((current) => ({ ...current, resumeUrl: "" }));
      setErrors((current) => ({ ...current, resumeFile: "Please upload a PDF resume." }));
      return;
    }

    setResumeFile(file);
    setErrors((current) => ({ ...current, resumeFile: "" }));

    setUploadingResume(true);
    try {
      const resumeUrl = await uploadJobResume(file);
      setFormData((current) => ({ ...current, resumeUrl }));
      setErrors((current) => ({ ...current, resumeFile: "" }));
    } catch (error) {
      setResumeFile(null);
      setFormData((current) => ({ ...current, resumeUrl: "" }));
      setErrors((current) => ({
        ...current,
        resumeFile: getApiErrorMessage(error, "Unable to upload resume PDF. Please try again."),
      }));
    } finally {
      setUploadingResume(false);
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) nextErrors.email = "Enter a valid email.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!formData.currentLocation.trim()) nextErrors.currentLocation = "Current location is required.";
    if (!formData.yearsExperience.trim()) nextErrors.yearsExperience = "Years of experience is required.";
    if (!formData.noticePeriod.trim()) nextErrors.noticePeriod = "Notice period is required.";
    if (!formData.coverLetter.trim()) nextErrors.coverLetter = "Cover letter is required.";
    if (uploadingResume) nextErrors.resumeFile = "Please wait until resume upload finishes.";
    if (!formData.resumeUrl) nextErrors.resumeFile = "Resume PDF is required.";
    if (!formData.consent) nextErrors.consent = "Consent is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => removeEmptyPayloadFields({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    currentLocation: formData.currentLocation.trim(),
    yearsExperience: formData.yearsExperience.trim(),
    noticePeriod: formData.noticePeriod.trim(),
    coverLetter: formData.coverLetter.trim(),
    linkedinUrl: formData.linkedinUrl.trim(),
    portfolioUrl: formData.portfolioUrl.trim(),
    resumeUrl: formData.resumeUrl,
    consent: formData.consent,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await submitJobApplication(job.id, buildPayload());

      await Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: getApiMessage(response?.data, "Application submitted successfully."),
        confirmButtonColor: "#2563eb",
      });

      setFormData(initialApplicationForm);
      setResumeFile(null);
      setErrors({});
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: getApiErrorMessage(error, "Unable to submit application right now."),
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Stack spacing={2}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
          <TextField size="small" label="First Name" value={formData.firstName} onChange={handleChange("firstName")} error={!!errors.firstName} helperText={errors.firstName} disabled={submitting} required />
          <TextField size="small" label="Last Name" value={formData.lastName} onChange={handleChange("lastName")} error={!!errors.lastName} helperText={errors.lastName} disabled={submitting} required />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
          <TextField size="small" type="email" label="Email" value={formData.email} onChange={handleChange("email")} error={!!errors.email} helperText={errors.email} disabled={submitting} required />
          <TextField size="small" label="Phone" value={formData.phone} onChange={handleChange("phone")} error={!!errors.phone} helperText={errors.phone} disabled={submitting} required />
        </Box>
        <TextField size="small" label="Current Location" value={formData.currentLocation} onChange={handleChange("currentLocation")} error={!!errors.currentLocation} helperText={errors.currentLocation} disabled={submitting} required />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
          <TextField size="small" label="Years Experience" value={formData.yearsExperience} onChange={handleChange("yearsExperience")} error={!!errors.yearsExperience} helperText={errors.yearsExperience} disabled={submitting} required />
          <TextField size="small" label="Notice Period" value={formData.noticePeriod} onChange={handleChange("noticePeriod")} error={!!errors.noticePeriod} helperText={errors.noticePeriod} disabled={submitting} required />
        </Box>
        <TextField size="small" label="LinkedIn URL" value={formData.linkedinUrl} onChange={handleChange("linkedinUrl")} disabled={submitting} />
        <TextField size="small" label="Portfolio URL" value={formData.portfolioUrl} onChange={handleChange("portfolioUrl")} disabled={submitting} />
        <TextField size="small" multiline minRows={4} label="Cover Letter" value={formData.coverLetter} onChange={handleChange("coverLetter")} error={!!errors.coverLetter} helperText={errors.coverLetter} disabled={submitting} required />

        <Box>
          <Button component="label" variant="outlined" startIcon={uploadingResume ? <CircularProgress size={16} /> : <CloudUploadOutlinedIcon />} disabled={submitting || uploadingResume} sx={{ textTransform: "none", borderRadius: 1 }}>
            {uploadingResume ? "Uploading Resume..." : resumeFile ? "Change Resume PDF" : "Upload Resume PDF"}
            <input hidden type="file" accept="application/pdf,.pdf" onChange={handleResumeChange} />
          </Button>
          <Typography variant="body2" sx={{ mt: 1, color: errors.resumeFile ? "#dc2626" : "#64748b", wordBreak: "break-word" }}>
            {errors.resumeFile || (formData.resumeUrl ? `${resumeFile?.name || "Resume PDF"} uploaded` : resumeFile?.name || "PDF only")}
          </Typography>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={formData.consent} onChange={handleConsentChange} disabled={submitting} />}
          label="I consent to Immify sharing my application with the hiring team."
          sx={{ alignItems: "flex-start", color: errors.consent ? "#dc2626" : "#334155", "& .MuiFormControlLabel-label": { fontSize: 14, lineHeight: 1.45, mt: "9px" } }}
        />
        {errors.consent && <Alert severity="error">{errors.consent}</Alert>}

        <Button type="submit" variant="contained" disabled={submitting || uploadingResume} startIcon={submitting ? <CircularProgress color="inherit" size={16} /> : null} sx={{ bgcolor: "#2563eb", py: 1.15, textTransform: "none", borderRadius: 1, "&:hover": { bgcolor: "#1d4ed8" } }}>
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </Stack>
    </Box>
  );
}

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return undefined;
    let active = true;

    async function loadJobDetails() {
      try {
        setLoading(true);
        setError("");
        const [data, jobs] = await Promise.all([
          fetchJobListingById(id),
          fetchJobListings(),
        ]);
        if (active) {
          setJob(data);
          setSuggestedJobs(jobs.filter((item) => String(item.id) !== String(id)).slice(0, 4));
          if (!data) setError("Job details were not found.");
        }
      } catch (loadError) {
        if (active) setError(loadError?.message || "Unable to load job details right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJobDetails();
    return () => {
      active = false;
    };
  }, [id]);

  const details = useMemo(() => {
    if (!job) return [];
    return [
      { label: "Industry", value: job.industry },
      { label: "Employment Type", value: job.type },
      { label: "Qualification", value: job.qualification },
      { label: "Experience", value: job.experience },
      { label: "Vacancies", value: job.vacancyCount },
      { label: "Indicative Salary", value: job.salary },
      { label: "Visa / Work Permit", value: job.visaWorkPermit },
      { label: "Source Status", value: job.sourceStatus },
      { label: "Submitted On", value: job.submittedOn },
      { label: "Application Deadline", value: job.deadlineLabel },
    ];
  }, [job]);

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
          Back to Jobs
        </Link>

        {loading ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading job details...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center">
            <h1 className="text-lg font-semibold text-slate-900">Job not available</h1>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-0">
              <div className="lg:pr-10">
                <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-72">
                  <img src={job.image} alt={job.title} className="h-full w-full object-cover" />
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      <BusinessCenterOutlinedIcon sx={{ fontSize: 15 }} />
                      {job.industry}
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{job.title}</h1>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                      <LocationOnOutlinedIcon sx={{ fontSize: 17 }} />
                      {job.location}
                    </p>
                  </div>
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-100 text-base font-bold shadow-sm ${job.logoClass}`}>
                    {job.logo}
                  </span>
                </div>

                <section className="mt-8">
                  <h2 className="text-lg font-semibold text-slate-900">Job Description</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{job.description}</p>
                </section>

                <section className="mt-8">
                  <h2 className="text-lg font-semibold text-slate-900">Job Information</h2>
                  <div className="mt-5">
                    <DetailGrid items={details} />
                  </div>
                </section>

                <div className="mt-8 space-y-8">
                  <BulletList title="Responsibilities" items={job.responsibilities} />
                  <BulletList title="Required Skills" items={job.requiredSkills} />
                </div>
              </div>

              <aside className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <h2 className="text-lg font-semibold text-slate-900">Apply for this job</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <p className="flex items-center gap-2">
                    <PaidOutlinedIcon sx={{ fontSize: 18, color: "#2563EB" }} />
                    {job.salary}
                  </p>
                  <p className="flex items-center gap-2">
                    <WorkHistoryOutlinedIcon sx={{ fontSize: 18, color: "#2563EB" }} />
                    {job.experience}
                  </p>
                </div>
                <JobApplicationForm job={job} />
              </aside>
            </div>

            {suggestedJobs.length > 0 && (
              <section className="mt-14 border-t border-slate-200 pt-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">More Jobs</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">Suggested jobs for you</h2>
                  </div>
                  <Link href="/jobs" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                    View all jobs
                  </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {suggestedJobs.map((suggestedJob) => (
                    <SuggestedJobCard key={suggestedJob.id} job={suggestedJob} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

JobDetailsPage.useDefaultLayout = true;
