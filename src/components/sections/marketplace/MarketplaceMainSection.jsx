import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  buildMarketplaceListings,
  marketplaceServiceAliasMap,
  structuredMarketplaceTabs,
} from "./marketplaceData";

function ListingCard({ item }) {
  return (
    <Link
      href={`/marketplace/${item.detailSlug}`}
      className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img src={item.image} alt={item.service} className="h-full w-full object-cover" />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${item.badgeClass}`}>
          {item.badgeLabel}
        </span>
        <button
          type="button"
          aria-label={`Favorite ${item.service}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
        >
          <FavoriteBorderRoundedIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-sky-700">{item.categoryLabel}</p>
        <h3 className="line-clamp-1 text-lg font-semibold leading-tight text-slate-900">{item.service}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          Verified support and transparent process guidance for {item.categoryName.toLowerCase()}.
        </p>

        <div className="flex items-end justify-between gap-2 pt-2">
          <p className="text-lg font-semibold leading-none text-blue-600">{item.priceLabel}</p>
          <p className="flex items-center gap-1 text-sm font-semibold text-amber-500">
            <StarRoundedIcon className="h-4 w-4" />
            {item.rating}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <LocationOnOutlinedIcon className="h-3.5 w-3.5" />
            {item.city}
          </span>
          <span>({item.votes})</span>
        </div>
      </div>
    </Link>
  );
}

export default function MarketplaceMainSection() {
  const router = useRouter();
  const structuredTabs = useMemo(() => structuredMarketplaceTabs, []);
  const listings = useMemo(() => buildMarketplaceListings(structuredTabs), [structuredTabs]);
  const itemsPerPage = 8;

  const [searchKeywords, setSearchKeywords] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [expandedServiceCategories, setExpandedServiceCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [expandedFilters, setExpandedFilters] = useState({
    search: false,
    categories: true,
    location: false,
    price: false,
  });

  const visibleServiceTabs = useMemo(() => {
    if (!selectedCategories.length) {
      return structuredTabs;
    }

    return structuredTabs.filter((tab) => selectedCategories.includes(tab.slug));
  }, [selectedCategories, structuredTabs]);

  const allKnownServices = useMemo(
    () => new Set(structuredTabs.flatMap((tab) => tab.services)),
    [structuredTabs]
  );

  const visibleServicesSet = useMemo(
    () => new Set(visibleServiceTabs.flatMap((tab) => tab.services)),
    [visibleServiceTabs]
  );

  useEffect(() => {
    setExpandedServiceCategories(
      structuredTabs.reduce((acc, tab) => {
        acc[tab.slug] = false;
        return acc;
      }, {})
    );
  }, [structuredTabs]);

  useEffect(() => {
    if (!selectedCategories.length) return;

    setExpandedServiceCategories((prev) => {
      const next = { ...prev };

      structuredTabs.forEach((tab) => {
        next[tab.slug] = selectedCategories.includes(tab.slug);
      });

      return next;
    });
  }, [selectedCategories, structuredTabs]);

  useEffect(() => {
    if (!router.isReady) return;

    const queryCategory = typeof router.query.category === "string" ? router.query.category : "";
    const queryService = typeof router.query.service === "string" ? router.query.service : "";

    if (queryCategory && structuredTabs.some((tab) => tab.slug === queryCategory)) {
      setSelectedCategories([queryCategory]);
    }

    if (queryService) {
      const normalizedService = marketplaceServiceAliasMap[queryService.toLowerCase()] || queryService;

      if (allKnownServices.has(normalizedService)) {
        setSelectedServices([normalizedService]);
      } else {
        setSelectedServices([]);
      }
    }
  }, [router.isReady, router.query.category, router.query.service, structuredTabs, allKnownServices]);

  useEffect(() => {
    setSelectedServices((prev) => prev.filter((service) => visibleServicesSet.has(service)));
  }, [visibleServicesSet]);

  const categoryCounts = useMemo(() => {
    return structuredTabs.reduce((acc, tab) => {
      acc[tab.slug] = listings.filter((item) => item.categorySlug === tab.slug).length;
      return acc;
    }, {});
  }, [listings, structuredTabs]);

  const filteredListings = useMemo(() => {
    let next = [...listings];

    if (selectedCategories.length) {
      next = next.filter((item) => selectedCategories.includes(item.categorySlug));
    }

    if (selectedServices.length) {
      next = next.filter((item) => selectedServices.includes(item.service));
    }

    if (searchKeywords.trim()) {
      const keyword = searchKeywords.trim().toLowerCase();
      next = next.filter(
        (item) =>
          item.service.toLowerCase().includes(keyword) ||
          item.categoryName.toLowerCase().includes(keyword)
      );
    }

    if (locationFilter.trim()) {
      const loc = locationFilter.trim().toLowerCase();
      next = next.filter((item) => item.city.toLowerCase().includes(loc));
    }

    next = next.filter((item) => item.priceValue <= maxPrice);

    next.sort((a, b) => b.createdOrder - a.createdOrder);

    return next;
  }, [
    listings,
    locationFilter,
    maxPrice,
    searchKeywords,
    selectedCategories,
    selectedServices,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages));
  }, [totalPages]);

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredListings]);

  const totalResults = filteredListings.length;

  const toggleCategory = (slug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
    );
  };

  const toggleFilterGroup = (group) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const toggleServiceCategory = (slug) => {
    setExpandedServiceCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const clearFilters = () => {
    setSearchKeywords("");
    setLocationFilter("");
    setMaxPrice(50000);
    setSelectedCategories([]);
    setSelectedServices([]);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f6f8ff] px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <section className="relative -mx-4 mb-8 min-h-[260px] overflow-hidden sm:-mx-6 lg:-mx-8">
        <img
          src="/images/marketplace-banner.png"
          alt="Marketplace"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto flex min-h-[260px] max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Marketplace</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            Explore trusted services, products, and opportunities all in one place.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside
            className="market-sidebar sticky top-16 flex h-[calc(140vh-20px)] flex-col overflow-hidden rounded-2xl bg-white p-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-semibold text-slate-900">Filter</h2>
              <button type="button" onClick={clearFilters} className="cursor-pointer text-sm font-semibold text-blue-600">
                Reset All
              </button>
            </div>

            <div
              className="market-sidebar-body mt-3 min-h-0 flex-1 divide-y divide-slate-200 overflow-y-auto pr-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="py-2.5">
                <button
                  type="button"
                  onClick={() => toggleFilterGroup("price")}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800"
                >
                  Price Range
                  {expandedFilters.price ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
                </button>
                {expandedFilters.price && (
                  <div className="mt-3">
                    <input
                      type="range"
                      min="5000"
                      max="50000"
                      step="500"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(Number(event.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>INR 5,000</span>
                      <span>INR {maxPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="py-2.5">
                <button
                  type="button"
                  onClick={() => toggleFilterGroup("search")}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800"
                >
                  Search Keywords
                  {expandedFilters.search ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
                </button>
                {expandedFilters.search && (
                  <div className="mt-3 flex items-center rounded-xl border border-slate-200 px-3">
                    <input
                      id="searchKeywords"
                      type="text"
                      value={searchKeywords}
                      onChange={(event) => setSearchKeywords(event.target.value)}
                      placeholder="Search services, products..."
                      className="h-10 w-full bg-transparent text-sm outline-none"
                    />
                    <SearchRoundedIcon className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="py-2.5">
                <button
                  type="button"
                  onClick={() => toggleFilterGroup("categories")}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800"
                >
                  Categories
                  {expandedFilters.categories ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
                </button>
                {expandedFilters.categories && (
                  <div className="mt-3 space-y-2">
                    {structuredTabs.map((tab) => (
                      <label key={tab.slug} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50">
                        <span className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(tab.slug)}
                            onChange={() => toggleCategory(tab.slug)}
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          {tab.name}
                        </span>
                        <span className="text-xs text-slate-500">{categoryCounts[tab.slug] || 0}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="py-2.5">
                <p className="text-sm font-semibold text-slate-800">Category and Sub Category</p>
                <div className="mt-2.5 space-y-2.5 pr-1">
                  {visibleServiceTabs.map((tab, tabIndex) => (
                    <div key={tab.slug} className="rounded-lg border border-slate-100 px-2 py-2">
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory(tab.slug)}
                        className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800"
                      >
                        <span>{tabIndex + 1}. {tab.name}</span>
                        {expandedServiceCategories[tab.slug] ? (
                          <ExpandLessRoundedIcon className="h-5 w-5" />
                        ) : (
                          <ExpandMoreRoundedIcon className="h-5 w-5" />
                        )}
                      </button>

                      {expandedServiceCategories[tab.slug] && (
                        <div className="mt-2 space-y-2 pl-2">
                          {tab.services.map((service) => (
                            <label
                              key={`${tab.slug}-${service}`}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                            >
                              <input
                                type="checkbox"
                                checked={selectedServices.includes(service)}
                                onChange={() => toggleService(service)}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300"
                              />
                              <span>{service}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-2.5">
                <button
                  type="button"
                  onClick={() => toggleFilterGroup("location")}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800"
                >
                  Location
                  {expandedFilters.location ? <ExpandLessRoundedIcon className="h-5 w-5" /> : <ExpandMoreRoundedIcon className="h-5 w-5" />}
                </button>
                {expandedFilters.location && (
                  <input
                    id="locationFilter"
                    type="text"
                    value={locationFilter}
                    onChange={(event) => setLocationFilter(event.target.value)}
                    placeholder="Enter city or country"
                    className="mt-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                )}
              </div>

            </div>
          </aside>

          <section>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalResults)}-
                {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} results
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedListings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                      pageNumber === currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

          </section>
        </div>
      </div>

      <style jsx>{`
        .market-sidebar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .market-sidebar::-webkit-scrollbar {
          display: none;
        }

        .market-sidebar-body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .market-sidebar-body::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </main>
  );
}
