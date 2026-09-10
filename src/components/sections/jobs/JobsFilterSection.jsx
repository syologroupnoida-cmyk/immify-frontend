"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarIcon from "@mui/icons-material/Star";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import { fetchJobListings, getJobCategoryLabel } from "@/util/jobListings";

const experienceLevels = [
  { id: "entry", label: "Entry Level (0-2 years)" },
  { id: "mid", label: "Mid Level (3-5 years)" },
  { id: "senior", label: "Senior Level (5+ years)" },
];

const jobTypes = [
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
];

const salaryRanges = [
  { id: "0-5000", label: "Up to 5,000" },
  { id: "5000-10000", label: "5,000 - 10,000" },
  { id: "10000-20000", label: "10,000 - 20,000" },
  { id: "20000+", label: "20,000+" },
];

function getFirstNumber(value) {
  const match = String(value || "").replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function matchesExperienceRange(job, selected) {
  if (!selected.length) return true;
  const value = String(job.experience || "").toLowerCase();
  return selected.some((exp) => {
    if (exp === "entry") return /0\s*-\s*2|1\s*-\s*2|1\s*-\s*3|entry|fresh/.test(value);
    if (exp === "mid") return /2\s*-\s*5|3\s*-\s*5|3\s*-\s*6|mid/.test(value);
    if (exp === "senior") return /5\+|6\+|senior|lead/.test(value);
    return false;
  });
}

function matchesSalaryRange(job, selected) {
  if (!selected.length) return true;
  const amount = getFirstNumber(job.salary);
  if (amount === null) return false;

  return selected.some((salary) => {
    if (salary === "0-5000") return amount <= 5000;
    if (salary === "5000-10000") return amount > 5000 && amount <= 10000;
    if (salary === "10000-20000") return amount > 10000 && amount <= 20000;
    if (salary === "20000+") return amount > 20000;
    return false;
  });
}

function JobCard({ job, onSave, onCardClick }) {
  const [isSaved, setIsSaved] = useState(job.isSaved);

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSaved((value) => !value);
    onSave?.(job.id);
  };

  return (
    <Link
      href={`/jobs/${job.id}`}
      onClick={(event) => {
        event.preventDefault();
        onCardClick(job.id);
      }}
      className="group flex h-full min-h-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img src={job.image} alt={job.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 shadow-sm">
          {job.industry}
        </span>
        <button
          type="button"
          aria-label={`Save ${job.title}`}
          onClick={handleSave}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-red-500"
        >
          {isSaved ? (
            <FavoriteRoundedIcon sx={{ fontSize: 16, color: "#EF4444" }} />
          ) : (
            <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 text-sm font-bold shadow-sm ${job.logoClass}`}>
            {job.logo}
          </span>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-blue-700">{job.title}</h3>
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

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="text-base font-semibold leading-none text-blue-600">{job.salary}</p>
          <p className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600">
            <StarIcon sx={{ fontSize: 13 }} />
            {job.vacancyCount}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Posted {job.posted}</span>
          <span className="inline-flex items-center gap-1">
            <CheckCircleIcon sx={{ fontSize: 12 }} />
            Active
          </span>
        </div>

        <span className="mt-4 inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
          View Details
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 10 }} />
        </span>
      </div>
    </Link>
  );
}

function FilterSection({ title, options, selected, onChange, icon: Icon }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="py-2.5">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon sx={{ fontSize: 18 }} />}
          {title}
        </span>
        {isExpanded ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => onChange(option.id)}
                className="hidden"
              />
              <span className="flex h-4 w-4 items-center justify-center rounded border border-slate-300">
                {selected.includes(option.id) ? (
                  <CheckCircleIcon sx={{ fontSize: 14, color: "#2563EB" }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: "#9CA3AF" }} />
                )}
              </span>
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function JobSearchPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaries, setSelectedSalaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchJobListings();
        if (active) setJobs(data);
      } catch (loadError) {
        if (active) setError(loadError?.message || "Unable to load jobs right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["all", ...new Set(jobs.map((job) => job.category).filter(Boolean))],
    [jobs]
  );

  const categoryCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = category === "all" ? jobs.length : jobs.filter((job) => job.category === category).length;
      return acc;
    }, {});
  }, [categories, jobs]);

  const filteredJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !term ||
        [job.title, job.company, job.location, job.industry, job.qualification]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));

      const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
      const matchesJobType =
        selectedJobTypes.length === 0 ||
        selectedJobTypes.some((type) => String(job.type || "").toLowerCase().replace(/\s+/g, "-").includes(type));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesExperienceRange(job, selectedExperience) &&
        matchesJobType &&
        matchesSalaryRange(job, selectedSalaries)
      );
    });
  }, [jobs, searchTerm, selectedCategory, selectedExperience, selectedJobTypes, selectedSalaries]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (type, value) => {
    const setSelected = {
      experience: setSelectedExperience,
      jobType: setSelectedJobTypes,
      salary: setSelectedSalaries,
    }[type];

    setCurrentPage(1);
    setSelected?.((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedExperience([]);
    setSelectedJobTypes([]);
    setSelectedSalaries([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f6f8ff] px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <section className="relative -mx-4 mb-8 min-h-[260px] overflow-hidden sm:-mx-6 lg:-mx-8">
        <img
          src="/images/marketplace-banner.png"
          alt="Jobs Marketplace"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto flex min-h-[260px] max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Jobs Marketplace</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            Browse active overseas openings by role, location, experience, and salary.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside
            className="job-sidebar sticky top-16 flex h-[calc(140vh-20px)] flex-col overflow-hidden rounded-2xl bg-white p-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-semibold text-slate-900">Filter</h2>
              <button type="button" onClick={clearAllFilters} className="cursor-pointer text-sm font-semibold text-blue-600">
                Reset All
              </button>
            </div>

            <div
              className="job-sidebar-body mt-3 min-h-0 flex-1 divide-y divide-slate-200 overflow-y-auto pr-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="py-2.5">
                <p className="text-sm font-semibold text-slate-800">Search Keywords</p>
                <div className="mt-3 flex items-center rounded-xl border border-slate-200 px-3">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 w-full bg-transparent text-sm outline-none"
                  />
                  <SearchRoundedIcon className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="py-2.5">
                <p className="text-sm font-semibold text-slate-800">Categories</p>
                <div className="mt-3 space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50">
                      <span className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="job-category"
                          checked={selectedCategory === category}
                          onChange={() => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                          }}
                          className="h-4 w-4 border-slate-300"
                        />
                        {getJobCategoryLabel(category)}
                      </span>
                      <span className="text-xs text-slate-500">{categoryCounts[category] || 0}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FilterSection title="Experience Level" options={experienceLevels} selected={selectedExperience} onChange={(value) => handleFilterChange("experience", value)} icon={WorkHistoryOutlinedIcon} />
              <FilterSection title="Job Type" options={jobTypes} selected={selectedJobTypes} onChange={(value) => handleFilterChange("jobType", value)} icon={BusinessCenterOutlinedIcon} />
              <FilterSection title="Salary Range" options={salaryRanges} selected={selectedSalaries} onChange={(value) => handleFilterChange("salary", value)} icon={PaidOutlinedIcon} />

              <div className="py-3">
                <p className="text-sm font-medium text-slate-700">{filteredJobs.length} jobs found</p>
              </div>
            </div>
          </aside>

          <section>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Showing {filteredJobs.length ? startIndex + 1 : 0}-
                {Math.min(activePage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} results
              </p>
              <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:inline-flex">
                {selectedCategory === "all" ? "All Categories" : getJobCategoryLabel(selectedCategory)}
              </span>
            </div>

            {loading ? (
              <div className="mt-4 flex items-center justify-center rounded-lg border border-slate-200 bg-white py-16 text-sm text-slate-500">
                Loading jobs...
              </div>
            ) : currentJobs.length > 0 ? (
              <>
                <div className="mt-4 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {currentJobs.map((job) => (
                    <JobCard key={job.id} job={job} onSave={() => {}} onCardClick={(jobId) => router.push(`/jobs/${jobId}`)} />
                  ))}
                </div>

                {totalPages > 1 && <Pagination currentPage={activePage} totalPages={totalPages} onPageChange={handlePageChange} />}
              </>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-16">
                <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
                <p className="mt-1 text-sm text-slate-500">{error || "Try adjusting your filters or search terms."}</p>
                <button onClick={clearAllFilters} className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer">
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        .job-sidebar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .job-sidebar::-webkit-scrollbar {
          display: none;
        }

        .job-sidebar-body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .job-sidebar-body::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </main>
  );
}
