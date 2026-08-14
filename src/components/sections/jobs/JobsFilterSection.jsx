"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Job data
const jobCards = [
  {
    id: 1,
    title: "Software Engineer II",
    company: "Microsoft",
    location: "Hyderabad, India",
    type: "Full Time",
    salary: "INR 8 - 30 LPA",
    tags: ["3-5 Years", "Software Development"],
    logo: "MS",
    logoClass: "bg-[#F3F7FF] text-[#2563EB]",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    category: "it",
    rating: 4.5,
    reviews: 234,
    posted: "2 days ago",
    isSaved: false,
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Tata Consultancy Services",
    location: "Chennai, India",
    type: "Full Time",
    salary: "INR 6 - 12 LPA",
    tags: ["1-3 Years", "React JS"],
    logo: "TCS",
    logoClass: "bg-white text-[#F43F5E]",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    category: "it",
    rating: 4.2,
    reviews: 189,
    posted: "5 days ago",
    isSaved: false,
  },
  {
    id: 3,
    title: "Mechanical Design Engineer",
    company: "Larsen & Toubro",
    location: "Mumbai, India",
    type: "Full Time",
    salary: "INR 9 - 16 LPA",
    tags: ["3-6 Years", "CAD / SolidWorks"],
    logo: "L&T",
    logoClass: "bg-[#111827] text-white",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    category: "eng",
    rating: 4.7,
    reviews: 156,
    posted: "1 week ago",
    isSaved: false,
  },
  {
    id: 4,
    title: "Civil Site Engineer",
    company: "Tata Projects",
    location: "Ahmedabad, India",
    type: "Full Time",
    salary: "INR 6 - 11 LPA",
    tags: ["2-5 Years", "Site Execution"],
    logo: "TP",
    logoClass: "bg-white text-[#0F766E]",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    category: "eng",
    rating: 4.3,
    reviews: 98,
    posted: "3 days ago",
    isSaved: false,
  },
  {
    id: 5,
    title: "Registered Nurse",
    company: "Apollo Hospitals",
    location: "Chennai, India",
    type: "Full Time",
    salary: "INR 4 - 8 LPA",
    tags: ["1-4 Years", "Patient Care"],
    logo: "A",
    logoClass: "bg-white text-[#DC2626]",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
    category: "health",
    rating: 4.6,
    reviews: 210,
    posted: "4 days ago",
    isSaved: false,
  },
  {
    id: 6,
    title: "Physiotherapist",
    company: "Fortis Healthcare",
    location: "Delhi NCR, India",
    type: "Full Time",
    salary: "INR 5 - 9 LPA",
    tags: ["2-5 Years", "Rehabilitation"],
    logo: "F",
    logoClass: "bg-[#ECFDF5] text-[#059669]",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    category: "health",
    rating: 4.8,
    reviews: 167,
    posted: "6 days ago",
    isSaved: false,
  },
  {
    id: 7,
    title: "Digital Marketing Manager",
    company: "Ogilvy",
    location: "Mumbai, India",
    type: "Full Time",
    salary: "INR 10 - 18 LPA",
    tags: ["4-7 Years", "Performance Marketing"],
    logo: "O",
    logoClass: "bg-[#111827] text-white",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    category: "marketing",
    rating: 4.4,
    reviews: 145,
    posted: "2 days ago",
    isSaved: false,
  },
  {
    id: 8,
    title: "Brand Strategist",
    company: "Publicis",
    location: "Bangalore, India",
    type: "Full Time",
    salary: "INR 8 - 14 LPA",
    tags: ["3-6 Years", "Brand Strategy"],
    logo: "P",
    logoClass: "bg-white text-[#DB2777]",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    category: "marketing",
    rating: 4.1,
    reviews: 89,
    posted: "1 day ago",
    isSaved: false,
  },
  {
    id: 9,
    title: "Business Consultant",
    company: "Deloitte",
    location: "Gurgaon, India",
    type: "Full Time",
    salary: "INR 12 - 22 LPA",
    tags: ["3-5 Years", "Consulting"],
    logo: "D",
    logoClass: "bg-[#111827] text-white",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    category: "finance",
    rating: 4.9,
    reviews: 310,
    posted: "3 days ago",
    isSaved: false,
  },
  {
    id: 10,
    title: "Financial Analyst",
    company: "EY",
    location: "Gurgaon, India",
    type: "Full Time",
    salary: "INR 7 - 13 LPA",
    tags: ["2-4 Years", "Financial Modeling"],
    logo: "EY",
    logoClass: "bg-[#FFF7ED] text-[#C2410C]",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
    category: "finance",
    rating: 4.3,
    reviews: 176,
    posted: "5 days ago",
    isSaved: false,
  },
];

// Filter options
const experienceLevels = [
  { id: "entry", label: "Entry Level (0-2 years)" },
  { id: "mid", label: "Mid Level (3-5 years)" },
  { id: "senior", label: "Senior Level (5+ years)" },
];

const jobTypes = [
  { id: "fulltime", label: "Full Time" },
  { id: "parttime", label: "Part Time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
];

const salaryRanges = [
  { id: "0-5", label: "₹0 - ₹5 LPA" },
  { id: "5-10", label: "₹5 - ₹10 LPA" },
  { id: "10-20", label: "₹10 - ₹20 LPA" },
  { id: "20+", label: "₹20+ LPA" },
];

// Individual Job Card Component
function JobCard({ job, onSave, onCardClick }) {
  const [isSaved, setIsSaved] = useState(job.isSaved);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) onSave(job.id);
  };

  return (
    <div 
      onClick={() => onCardClick(job.id)}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
    >
      <div className="relative h-28 w-full">
        <img src={job.image} alt={job.title} className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label={`Save ${job.title}`}
          onClick={handleSave}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-white cursor-pointer"
        >
          {isSaved ? (
            <FavoriteRoundedIcon sx={{ fontSize: 14, color: "#EF4444" }} />
          ) : (
            <FavoriteBorderRoundedIcon sx={{ fontSize: 14, color: "#6B7280" }} />
          )}
        </button>
        <span
          className={`absolute -bottom-3 left-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-100 text-xs font-bold shadow-sm ${job.logoClass}`}
        >
          {job.logo}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <div className="flex items-center gap-0.5 text-xs font-medium text-slate-600 shrink-0">
            <StarIcon sx={{ fontSize: 13, color: "#F59E0B" }} />
            {job.rating}
          </div>
        </div>
        
        <p className="mt-0.5 text-xs font-medium text-slate-600">{job.company}</p>

        <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-0.5">
            <LocationOnOutlinedIcon sx={{ fontSize: 12 }} />
            {job.location}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
          <span>{job.type}</span>
        </div>

        <p className="mt-1 text-sm font-semibold text-blue-700">{job.salary}</p>

        <div className="mt-1.5 flex flex-wrap gap-1">
          {job.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400">
          <span>Posted {job.posted}</span>
          <span className="inline-flex items-center gap-0.5">
            <CheckCircleIcon sx={{ fontSize: 10 }} />
            Active
          </span>
        </div>

        <Link 
          href={`/jobs/${job.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-1.5 inline-flex items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:scale-105"
        >
          Apply Now
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 10 }} />
        </Link>
      </div>
    </div>
  );
}

// Filter Section Component
function FilterSection({ title, options, selected, onChange, icon: Icon }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-slate-100 py-3.5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon sx={{ fontSize: 18 }} />}
          {title}
        </span>
        {isExpanded ? (
          <ExpandLessIcon sx={{ fontSize: 18 }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 18 }} />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2.5 space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-blue-700 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => onChange(option.id)}
                className="hidden"
              />
              <span className="flex h-4 w-4 items-center justify-center rounded border border-slate-300 group-hover:border-blue-400 transition-colors">
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

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-all hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <KeyboardArrowLeftIcon sx={{ fontSize: 20 }} />
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all cursor-pointer ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
              : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50"
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-all hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
      </button>
    </div>
  );
}

// Main Job Search Page Component
export default function JobSearchPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState(jobCards);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaries, setSelectedSalaries] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Get unique categories from jobs
  const categories = ["all", ...new Set(jobs.map(job => job.category))];

  // Handle card click - redirect to job detail page
  const handleCardClick = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  // Handle save job
  const handleSaveJob = (jobId) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;

    const matchesExperience = selectedExperience.length === 0 || 
      selectedExperience.some(exp => {
        if (exp === "entry") return job.tags.some(tag => tag.includes("0-2") || tag.includes("1-3"));
        if (exp === "mid") return job.tags.some(tag => tag.includes("3-5") || tag.includes("3-6"));
        if (exp === "senior") return job.tags.some(tag => tag.includes("5+") || tag.includes("4-7"));
        return false;
      });

    const matchesJobType = selectedJobTypes.length === 0 || 
      selectedJobTypes.some(type => 
        job.type.toLowerCase().includes(type.toLowerCase())
      );

    const matchesSalary = selectedSalaries.length === 0 || 
      selectedSalaries.some(salary => {
        const salaryMatch = job.salary.match(/\d+/);
        if (!salaryMatch) return false;
        const jobSalary = parseInt(salaryMatch[0]);
        if (salary === "0-5") return jobSalary <= 5;
        if (salary === "5-10") return jobSalary > 5 && jobSalary <= 10;
        if (salary === "10-20") return jobSalary > 10 && jobSalary <= 20;
        if (salary === "20+") return jobSalary > 20;
        return false;
      });

    return matchesSearch && matchesCategory && matchesExperience && 
           matchesJobType && matchesSalary;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedExperience, selectedJobTypes, selectedSalaries]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    switch(type) {
      case 'experience':
        setSelectedExperience(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'jobType':
        setSelectedJobTypes(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'salary':
        setSelectedSalaries(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedExperience([]);
    setSelectedJobTypes([]);
    setSelectedSalaries([]);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-[#f3f6ff] pt-20 pb-10">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-5">
        <div className="flex gap-3">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6 rounded-lg border border-slate-200 bg-white max-h-[calc(100vh-20px)] flex flex-col overflow-hidden">
              {/* Search Bar in Sidebar */}
              <div className="p-4 border-b border-slate-200 shrink-0">
                <div className="relative">
                  <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 18 }} />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Scrollable Filter Section - Hide scrollbar */}
              <div className="flex-1 overflow-y-auto p-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <FilterSection
                  title="Experience Level"
                  options={experienceLevels}
                  selected={selectedExperience}
                  onChange={(value) => handleFilterChange('experience', value)}
                  icon={WorkHistoryOutlinedIcon}
                />
                <FilterSection
                  title="Job Type"
                  options={jobTypes}
                  selected={selectedJobTypes}
                  onChange={(value) => handleFilterChange('jobType', value)}
                  icon={BusinessCenterOutlinedIcon}
                />
                <FilterSection
                  title="Salary Range"
                  options={salaryRanges}
                  selected={selectedSalaries}
                  onChange={(value) => handleFilterChange('salary', value)}
                  icon={PaidOutlinedIcon}
                />

                <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-700">
                    {filteredJobs.length} jobs found
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="flex-1 min-w-0">
            {/* Category Tabs - Top of section */}
            <div className="mb-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    selectedCategory === category
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm hover:shadow hover:scale-105"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm hover:scale-105"
                  }`}
                >
                  {category === "all" ? "All Jobs" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile Search and Filter */}
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="flex-1 relative">
                <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 16 }} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:shadow-sm transition-all"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
                Filters
                {(selectedExperience.length > 0 || selectedJobTypes.length > 0 || selectedSalaries.length > 0) && (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[8px] font-bold text-white">
                    {selectedExperience.length + selectedJobTypes.length + selectedSalaries.length}
                  </span>
                )}
              </button>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{currentJobs.length}</span> of <span className="font-semibold text-slate-900">{filteredJobs.length}</span> jobs
              </p>
            </div>

            {/* Job Cards Grid - 3 columns */}
            {currentJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {currentJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSave={handleSaveJob}
                      onCardClick={handleCardClick}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[80%] bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
              <h3 className="text-base font-semibold text-slate-900">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 16 }} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all"
                />
              </div>
              <FilterSection
                title="Experience Level"
                options={experienceLevels}
                selected={selectedExperience}
                onChange={(value) => handleFilterChange('experience', value)}
                icon={WorkHistoryOutlinedIcon}
              />
              <FilterSection
                title="Job Type"
                options={jobTypes}
                selected={selectedJobTypes}
                onChange={(value) => handleFilterChange('jobType', value)}
                icon={BusinessCenterOutlinedIcon}
              />
              <FilterSection
                title="Salary Range"
                options={salaryRanges}
                selected={selectedSalaries}
                onChange={(value) => handleFilterChange('salary', value)}
                icon={PaidOutlinedIcon}
              />
              <button
                onClick={clearAllFilters}
                className="mt-4 w-full rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}