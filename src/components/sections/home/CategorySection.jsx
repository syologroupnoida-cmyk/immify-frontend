import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { fetchServiceCategories, serviceListingCategories } from "@/util/serviceListings";
import { fetchVendors, vendorFallbackImage } from "@/util/vendors";
import { featuredVendorProfiles } from "../vendor-marketplace/vendorMarketplaceData";

const fallbackVendorCards = featuredVendorProfiles.slice(0, 4);

export default function CategorySection() {
  const sliderRef = useRef(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorsFetchFailed, setVendorsFetchFailed] = useState(false);

  const vendorTabs = useMemo(() => {
    const dynamicTabs = serviceCategories
      .map((category) => ({ id: category.id, title: category.name }))
      .sort((first, second) => first.title.localeCompare(second.title));
    const fallbackTabs = serviceListingCategories.map((title) => ({ id: title, title }));

    return dynamicTabs.length ? dynamicTabs : fallbackTabs;
  }, [serviceCategories]);
  const activeCategory = vendorTabs.find((category) => category.id === activeCategoryId) || null;
  const visibleVendorCards = vendorsFetchFailed ? fallbackVendorCards : vendors.slice(0, 4);

  useEffect(() => {
    let active = true;

    fetchServiceCategories()
      .then((items) => {
        if (active) {
          setServiceCategories(items);
          setActiveCategoryId((current) => (
            current && items.some((item) => item.id === current) ? current : ""
          ));
        }
      })
      .catch(() => {
        if (active) setServiceCategories([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) setLoading(true);
    });
    fetchVendors({ categoryId: activeCategoryId })
      .then((items) => {
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
        if (active) setLoading(false);
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
    <section id="vendors" className="w-full bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">Explore vendors</p>
            <h2 className="mt-2 max-w-2xl text-xl font-semibold text-slate-900 sm:text-3xl">
              Compare verified immigration vendors by service, city, and response time.
            </h2>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Vendor service categories"
          className="scrollbar-none mt-7 flex scroll-pl-4 justify-start gap-2 overflow-x-auto border-b border-slate-200 px-1 pb-3"
        >
          {vendorTabs.map((category) => {
            const isActive = activeCategory?.id === category.id;

            return (
              <button
                key={category.id || category.title}
                type="button"
                role="tab"
                onClick={() => setActiveCategoryId(category.id)}
                className={`shrink-0 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-blue-900 bg-blue-50 text-blue-900"
                    : "border-transparent text-slate-600 hover:bg-slate-100"
                }`}
                aria-selected={isActive}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        <div className="relative mt-7 overflow-hidden rounded-[1.6rem] bg-transparent p-0">
          <div
            ref={sliderRef}
            className="mx-auto flex max-w-[1220px] snap-x snap-mandatory justify-start gap-4 overflow-x-auto pb-3 pl-1 pr-1 scrollbar-none scroll-smooth lg:justify-center"
          >
            {!loading && !visibleVendorCards.length && (
              <p className="w-full py-10 text-center text-sm font-semibold text-slate-500">No vendors are available for this category right now.</p>
            )}

            {visibleVendorCards.map((vendor, index) => (
              <Link
                key={`${vendor.vendorUserId || vendor.slug}-${index}`}
                href={`/marketplace/vendors/${vendor.vendorUserId || vendor.slug}`}
                className="w-[min(82vw,260px)] min-w-[230px] snap-center focus:outline-none sm:min-w-[245px] lg:min-w-[260px]"
              >
                <div className="group flex h-full min-h-[270px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 hover:ring-blue-100">
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <Image
                      src={vendor.image || vendorFallbackImage}
                      alt={vendor.name}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 260px, 82vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-emerald-700 shadow-sm">
                      <VerifiedRoundedIcon className="h-4 w-4" />
                      Verified
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                      <StarRoundedIcon className="h-4 w-4 text-amber-300" />
                      {Number(vendor.rating || 4.8).toFixed(1)}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    <div>
                      <p className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">{vendor.categoryTitle || activeCategory?.title}</p>
                      <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-950 group-hover:text-blue-700">{vendor.name}</h3>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <LocationOnOutlinedIcon className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{[vendor.city, vendor.state].filter(Boolean).join(", ") || "India"}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {loading ? "Loading vendors" : vendor.responseTime || "Same day"}
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
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/marketplace/vendors" className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
            Explore More <ArrowForwardRoundedIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
