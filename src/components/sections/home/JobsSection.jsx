"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";

const jobFilters = [
  { id: "all", label: "All Jobs", icon: WorkHistoryOutlinedIcon },
  { id: "it", label: "IT & Software", icon: ComputerOutlinedIcon },
  { id: "eng", label: "Engineering", icon: SettingsOutlinedIcon },
  { id: "health", label: "Healthcare", icon: HealingOutlinedIcon },
  { id: "marketing", label: "Marketing", icon: CampaignOutlinedIcon },
  { id: "finance", label: "Finance", icon: PaidOutlinedIcon },
];

const jobCards = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

function JobCard({ job }) {
  return (
    <article className="flex h-full w-full shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
      <div className="relative h-28 w-full">
        <img src={job.image} alt="" className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label={`Save ${job.title}`}
          className="absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm cursor-pointer transition hover:bg-white hover:scale-110"
        >
          <FavoriteBorderRoundedIcon sx={{ fontSize: 14 }} />
        </button>
        <span
          className={`absolute -bottom-4 left-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 text-sm font-bold shadow-sm ${job.logoClass}`}
        >
          {job.logo}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 pt-6">
        <h3 className="text-sm font-semibold leading-tight text-slate-900">{job.title}</h3>
        <p className="mt-1 text-xs font-medium text-slate-600">{job.company}</p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-0.5">
            <LocationOnOutlinedIcon sx={{ fontSize: 13 }} />
            {job.location}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{job.type}</span>
        </div>

        <p className="mt-2 text-sm font-semibold text-blue-700">{job.salary}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <Link 
          href="#" 
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-semibold text-blue-700 transition hover:text-blue-800 hover:gap-2.5"
        >
          Apply Now
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 11 }} />
        </Link>
      </div>
    </article>
  );
}

export default function JobsSection() {
  const [activeFilter, setActiveFilter] = useState(jobFilters[0].id);
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoSlideInterval = useRef(null);

  const visibleJobs =
    activeFilter === "all" ? jobCards : jobCards.filter((job) => job.category === activeFilter);

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    setCurrentIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track || visibleJobs.length === 0) return;
    
    const firstCard = track.firstElementChild;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 16 : track.clientWidth / 4;
    const newIndex = Math.max(0, Math.min(visibleJobs.length - 1, currentIndex + direction));
    
    setCurrentIndex(newIndex);
    track.scrollTo({ left: newIndex * cardWidth, behavior: "smooth" });
  };

  // Auto-slide functionality
  useEffect(() => {
    // Only auto-slide if there are more than 4 cards
    if (visibleJobs.length <= 4) {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
        autoSlideInterval.current = null;
      }
      return;
    }

    if (isHovered) {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
        autoSlideInterval.current = null;
      }
      return;
    }

    autoSlideInterval.current = setInterval(() => {
      if (trackRef.current && visibleJobs.length > 0) {
        const firstCard = trackRef.current.firstElementChild;
        const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 16 : 0;
        const maxScroll = (visibleJobs.length - 4) * cardWidth;
        const currentScroll = trackRef.current.scrollLeft;
        
        if (currentScroll >= maxScroll - 10) {
          // Reset to start
          trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
          setCurrentIndex(0);
        } else {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          trackRef.current.scrollTo({ left: newIndex * cardWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
        autoSlideInterval.current = null;
      }
    };
  }, [visibleJobs, isHovered, currentIndex]);

  // Check if we should show navigation buttons
  const showNavigation = visibleJobs.length > 4;

  return (
    <section className="w-full bg-[#f3f6ff] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            <BusinessCenterOutlinedIcon sx={{ fontSize: 14 }} />
            Jobs
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Latest International Job Opportunities</h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm">
            Explore exciting career opportunities and take the next step in your professional journey.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {jobFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = filter.id === activeFilter;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleFilterClick(filter.id)}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:scale-105"
                }`}
              >
                <Icon sx={{ fontSize: 14 }} />
                {filter.label}
              </button>
            );
          })}
        </div>

        <div 
          className="mt-8 flex items-center gap-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {showNavigation && (
            <button
              type="button"
              aria-label="Previous jobs"
              onClick={() => scrollByCard(-1)}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-blue-300 hover:text-blue-700 hover:shadow-md hover:scale-110 cursor-pointer lg:inline-flex"
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
            </button>
          )}

          {visibleJobs.length > 0 ? (
            <div
              ref={trackRef}
              className={`flex flex-1 gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                !showNavigation ? 'justify-center' : ''
              }`}
            >
              {visibleJobs.map((job) => (
                <JobCard key={`${job.title}-${job.company}`} job={job} />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center py-10 text-sm text-slate-500">
              No jobs found in this category right now.
            </div>
          )}

          {showNavigation && (
            <button
              type="button"
              aria-label="Next jobs"
              onClick={() => scrollByCard(1)}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-blue-300 hover:text-blue-700 hover:shadow-md hover:scale-110 cursor-pointer lg:inline-flex"
            >
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
            </button>
          )}
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 px-5 py-2.5 text-xs font-semibold text-blue-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:scale-105 cursor-pointer"
          >
            View All Jobs
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />
          </Link>
        </div>
      </div>
    </section>
  );
}