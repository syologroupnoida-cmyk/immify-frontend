import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { fetchServiceListings, serviceListingFallbackImage } from "@/util/serviceListings";
import { marketplaceTabs } from "../home/homeData";

const pageSize = 8;
const categoryLabels = {
  "test-prepation": "Test Preparation",
  "document-attention-services": "Document Attestation Services",
  "helth-insurance": "Health Insurance",
  "legal-and-complance": "Legal and Compliance",
};
const serviceTypes = marketplaceTabs.map(({ slug, name }) => ({ slug, name: categoryLabels[slug] || name }));

function getServiceType(item) {
  const name = item.categoryName.toLowerCase();
  if (/business setup|corporate immigration/.test(name)) return "business-setup-services-and-immigration";
  if (/family relocation/.test(name)) return "family-relocation-services";
  if (/study abroad|overseas education/.test(name)) return "study-abroad-services";
  if (/test prep|language training/.test(name)) return "test-prepation";
  if (/document|attestation/.test(name)) return "document-attention-services";
  if (/health|helth|insurance/.test(name)) return "helth-insurance";
  if (/legal|complian/.test(name)) return "legal-and-complance";
  if (/financial|finance/.test(name)) return "financial-services";
  if (/forex|foreign exchange/.test(name)) return "forex-services";
  if (/international|global mobility/.test(name)) return "international-services";
  if (/immigration/.test(name)) return "immigration-services";
  if (/visa/.test(name)) return "visa-services";
  return serviceTypes.find((type) => type.slug === item.categorySlug)?.slug || "";
}

export default function MarketplaceMainSection() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(null);
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef(null);
  const [resultsHeight, setResultsHeight] = useState(null);

  useEffect(() => {
    let active = true;
    fetchServiceListings()
      .then((items) => { if (active) setListings(items); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const element = resultsRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setResultsHeight(entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const categoryKey = selectedTypes === null
    ? (typeof router.query.category === "string" ? router.query.category : "")
    : selectedTypes.join("|");
  const selectedCategories = useMemo(() => categoryKey ? categoryKey.split("|") : [], [categoryKey]);
  const typeCounts = useMemo(() => listings.reduce((counts, item) => {
    const type = getServiceType(item);
    if (type) counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {}), [listings]);
  const toggleType = (slug) => {
    setSelectedTypes(selectedCategories.includes(slug) ? selectedCategories.filter((type) => type !== slug) : [...selectedCategories, slug]);
    setPage(1);
  };
  const filtered = useMemo(() => listings.filter((item) => {
    const query = search.trim().toLowerCase();
    return (!query || `${item.service} ${item.categoryName} ${item.description}`.toLowerCase().includes(query))
      && (!selectedCategories.length || selectedCategories.includes(getServiceType(item)))
      && (!location || item.city.toLowerCase().includes(location.trim().toLowerCase()))
      && (!maxPrice || item.priceValue <= Number(maxPrice));
  }), [listings, search, selectedCategories, location, maxPrice]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visible = filtered.slice((activePage - 1) * pageSize, activePage * pageSize);

  const reset = () => { setSearch(""); setSelectedTypes([]); setLocation(""); setMaxPrice(""); setPage(1); };

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-12 pt-6 sm:pt-8">
      <section className="relative flex min-h-[230px] items-center justify-center overflow-hidden bg-slate-900 px-4 text-center">
        <img src="/images/marketplace-banner.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="relative">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Service Marketplace</h1>
          <p className="mt-3 text-sm text-white/90 sm:text-base">Explore services from our providers.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside style={{ "--results-height": resultsHeight ? `${resultsHeight}px` : "auto" }} className="border-b border-slate-200 pb-6 lg:h-[var(--results-height)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:pr-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Filters</h2>
            <button type="button" onClick={reset} className="text-sm font-medium text-blue-700">Reset</button>
          </div>
          <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="service-search">Search</label>
          <div className="mt-2 flex items-center rounded-md border border-slate-300 bg-white px-3">
            <input id="service-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search services" className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none" />
            <SearchRoundedIcon className="h-4 w-4 text-slate-400" />
          </div>
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-slate-800">Service types</legend>
            <div className="mt-2 space-y-1">
              {serviceTypes.map((type) => (
                <label key={type.slug} className="flex cursor-pointer items-start justify-between gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-white">
                  <span className="flex min-w-0 items-start gap-2">
                    <input type="checkbox" checked={selectedCategories.includes(type.slug)} onChange={() => toggleType(type.slug)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-700" />
                    <span>{type.name}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-500">{typeCounts[type.slug] || 0}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="service-location">Location</label>
          <input id="service-location" value={location} onChange={(event) => { setLocation(event.target.value); setPage(1); }} placeholder="City or country" className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" />
          <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="service-price">Maximum price</label>
          <input id="service-price" type="number" min="0" value={maxPrice} onChange={(event) => { setMaxPrice(event.target.value); setPage(1); }} placeholder="Any price" className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm" />
        </aside>

        <section ref={resultsRef} aria-label="Service listings" className="min-w-0 min-h-[480px] self-start">
          <p className="mb-4 text-sm text-slate-600">{loading ? "Loading services..." : `Showing ${filtered.length ? (activePage - 1) * pageSize + 1 : 0}-${Math.min(activePage * pageSize, filtered.length)} of ${filtered.length} services`}</p>
          {error && <p className="py-10 text-center text-sm text-red-700">Services could not be loaded. Please try again later.</p>}
          {!loading && !error && !visible.length && <p className="py-10 text-center text-sm text-slate-600">No services match your filters.</p>}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <Link key={item.id} href={`/marketplace/${item.detailSlug}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md">
                <div className="aspect-[16/10] bg-slate-100"><img src={item.image} alt="" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} /></div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-blue-700">{item.categoryName}</p>
                  <h3 className="mt-2 line-clamp-2 min-h-12 font-semibold text-slate-900">{item.service}</h3>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-600">{item.description || "Explore this service and its details."}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm"><span className="text-slate-500">{item.city}</span><strong className="text-blue-700">{item.priceLabel}</strong></div>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && <nav aria-label="Service pages" className="mt-8 flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={number === activePage ? "page" : undefined} className={`h-9 min-w-9 rounded-md px-2 text-sm font-semibold ${number === activePage ? "bg-blue-700 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>{number}</button>)}
          </nav>}
        </section>
      </div>
    </main>
  );
}
