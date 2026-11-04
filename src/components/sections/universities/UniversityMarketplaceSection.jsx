import { useMemo, useState } from "react";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PortalHero from "@/components/common/PortalHero";
import UniversityCard from "./UniversityCard";
import {
  universities,
  universityCountries,
  universityCourses,
  universityTypes,
} from "./universityData";

const universitiesPerPage = 9;

export default function UniversityMarketplaceSection() {
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxTuition, setMaxTuition] = useState(35000);
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.max(1, Math.ceil(filteredUniversities.length / universitiesPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const totalResults = filteredUniversities.length;
  const paginatedUniversities = useMemo(() => {
    const startIndex = (activePage - 1) * universitiesPerPage;

    return filteredUniversities.slice(startIndex, startIndex + universitiesPerPage);
  }, [activePage, filteredUniversities]);
  const visiblePageNumbers = useMemo(() => {
    const pageSet = new Set([1, totalPages]);
    const start = Math.max(1, activePage - 2);
    const end = Math.min(totalPages, activePage + 2);

    for (let page = start; page <= end; page += 1) {
      pageSet.add(page);
    }

    return [...pageSet].sort((a, b) => a - b);
  }, [activePage, totalPages]);

  const toggleExpanded = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleValue = (value, setter) => {
    setCurrentPage(1);
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCountries([]);
    setSelectedCourses([]);
    setSelectedTypes([]);
    setMaxTuition(35000);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-10 pt-[88px]">
      <PortalHero heading="Find Your Next University" label="University Marketplace" imageSrc="/images/page-banners/full-width/services.webp" />
      <section className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-8">

        <p className="mt-5 text-sm leading-7 text-slate-600">Browse university profiles and compare countries, courses, university types and yearly tuition.</p>
        <div className="mt-6 grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Filter</h2>
              <button type="button" onClick={resetFilters} className="text-sm font-semibold text-blue-700">
                Reset
              </button>
            </div>

            <div className="scrollbar-none min-h-0 flex-1 divide-y divide-slate-200 overflow-y-auto pr-1">
              <div className="py-4">
                <button type="button" onClick={() => toggleExpanded("search")} className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800">
                  Search
                  {expanded.search ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
                </button>
                {expanded.search && (
                  <div className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3">
                    <input
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(1);
                      }}
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
                      onChange={(event) => {
                        setMaxTuition(Number(event.target.value));
                        setCurrentPage(1);
                      }}
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
                {totalResults > 0
                  ? `Showing ${Math.min((activePage - 1) * universitiesPerPage + 1, totalResults)}-${Math.min(activePage * universitiesPerPage, totalResults)} of ${totalResults} universities`
                  : `Showing 0 of ${universities.length} universities`}
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedUniversities.map((university) => (
                <UniversityCard key={university.slug} university={university} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={activePage === 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {visiblePageNumbers.map((pageNumber, index) => (
                  <div key={pageNumber} className="flex items-center gap-2">
                    {index > 0 && pageNumber - visiblePageNumbers[index - 1] > 1 && (
                      <span className="px-1 text-sm font-semibold text-slate-400">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                        pageNumber === activePage
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={activePage === totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

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
