import { useMemo, useState } from "react";
import Image from "next/image";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import universityMarketplaceBanner from "@/images/university-marketplace-banner.png";
import UniversityCard from "./UniversityCard";
import {
  universities,
  universityCountries,
  universityCourses,
  universityTypes,
} from "./universityData";

export default function UniversityMarketplaceSection() {
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxTuition, setMaxTuition] = useState(35000);
  const [expanded, setExpanded] = useState({
    search: true,
    country: true,
    course: true,
    type: false,
    tuition: true,
  });

  const filteredUniversities = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return universities.filter((university) => {
      const matchesSearch = !keyword || [
        university.name,
        university.city,
        university.country,
        university.course,
      ].some((value) => value.toLowerCase().includes(keyword));
      const matchesCountry = !selectedCountries.length || selectedCountries.includes(university.country);
      const matchesCourse = !selectedCourses.length || selectedCourses.includes(university.course);
      const matchesType = !selectedTypes.length || selectedTypes.includes(university.type);
      const matchesTuition = university.tuition <= maxTuition;

      return matchesSearch && matchesCountry && matchesCourse && matchesType && matchesTuition;
    });
  }, [maxTuition, search, selectedCountries, selectedCourses, selectedTypes]);

  const toggleExpanded = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleValue = (value, setter) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCountries([]);
    setSelectedCourses([]);
    setSelectedTypes([]);
    setMaxTuition(35000);
  };

  return (
    <main className="min-h-screen bg-[#f6f8ff] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="relative isolate min-h-[270px] overflow-hidden rounded-2xl px-5 py-10 text-white sm:min-h-[340px] sm:px-8 lg:px-10">
          <Image
            src={universityMarketplaceBanner}
            alt="Students walking across a modern university campus"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/78 via-slate-950/45 to-slate-950/10" />
          <div className="flex min-h-[190px] max-w-2xl flex-col justify-center sm:min-h-[260px]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">University Marketplace</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Find Your Next University</h1>
            <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base">
              Browse dummy university profiles with filters for country, course, university type, and yearly tuition.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside className="sticky top-24 h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Filter</h2>
              <button type="button" onClick={resetFilters} className="text-sm font-semibold text-blue-700">
                Reset
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              <div className="py-4">
                <button type="button" onClick={() => toggleExpanded("search")} className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800">
                  Search
                  {expanded.search ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
                </button>
                {expanded.search && (
                  <div className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3">
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="University, city, course"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                    <SearchRoundedIcon className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>

              <FilterGroup
                title="Country"
                values={universityCountries}
                selectedValues={selectedCountries}
                expanded={expanded.country}
                onToggleExpanded={() => toggleExpanded("country")}
                onToggleValue={(value) => toggleValue(value, setSelectedCountries)}
              />

              <FilterGroup
                title="Course"
                values={universityCourses}
                selectedValues={selectedCourses}
                expanded={expanded.course}
                onToggleExpanded={() => toggleExpanded("course")}
                onToggleValue={(value) => toggleValue(value, setSelectedCourses)}
              />

              <FilterGroup
                title="University Type"
                values={universityTypes}
                selectedValues={selectedTypes}
                expanded={expanded.type}
                onToggleExpanded={() => toggleExpanded("type")}
                onToggleValue={(value) => toggleValue(value, setSelectedTypes)}
              />

              <div className="py-4">
                <button type="button" onClick={() => toggleExpanded("tuition")} className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800">
                  Yearly Tuition
                  {expanded.tuition ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
                </button>
                {expanded.tuition && (
                  <div className="mt-3">
                    <input
                      type="range"
                      min="15000"
                      max="35000"
                      step="500"
                      value={maxTuition}
                      onChange={(event) => setMaxTuition(Number(event.target.value))}
                      className="w-full accent-blue-700"
                    />
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>15k</span>
                      <span>Up to {maxTuition.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">
                Showing {filteredUniversities.length} of {universities.length} universities
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredUniversities.map((university) => (
                <UniversityCard key={university.slug} university={university} />
              ))}
            </div>

            {!filteredUniversities.length && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-lg font-semibold text-slate-900">No universities found</p>
                <p className="mt-2 text-sm text-slate-500">Try clearing filters or increasing the tuition range.</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({ title, values, selectedValues, expanded, onToggleExpanded, onToggleValue }) {
  return (
    <div className="py-4">
      <button type="button" onClick={onToggleExpanded} className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800">
        {title}
        {expanded ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {values.map((value) => (
            <label key={value} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selectedValues.includes(value)}
                onChange={() => onToggleValue(value)}
                className="h-4 w-4 rounded border-slate-300"
              />
              {value}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
