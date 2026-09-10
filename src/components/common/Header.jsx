import Link from "next/link";
import Image from "next/image";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  AccountCircleOutlined,
  BusinessCenterOutlined,
  CampaignOutlined,
  ContactSupportOutlined,
  KeyboardArrowDown,
  LocationOnOutlined,
  PaymentsOutlined,
  PersonAddAlt1Outlined,
  SearchOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import SiteLogo from "@/images/site-logo.png";
import LeadGenerationButton from "./LeadGenerationButton";

const LOCATION_STORAGE_KEY = "immifySelectedLocation";
const DEFAULT_LOCATION = "Moradabad";
const FALLBACK_LOCATIONS = ["Moradabad", "Delhi", "Mumbai", "Bengaluru", "Hyderabad"];

function getCityFromAddress(address = {}) {
  return address.city || address.town || address.village || address.municipality || address.county || address.state_district || "";
}

function formatLocationLabel(address = {}) {
  const city = getCityFromAddress(address);
  const state = address.state || "";
  const country = address.country || "";

  return [city, state, country].filter(Boolean).slice(0, 3).join(", ");
}

function formatSuggestion(place) {
  const address = place?.address || {};
  const label = formatLocationLabel(address);

  return label || place?.display_name || "";
}

export default function Header() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  const locationRef = useRef(null);

  const selectLocation = useCallback((value) => {
    const nextLocation = value.trim();
    if (!nextLocation) return;

    setLocation(nextLocation);
    setLocationSearch("");
    setLocationOpen(false);
    setLocationSuggestions([]);
    setLocationStatus("");
    if (typeof window !== "undefined") localStorage.setItem(LOCATION_STORAGE_KEY, nextLocation);
  }, []);

  const detectCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported in this browser.");
      return;
    }

    setLocationLoading(true);
    setLocationStatus("Detecting your city...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1&accept-language=en`
          );
          const data = await response.json();
          const detectedLocation = formatLocationLabel(data?.address) || data?.display_name || "";

          if (detectedLocation) {
            selectLocation(detectedLocation);
          } else {
            setLocationStatus("Unable to detect city. Search manually.");
          }
        } catch {
          setLocationStatus("Unable to detect city. Search manually.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        setLocationStatus("Allow location access or search manually.");
      },
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 30 * 60 * 1000 }
    );
  }, [selectLocation]);

  useEffect(() => {
    function handleClick(e) {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);

    if (storedLocation) {
      queueMicrotask(() => setLocation(storedLocation));
      return;
    }

    queueMicrotask(detectCurrentLocation);
  }, [detectCurrentLocation]);

  useEffect(() => {
    const query = locationSearch.trim();

    if (query.length < 2) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLocationLoading(true);
      setLocationStatus("");

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&featuretype=city&accept-language=en&q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        const suggestions = Array.isArray(data)
          ? data
            .map((place) => formatSuggestion(place))
            .filter(Boolean)
            .filter((value, index, list) => list.indexOf(value) === index)
          : [];

        setLocationSuggestions(suggestions);
        setLocationStatus(suggestions.length ? "" : "No city found.");
      } catch (error) {
        if (error.name !== "AbortError") setLocationStatus("Unable to load city suggestions.");
      } finally {
        setLocationLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [locationSearch]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#1f2a77] text-white">
      <div className="mx-auto flex w-full items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white shadow-md ring-1 ring-white/70 transition hover:bg-slate-50" aria-label="Immify home">
          <Image src={SiteLogo} alt="Immify" width={46} height={46} className="h-[46px] w-[46px] object-contain" priority />
        </Link>

        <div className="mx-auto flex min-w-[280px] max-w-[620px] flex-1 items-center gap-2 rounded-[10px] bg-white p-[4px] shadow-sm">
          <div className="relative min-w-[110px] rounded-[10px] border border-slate-200 bg-slate-100 px-2.5 py-1.75 text-sm text-slate-700" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationOpen((s) => !s)}
              className="inline-flex w-full cursor-pointer items-center justify-between gap-2 text-sm"
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <LocationOnOutlined sx={{ fontSize: 16 }} />
                <span className="truncate">{location}</span>
              </span>
              <KeyboardArrowDown sx={{ fontSize: 16 }} />
            </button>

            {locationOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                <div className="border-b border-slate-100 p-3">
                  <div className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-2.5 py-2">
                    <SearchOutlined sx={{ fontSize: 16, color: "#64748b" }} />
                    <input
                      autoFocus
                      value={locationSearch}
                      onChange={(event) => {
                        const value = event.target.value;
                        setLocationSearch(value);
                        if (value.trim().length < 2) {
                          setLocationSuggestions([]);
                          setLocationStatus("");
                        }
                      }}
                      placeholder="Search city"
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={detectCurrentLocation}
                    className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] bg-[#1f2a77] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#17215f] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={locationLoading}
                  >
                    <LocationOnOutlined sx={{ fontSize: 15 }} />
                    Use current location
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto py-1">
                  {(locationSuggestions.length ? locationSuggestions : FALLBACK_LOCATIONS).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => selectLocation(loc)}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <LocationOnOutlined sx={{ fontSize: 16 }} />
                    <span className="min-w-0 flex-1 truncate">{loc}</span>
                  </button>
                  ))}
                </div>

                {(locationLoading || locationStatus) && (
                  <div className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
                    {locationLoading ? "Loading location..." : locationStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          <input
            placeholder="Search products, services, suppliers"
            className="flex-1 rounded-[10px] border border-slate-200 bg-white px-3 py-1.25 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] bg-emerald-500 px-3 py-1.25 text-sm font-semibold text-white transition hover:bg-emerald-600">
            <SearchOutlined sx={{ fontSize: 16 }} />
            Search
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LeadGenerationButton variant="light" className="px-2.5 py-1.5" />
          <Link href="/advertise" className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10" aria-label="Advertise">
            <CampaignOutlined sx={{ fontSize: 17 }} />
            <span>Advertise</span>
          </Link>
          <button className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10" aria-label="Free Business listing ">
            <BusinessCenterOutlined sx={{ fontSize: 17 }} />
            <span>Free Business listing</span>
          </button>
          <Link href="/jobs" className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10" aria-label="Jobs">
            <WorkOutlineOutlined sx={{ fontSize: 17 }} />
            <span>Jobs</span>
          </Link>
          <Link href="/pricing" className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10" aria-label="Pricing">
            <PaymentsOutlined sx={{ fontSize: 17 }} />
            <span>Pricing</span>
          </Link>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen((s) => !s)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
            >
              <AccountCircleOutlined sx={{ fontSize: 19 }} />
              <span>Sign In</span>
              <KeyboardArrowDown sx={{ fontSize: 16 }} />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                <Link href="/user/login" className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <AccountCircleOutlined sx={{ fontSize: 18 }} />
                  Sign In
                </Link>
                <Link href="/user/sign-up" className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <PersonAddAlt1Outlined sx={{ fontSize: 18 }} />
                  Register
                </Link>
                <div className="border-t border-slate-200" />
                <a href="#" className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <ContactSupportOutlined sx={{ fontSize: 18 }} />
                  Contact Us
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
