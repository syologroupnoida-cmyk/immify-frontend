import Link from "next/link";
import ScrollableFilterBar from "@/components/common/ScrollableFilterBar";
import { HomeCardImage, HomeCardSkeletons } from "./HomeLoading";
import { useEffect, useRef, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { vendorFallbackImage } from "@/util/vendors";
import { fetchDirectoryCategories, fetchDirectoryPage, shortVendorName } from "@/util/vendorDirectory";

export default function CategorySection({ marketplace = false }) {
  const sliderRef = useRef(null);
  const [activeCategoryId, setActiveCategoryId] = useState("All");
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [categoryRetry, setCategoryRetry] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorsFetchFailed, setVendorsFetchFailed] = useState(false);
  const [loadedCategoryId, setLoadedCategoryId] = useState(null);
  const isLoading = loading || loadedCategoryId !== activeCategoryId;

  const visibleVendorCards = vendors.slice(0, 8);

  useEffect(() => {
    let active = true;
    fetchDirectoryCategories().then((items) => { if (active) { setCategories(items); setCategoryError(false); } })
      .catch(() => { if (active) setCategoryError(true); });
    return () => { active = false; };
  }, [categoryRetry]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) setLoading(true);
    });
    fetchDirectoryPage({ take: 8, skip: 0, category: activeCategoryId === "All" ? "" : activeCategoryId })
      .then(({ items }) => {
        if (active) {
          setVendors(items);
          setVendorsFetchFailed(false);
        }
      })
      .catch(() => {
        if (active) {
          setVendors([]);
          setVendorsFetchFailed(true);
        }
      })
      .finally(() => {
        if (active) { setLoadedCategoryId(activeCategoryId); setLoading(false); }
      });

    return () => {
      active = false;
    };
  }, [activeCategoryId]);

  useEffect(() => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollTo({ left: 0, behavior: "auto" });
  }, [activeCategoryId]);

  return (
    <section id={marketplace ? "marketplace" : "vendors"} className="w-full bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">{marketplace ? 'Marketplace' : 'Explore vendors'}</p>
            <h2 className="mt-2 max-w-2xl text-xl font-bold text-slate-900 sm:text-2xl">
              {marketplace ? 'Discover Services from the Immify Marketplace' : 'Discover providers by service and city, then compare the available listing details.'}
            </h2>
          </div>
        </div>

        <ScrollableFilterBar label="Vendor service categories" tabList>
          {["All", ...categories].map((category) => {
            const isActive = activeCategoryId === category;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                onClick={() => setActiveCategoryId(category)}
                className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "border-blue-900 bg-blue-50 text-blue-900"
                    : "border-transparent text-slate-600 hover:bg-slate-100"
                }`}
                aria-selected={isActive}
              >
                {category}
              </button>
            );
          })}
        </ScrollableFilterBar>
        {categoryError && <p role="status" className="mt-2 text-xs text-red-700">Categories could not be loaded. <button type="button" onClick={() => setCategoryRetry((value) => value + 1)} className="underline">Retry</button></p>}

        <div aria-busy={isLoading} className="relative mt-7 overflow-hidden rounded-[1.6rem] bg-transparent p-0">
          {isLoading ? <HomeCardSkeletons compact label="Loading providers…" /> : (
          <div
            ref={sliderRef}
            className="flex w-full snap-x snap-mandatory justify-start gap-4 overflow-x-auto pb-3 pl-1 pr-1 scrollbar-none scroll-smooth"
          >
            {!visibleVendorCards.length && (
              <p role="status" className="w-full py-10 text-center text-sm font-semibold text-slate-500">{vendorsFetchFailed ? "Unable to load providers. Please try another category or reload the page." : "No vendors are available for this category right now."}</p>
            )}

            {visibleVendorCards.map((vendor, index) => (
              <Link
                key={vendor.id || index}
                href={`/providers/${encodeURIComponent(vendor.id)}`}
                aria-label={`View ${vendor.companyName || 'provider'} details`}
                className="w-[min(82vw,260px)] min-w-[230px] shrink-0 snap-center focus:outline-none sm:min-w-[245px] lg:min-w-[260px]"
              >
                <div className="group flex h-full min-h-[270px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 hover:ring-blue-100">
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <HomeCardImage
                      src={vendorFallbackImage}
                      fallback={vendorFallbackImage}
                      alt={vendor.companyName || 'Provider'}
                      sizes="(min-width: 1024px) 260px, 82vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    {vendor.rating != null && <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                      <StarRoundedIcon className="h-4 w-4 text-amber-300" />
                      {Number(vendor.rating).toFixed(1)}
                    </span>}
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    <div>
                      <p className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">{vendor.category || 'Provider'}</p>
                      <h3 title={vendor.companyName || 'Provider'} className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-950 group-hover:text-blue-700">{shortVendorName(vendor.companyName)}</h3>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <LocationOnOutlinedIcon className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{[vendor.city, vendor.state].filter(Boolean).join(", ") || "Location not available"}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {vendor.reviewCount != null ? `${vendor.reviewCount} reviews` : ""}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-700">
                        Details
                        <ArrowForwardRoundedIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>

        {!isLoading && visibleVendorCards.length > 0 && <div className="mt-3 flex justify-end gap-2"><button type="button" aria-label="Previous vendors" onClick={() => sliderRef.current?.scrollBy({ left: -280, behavior: 'smooth' })} className="rounded-md border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50">←</button><button type="button" aria-label="Next vendors" onClick={() => sliderRef.current?.scrollBy({ left: 280, behavior: 'smooth' })} className="rounded-md border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50">→</button></div>}
        <div className="mt-8 flex justify-center">
          <Link href="/marketplace/vendors" className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
            Explore More <ArrowForwardRoundedIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
