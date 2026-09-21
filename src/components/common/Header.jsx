import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
  AccountCircleOutlined,
  DashboardOutlined,
  HandshakeOutlined,
  ContactSupportOutlined,
  ForumOutlined,
  KeyboardArrowDown,
  LocationOnOutlined,
  PaymentsOutlined,
  PersonAddAlt1Outlined,
  SchoolOutlined,
  SupportAgentOutlined,
  SearchOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import ImmifyLogo from "@/images/immify-logo.png";
import universityFallbackCampus from "@/images/university-fallback-campus.png";
import {
  universities,
  universityCountries,
  universityCountryMeta,
  universityCourseCategories,
  universityDegreeLevels,
} from "@/components/sections/universities/universityData";
import LogoutButton from "@/components/common/LogoutButton";
import { getDashboardPath, getVendorType, normalizeRole } from "@/util/authRouting";
import { readStoredUserFromStorage } from "@/util/profileHelpers";
import { SERVICE_FILTER_EVENT, serviceListingCategories } from "@/util/serviceListings";

const LOCATION_STORAGE_KEY = "immifySelectedLocation";
const DEFAULT_LOCATION = "Moradabad";
const FALLBACK_LOCATIONS = ["Moradabad", "Delhi", "Mumbai", "Bengaluru", "Hyderabad"];

function getHeaderUser() {
  if (typeof window === "undefined") return null;
  const authenticated = localStorage.getItem("isAuthenticated") === "true" || Boolean(localStorage.getItem("accessToken"));
  if (!authenticated) return null;
  const user = readStoredUserFromStorage();
  if (!user) return null;
  const role = normalizeRole(localStorage.getItem("userRole") || user.role || user.roleName);
  const vendorType = getVendorType(user);
  const firstName = user.firstName || user.first_name || user.name?.split(" ")[0] || "User";
  const lastName = user.lastName || user.last_name || user.name?.split(" ").slice(1).join(" ") || "";
  const profileImage = user.profileImage || user.profileImageUrl || user.avatarUrl || user.avatar_url || user.avatar || user.image || "";
  const dashboardPath = getDashboardPath(role, { ...user, vendorType });
  const profilePath = dashboardPath === "/dashboard/agent" ? "/agent/update-profile"
    : dashboardPath === "/dashboard/partner" ? "/partner/update-profile"
      : dashboardPath === "/dashboard/customer" ? "/user/update-profile" : "/admin/update-profile";
  return { firstName, fullName: [firstName, lastName].filter(Boolean).join(" "), profileImage, dashboardPath, profilePath };
}

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
  const router = useRouter();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [userOpen, setUserOpen] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [serviceCategory, setServiceCategory] = useState(serviceListingCategories[0]);
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceSearchOpen, setServiceSearchOpen] = useState(false);
  const [universityMenuOpen, setUniversityMenuOpen] = useState(false);
  const [activeUniversityCountry, setActiveUniversityCountry] = useState(universityCountries[0] || "");
  const [activeCourseCategory, setActiveCourseCategory] = useState(universityCourseCategories[0]?.category || "");
  const userRef = useRef(null);
  const locationRef = useRef(null);
  const serviceSearchRef = useRef(null);
  const activeCountryUniversities = useMemo(
    () => universities.filter((university) => university.country === activeUniversityCountry),
    [activeUniversityCountry]
  );
  const menuUniversities = useMemo(
    () => (activeCountryUniversities.length ? activeCountryUniversities : universities.slice(0, 10)),
    [activeCountryUniversities]
  );
  const activeCourseGroup = useMemo(
    () => universityCourseCategories.find((group) => group.category === activeCourseCategory) || universityCourseCategories[0],
    [activeCourseCategory]
  );
  const visibleCountries = universityCountryMeta.slice(0, 12);
  const matchingServiceCategories = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();
    return serviceListingCategories.filter((category) => !query || category.toLowerCase().includes(query));
  }, [serviceSearch]);

  const filterHomeServices = async (category, search = serviceSearch) => {
    setServiceCategory(category);
    const query = { serviceCategory: category };
    if (search.trim()) query.serviceSearch = search.trim();
    await router.push({ pathname: "/", query }, undefined, { shallow: router.pathname === "/" });
    window.dispatchEvent(new CustomEvent(SERVICE_FILTER_EVENT, { detail: { category, search: search.trim() } }));
    window.requestAnimationFrame(() => document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const submitServiceSearch = () => {
    const exactCategory = serviceListingCategories.find((category) => category.toLowerCase() === serviceSearch.trim().toLowerCase());
    setServiceSearchOpen(false);
    return filterHomeServices(exactCategory || serviceCategory, exactCategory ? "" : serviceSearch);
  };

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
    const syncUser = () => setAuthenticatedUser(getHeaderUser());
    queueMicrotask(syncUser);
    window.addEventListener("tripz-auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("tripz-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
      if (serviceSearchRef.current && !serviceSearchRef.current.contains(e.target)) {
        setServiceSearchOpen(false);
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
      <div className="border-b border-white/10 bg-[#17215f]">
        <div className="mx-auto flex min-w-[1120px] w-full items-center justify-end gap-2 px-4 py-1 text-xs font-medium sm:px-6 lg:px-8">
          <a href="tel:+911234567890" className="text-white/80 transition hover:text-white" aria-label="Call Immify at +91 12345 67890">
            Call Us: +91 12345 67890
          </a>
          <span className="text-white/35">|</span>
          <Link href="/lead-generation" className="inline-flex cursor-pointer items-center gap-1 text-white/85 transition hover:text-white" aria-label="Get Free Quote">
            <ForumOutlined sx={{ fontSize: 14 }} />
            <span>Get Free Quote</span>
          </Link>
          <span className="text-white/35">|</span>
          <Link href="/partner/sign-up" className="inline-flex cursor-pointer items-center gap-1 text-white/85 transition hover:text-white" aria-label="Become Our Partner">
            <HandshakeOutlined sx={{ fontSize: 14 }} />
            <span>Become Our Partner</span>
          </Link>
        </div>
      </div>

      <div className="relative" onMouseLeave={() => setUniversityMenuOpen(false)}>
        <div className="mx-auto grid min-w-[1120px] w-full grid-cols-[auto_minmax(280px,620px)_auto] items-center gap-3 px-4 py-1 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-start gap-3">
          <Link href="/" className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full transition hover:opacity-90" aria-label="Immify home">
            <Image src={ImmifyLogo} alt="Immify" width={56} height={56} className="h-full w-full scale-[1.9] rounded-full object-contain" priority />
          </Link>
          <div
            className="hidden lg:block"
            onMouseEnter={() => setUniversityMenuOpen(true)}
            onFocus={() => setUniversityMenuOpen(true)}
          >
            <Link
              href="/marketplace/universities"
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-white/50 bg-white px-3 text-xs font-semibold text-slate-900 shadow-sm transition hover:border-sky-300 hover:text-[#1f2a77]"
              aria-label="Explore universities"
            >
              <SchoolOutlined sx={{ fontSize: 15 }} />
              <span className="whitespace-nowrap">Explore Universities</span>
              <KeyboardArrowDown sx={{ fontSize: 14 }} />
            </Link>
          </div>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); submitServiceSearch(); }} className="mx-auto flex w-full items-center gap-2 rounded-[10px] bg-white p-[4px] shadow-sm">
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

          <div ref={serviceSearchRef} className="relative min-w-0 flex-1">
            <input
              value={serviceSearch}
              onFocus={() => setServiceSearchOpen(true)}
              onChange={(event) => { setServiceSearch(event.target.value); setServiceSearchOpen(true); }}
              placeholder="Search services"
              autoComplete="off"
              className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-1.25 text-sm text-slate-900 outline-none focus:border-sky-500"
            />
            {serviceSearchOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-full min-w-72 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 text-slate-900 shadow-xl">
                {matchingServiceCategories.length ? matchingServiceCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => { setServiceSearch(category); setServiceSearchOpen(false); filterHomeServices(category, ""); }}
                    className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    {category}
                  </button>
                )) : <p className="px-4 py-3 text-sm text-slate-500">Press Search to find &quot;{serviceSearch}&quot;</p>}
              </div>
            )}
          </div>
          <button type="submit" className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] bg-emerald-500 px-3 py-1.25 text-sm font-semibold text-white transition hover:bg-emerald-600">
            <SearchOutlined sx={{ fontSize: 16 }} />
            Search
          </button>
        </form>

        <div className="flex min-w-0 items-center justify-end gap-2">
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
              type="button"
              onClick={() => setUserOpen((s) => !s)}
              aria-label={authenticatedUser ? "Open profile menu" : "Open sign in menu"}
              className={authenticatedUser
                ? "inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#0875d1] bg-white p-0 text-[#0875d1] shadow-sm transition hover:border-blue-700 hover:shadow-md"
                : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"}
            >
              {authenticatedUser ? (
                <Avatar src={authenticatedUser.profileImage || undefined} alt={authenticatedUser.fullName} sx={{ width: "100%", height: "100%", fontSize: 14, fontWeight: 700, color: "#0875d1", bgcolor: "#fff", "& img": { width: "100%", height: "100%", objectFit: "cover" } }}>{authenticatedUser.firstName.charAt(0).toUpperCase()}</Avatar>
              ) : (
                <><AccountCircleOutlined sx={{ fontSize: 19 }} /><span>Sign In</span><KeyboardArrowDown sx={{ fontSize: 16 }} /></>
              )}
            </button>

            {userOpen && authenticatedUser && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-[#0875d1] bg-white text-slate-900 shadow-xl">
                <div className="border-b border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">{authenticatedUser.fullName}</p>
                </div>
                <Link href={authenticatedUser.dashboardPath} onClick={() => setUserOpen(false)} className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
                  <DashboardOutlined sx={{ fontSize: 18, color: "#0f172a" }} /> Dashboard
                </Link>
                <Link href={authenticatedUser.profilePath} onClick={() => setUserOpen(false)} className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
                  <AccountCircleOutlined sx={{ fontSize: 18, color: "#0f172a" }} /> Update Profile
                </Link>
                <div className="border-t border-blue-100"><LogoutButton variant="header" onBeforeLogout={() => setUserOpen(false)} /></div>
              </div>
            )}

            {userOpen && !authenticatedUser && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                <Link href="/user/login" className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <AccountCircleOutlined sx={{ fontSize: 18 }} />
                  Sign In
                </Link>
                <Link href="/user/sign-up" className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <PersonAddAlt1Outlined sx={{ fontSize: 18 }} />
                  Register
                </Link>
                <Link href="/agent/login" className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <SupportAgentOutlined sx={{ fontSize: 18 }} />
                  Agent Login
                </Link>
                <Link href="/partner/sign-up" className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">
                  <HandshakeOutlined sx={{ fontSize: 18 }} />
                  Become Our Partner
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

      {universityMenuOpen && (
        <div
          className="absolute left-0 top-full z-50 w-full border-t-4 border-[#0875d1] bg-white text-slate-900 shadow-2xl"
          onMouseEnter={() => setUniversityMenuOpen(true)}
          onMouseLeave={() => setUniversityMenuOpen(false)}
        >
          <div className="mx-auto grid min-w-[1120px] grid-cols-[290px_1fr_320px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
            <aside className="border-r border-slate-200 pr-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0875d1]">Countries</p>
              <div className="scrollbar-none max-h-[430px] space-y-1 overflow-y-auto pr-1">
                {visibleCountries.map((countryMeta) => (
                  <button
                    key={countryMeta.country}
                    type="button"
                    onMouseEnter={() => setActiveUniversityCountry(countryMeta.country)}
                    onFocus={() => setActiveUniversityCountry(countryMeta.country)}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                      activeUniversityCountry === countryMeta.country
                        ? "bg-sky-50 font-semibold text-[#0875d1]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#0875d1]"
                    }`}
                  >
                    <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      <Image
                        src={countryMeta.flagUrl || universityFallbackCampus}
                        alt={`${countryMeta.country} universities`}
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate">Universities in {countryMeta.country}</span>
                  </button>
                ))}
              </div>
            </aside>

            <section>
              <div className="border-b border-sky-100 pb-3">
                <h2 className="border-l-4 border-[#0875d1] pl-3 text-base font-bold text-[#0875d1]">
                  Top Universities in {activeUniversityCountry}
                </h2>
              </div>
              <div className="mt-4 grid gap-x-10 gap-y-2.5 md:grid-cols-2">
                {menuUniversities.slice(0, 10).map((university) => (
                  <Link
                    key={university.slug}
                    href={`/marketplace/universities/${university.slug}`}
                    className="text-xs text-slate-700 transition hover:text-[#0875d1] hover:underline"
                    onClick={() => setUniversityMenuOpen(false)}
                  >
                    {university.name}
                  </Link>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Degree Levels</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {universityDegreeLevels.slice(0, 10).map((level) => (
                    <span key={level} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href="/marketplace/universities"
                className="mt-5 inline-flex rounded-full border border-sky-200 px-3.5 py-1.5 text-xs font-semibold text-[#0875d1] transition hover:bg-sky-50"
                onClick={() => setUniversityMenuOpen(false)}
              >
                View All Universities
              </Link>
            </section>

            <aside className="space-y-7">
              <div>
                <h3 className="border-b border-sky-100 pb-3 text-base font-bold text-[#0875d1]">
                  Course Categories
                </h3>
                <div className="mt-4 grid max-h-36 grid-cols-2 gap-1 overflow-y-auto pr-1 text-[11px] text-slate-700">
                  {universityCourseCategories.map((group) => (
                    <button
                      key={group.category}
                      type="button"
                      onMouseEnter={() => setActiveCourseCategory(group.category)}
                      onFocus={() => setActiveCourseCategory(group.category)}
                      className={`rounded-md px-2 py-1 text-left transition ${
                        activeCourseCategory === group.category ? "bg-sky-50 font-semibold text-[#0875d1]" : "hover:bg-slate-50 hover:text-[#0875d1]"
                      }`}
                    >
                      {group.category}
                    </button>
                  ))}
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-bold text-slate-500">{activeCourseGroup?.category}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activeCourseGroup?.courses.slice(0, 10).map((course) => (
                      <Link
                        key={course}
                        href="/marketplace/universities"
                        className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700 transition hover:bg-sky-50 hover:text-[#0875d1]"
                      >
                        {course}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="border-b border-sky-100 pb-3 text-base font-bold text-[#0875d1]">
                  Guides on {activeUniversityCountry}
                </h3>
                <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                  <Link href="/marketplace/universities" className="block transition hover:text-[#0875d1] hover:underline">
                    Admission Process
                  </Link>
                  <Link href="/marketplace/universities" className="block transition hover:text-[#0875d1] hover:underline">
                    Scholarships and Fees
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
      </div>
    </header>
  );
}
