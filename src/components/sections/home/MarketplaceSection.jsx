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
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Top Selling Services</h2>
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
          <div className="scrollbar-none mt-7 flex snap-x snap-mandatory justify-start gap-4 overflow-x-auto pb-3 pl-1 pr-1 scroll-smooth lg:justify-center">
            {visibleListings.map((item, index) => (
              <Link key={item.id} href={`/marketplace/${item.detailSlug}`}
                className={`group flex min-h-[270px] w-[min(82vw,260px)] min-w-[230px] snap-center flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 hover:ring-blue-100 sm:min-w-[245px] lg:min-w-[260px] ${index >= 4 ? "hidden lg:flex" : index >= 2 ? "hidden sm:flex" : ""}`}>
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <Image src={item.image || serviceListingFallbackImage} alt="" fill unoptimized sizes="(min-width: 1024px) 260px, 82vw" className="object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-slate-950/80 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                    {item.priceLabel}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <div>
                    <p className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">{item.categoryName}</p>
                    <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-950 group-hover:text-blue-700">{item.service}</h3>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-500">{item.city || "Online"}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-700">
                      Details
                      <ArrowForwardRoundedIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
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
