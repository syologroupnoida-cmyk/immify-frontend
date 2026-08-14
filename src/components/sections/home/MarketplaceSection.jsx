import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CardTravelOutlinedIcon from "@mui/icons-material/CardTravelOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { marketplaceTabs } from "./homeData";

const listingImages = [
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
];

const getServiceImage = (serviceIndex) => listingImages[serviceIndex % listingImages.length];

const listingMeta = [
  { badge: "FEATURED", badgeClass: "bg-blue-600", category: "TOUR PACKAGE", price: "INR 24,999", city: "New Delhi, India", rating: "4.8", votes: "120" },
  { badge: "POPULAR", badgeClass: "bg-emerald-500", category: "REAL ESTATE", price: "INR 68.5 Lakh", city: "Bangalore, India", rating: "4.6", votes: "88" },
  { badge: "NEW", badgeClass: "bg-violet-500", category: "JOB", price: "INR 8 - 12 LPA", city: "Mumbai, India", rating: "4.7", votes: "56" },
  { badge: "BEST DEAL", badgeClass: "bg-amber-500", category: "VEHICLE", price: "INR 32.9 Lakh", city: "Chandigarh, India", rating: "4.9", votes: "73" },
];

const iconTone = {
  "immigration-services": "text-blue-600",
  "visa-services": "text-emerald-600",
  "study-abroad-services": "text-violet-600",
  "test-prepation": "text-amber-500",
  "international-services": "text-cyan-600",
  "family-relocation-services": "text-rose-500",
  "document-attention-services": "text-indigo-600",
  "financial-services": "text-lime-600",
  "business-setup-services-and-immigration": "text-orange-500",
  "helth-insurance": "text-sky-600",
  "forex-services": "text-teal-600",
  "legal-and-complance": "text-fuchsia-600",
};

const tabIconMap = {
  "immigration-services": FlightTakeoffOutlinedIcon,
  "visa-services": CardTravelOutlinedIcon,
  "study-abroad-services": SchoolOutlinedIcon,
  "test-prepation": VerifiedOutlinedIcon,
  "international-services": PublicOutlinedIcon,
  "family-relocation-services": LanguageOutlinedIcon,
  "document-attention-services": RequestQuoteOutlinedIcon,
  "financial-services": PaymentsOutlinedIcon,
  "business-setup-services-and-immigration": BusinessCenterOutlinedIcon,
  "helth-insurance": HealthAndSafetyOutlinedIcon,
  "forex-services": RequestQuoteOutlinedIcon,
  "legal-and-complance": GavelOutlinedIcon,
};

function ServiceListingCard({ tabName, categorySlug, serviceName, image, index }) {
  const meta = listingMeta[index % listingMeta.length];

  return (
    <Link
      href={{
        pathname: "/marketplace",
        query: {
          category: categorySlug,
          service: serviceName,
        },
      }}
      className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img src={image} alt={serviceName} className="h-full w-full object-cover" />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${meta.badgeClass}`}>
          {meta.badge}
        </span>
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
        >
          <FavoriteBorderRoundedIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-sky-700">{meta.category}</p>
        <h3 className="line-clamp-1 text-lg font-semibold leading-tight text-slate-900">{serviceName}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          Complete assistance for {tabName.toLowerCase()} with verified providers and transparent process guidance.
        </p>

        <div className="flex items-end justify-between gap-2 pt-2">
          <p className="text-lg font-semibold leading-none text-blue-600">{meta.price}</p>
          <p className="flex items-center gap-1 text-sm font-semibold text-amber-500">
            <StarRoundedIcon className="h-4 w-4" />
            {meta.rating}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <LocationOnOutlinedIcon className="h-3.5 w-3.5" />
            {meta.city}
          </span>
          <span>({meta.votes})</span>
        </div>
      </div>
    </Link>
  );
}

export default function MarketplaceSection() {
  const [activeTab, setActiveTab] = useState(marketplaceTabs[0].slug);
  const tabsRailRef = useRef(null);

  const currentTab = useMemo(
    () => marketplaceTabs.find((tab) => tab.slug === activeTab) || marketplaceTabs[0],
    [activeTab]
  );

  const displayServices = currentTab.services.slice(0, 4);

  const scrollTabs = (direction) => {
    if (!tabsRailRef.current) return;

    tabsRailRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="marketplace"
      className="w-full overflow-x-clip bg-[radial-gradient(circle_at_top,_#f5f8ff_0%,_#ffffff_56%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 sm:text-sm">
            <span className="inline-flex h-5 w-5 items-center justify-center text-blue-700 sm:h-6 sm:w-6">
              <BusinessCenterOutlinedIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            MARKETPLACE
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Explore, Compare &amp; Choose the Best
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Find trusted services, products, and opportunities all in one place.
            <br className="hidden sm:block" />
            Quality listings. Verified providers. Great value.
          </p>
        </div>

        <div className="relative mt-9">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollTabs("left")}
            className="absolute left-0 top-9 z-10 hidden -translate-x-2 text-slate-500 transition hover:text-slate-800 lg:block"
          >
            <ArrowBackIosNewRoundedIcon className="h-7 w-7" />
          </button>

          <div
            ref={tabsRailRef}
            className="tabs-rail scrollbar-none mx-auto flex items-start gap-1 overflow-x-auto overflow-y-hidden px-1 pb-2 sm:gap-3 lg:mx-10"
          >
            {marketplaceTabs.map((tab) => {
              const isActive = tab.slug === activeTab;
              const colorClass = iconTone[tab.slug] || "text-blue-600";
              const Icon = tabIconMap[tab.slug] || PublicOutlinedIcon;

              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => setActiveTab(tab.slug)}
                  className="group relative flex min-w-[122px] flex-col items-center px-1 text-center"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border bg-white transition sm:h-12 sm:w-12 ${
                      isActive
                        ? `border-blue-200 ${colorClass} shadow-[0_6px_14px_rgba(37,99,235,0.10)]`
                        : "border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-600"
                    }`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>

                  <span
                    className={`mt-3 line-clamp-2 text-xs font-medium leading-5 transition sm:text-sm ${
                      isActive ? "text-blue-700" : "text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {tab.name}
                  </span>

                  <span className={`mt-3 h-1 w-16 rounded-full ${isActive ? "bg-blue-600" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollTabs("right")}
            className="absolute right-0 top-9 z-10 hidden translate-x-2 text-slate-500 transition hover:text-slate-800 lg:block"
          >
            <ArrowForwardIosRoundedIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="mt-10 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-2 xl:grid-cols-4">
          {displayServices.map((service, index) => (
            <ServiceListingCard
              key={`${currentTab.slug}-${service}`}
              tabName={currentTab.name}
              categorySlug={currentTab.slug}
              serviceName={service}
              image={getServiceImage(index)}
              index={index}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/marketplace"
            className="rounded-xl border border-blue-300 px-8 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
          >
            View All Listings
          </Link>
        </div>
      </div>

      <style jsx>{`
        .tabs-rail {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .tabs-rail::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>
    </section>
  );
}
