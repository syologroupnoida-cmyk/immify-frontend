import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import { fetchServiceListings, SERVICE_FILTER_EVENT, serviceListingCategories, serviceListingFallbackImage } from "@/util/serviceListings";

export default function MarketplaceSection() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [activeCategory, setActiveCategory] = useState(serviceListingCategories[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return undefined;
    const requestedCategory = typeof router.query.serviceCategory === "string" ? router.query.serviceCategory : "";
    const requestedSearch = typeof router.query.serviceSearch === "string" ? router.query.serviceSearch : "";
    queueMicrotask(() => {
      if (serviceListingCategories.includes(requestedCategory)) setActiveCategory(requestedCategory);
      setSearch(requestedSearch);
    });
    return undefined;
  }, [router.isReady, router.query.serviceCategory, router.query.serviceSearch]);

  useEffect(() => {
    const handleHeaderFilter = (event) => {
      if (serviceListingCategories.includes(event.detail?.category)) setActiveCategory(event.detail.category);
      setSearch(event.detail?.search || "");
    };
    window.addEventListener(SERVICE_FILTER_EVENT, handleHeaderFilter);
    return () => window.removeEventListener(SERVICE_FILTER_EVENT, handleHeaderFilter);
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) setLoading(true); });
    fetchServiceListings({ categoryName: activeCategory })
      .then((items) => { if (active) setListings(items); })
      .catch(() => { if (active) setListings([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [activeCategory]);

  const visibleListings = useMemo(() => listings
    .filter((item) => !search.trim() || `${item.service} ${item.categoryName} ${item.description}`.toLowerCase().includes(search.trim().toLowerCase()))
    .slice(0, 8), [listings, search]);

  return (
    <section id="marketplace" className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            <BusinessCenterOutlinedIcon className="h-5 w-5" /> Services
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Top Selling Services</h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">Explore available services from our providers.</p>
        </div>

        <div className="scrollbar-none mt-7 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
            {serviceListingCategories.map((category) => (
              <button key={category} type="button" onClick={() => { setActiveCategory(category); setSearch(""); }}
                className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition ${activeCategory === category ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                {category}
              </button>
            ))}
        </div>

        {loading ? <p className="py-12 text-center text-sm text-slate-500">Loading services...</p> : visibleListings.length ? (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleListings.map((item, index) => (
              <Link key={item.id} href={`/marketplace/${item.detailSlug}`}
                className={`group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md ${index >= 4 ? "hidden lg:block" : index >= 2 ? "hidden sm:block" : ""}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image src={item.image} alt="" fill unoptimized sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition group-hover:scale-105"
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-blue-700">{item.categoryName}</p>
                  <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold text-slate-900">{item.service}</h3>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-600">{item.description || "Explore this service and its details."}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="font-semibold text-slate-900">{item.priceLabel}</span>
                    <ArrowForwardRoundedIcon className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : <p className="py-12 text-center text-sm text-slate-500">No {activeCategory.toLowerCase()} are available right now.</p>}

        <div className="mt-8 flex justify-center">
          <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            View All Services <ArrowForwardRoundedIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
