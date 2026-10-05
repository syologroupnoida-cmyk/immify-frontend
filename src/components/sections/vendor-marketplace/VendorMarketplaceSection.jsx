import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  vendorMarketplaceListings,
  vendorMarketplaceLocations,
} from "./vendorMarketplaceData";
import { fetchCategoryServices, fetchServiceCategories, serviceListingCategories } from "@/util/serviceListings";
import { fetchVendors, vendorFallbackImage } from "@/util/vendors";

const vendorsPerPage = 8;
const normalizeFilterText = (value) => String(value || "").trim().toLowerCase();
const getCategoryNeedles = (value) => {
  const normalized = normalizeFilterText(value);
  return [
    normalized,
    normalized.replace(/\s+services?$/g, ""),
    normalized.replace(/\s+and\s+/g, " "),
  ].filter(Boolean);
};

const textMatchesAny = (haystack, needles) => {
  const normalizedHaystack = normalizeFilterText(haystack);
  return needles.some((needle) => normalizedHaystack.includes(needle) || needle.includes(normalizedHaystack));
};

export default function VendorMarketplaceSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [minimumRating, setMinimumRating] = useState(4.3);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);
  const [apiServices, setApiServices] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [apiVendors, setApiVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsFetchFailed, setVendorsFetchFailed] = useState(false);

  useEffect(() => {
    let active = true;

    fetchServiceCategories()
      .then((items) => {
        if (active) setApiCategories(items);
      })
      .catch(() => {
        if (active) setApiCategories([]);
      })
      .finally(() => {
        if (active) setCategoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedCategoryValues = useMemo(() => (
    selectedCategories === null
      ? (typeof router.query.categoryId === "string" ? [router.query.categoryId] : typeof router.query.category === "string" ? [router.query.category] : [])
      : selectedCategories
  ), [router.query.category, router.query.categoryId, selectedCategories]);
  const selectedLocationValues = useMemo(() => (
    selectedLocations === null
      ? (typeof router.query.location === "string" ? [router.query.location] : [])
      : selectedLocations
  ), [router.query.location, selectedLocations]);
  const dynamicCategoryOptions = useMemo(() => {
    if (apiCategories.length) {
      return apiCategories
        .map((category) => ({ slug: category.id, title: category.name, services: category.services || [] }))
        .sort((first, second) => first.title.localeCompare(second.title));
    }

    if (serviceListingCategories.length) {
      return serviceListingCategories.map((name) => ({ slug: name, title: name }));
    }

    const categoryMap = new Map();

    vendorMarketplaceListings.forEach((vendor) => {
      if (!categoryMap.has(vendor.categorySlug)) {
        categoryMap.set(vendor.categorySlug, {
          slug: vendor.categorySlug,
          title: vendor.categoryTitle,
        });
      }
    });

    return [...categoryMap.values()].sort((first, second) => first.title.localeCompare(second.title));
  }, [apiCategories]);
  const dynamicServiceOptions = useMemo(() => {
    if (selectedCategoryValues[0]) {
      return apiServices
        .map((service) => ({ slug: service.id, title: service.name }))
        .sort((first, second) => first.title.localeCompare(second.title));
    }

    return [];
  }, [apiServices, selectedCategoryValues]);

  useEffect(() => {
    if (!router.isReady || !dynamicCategoryOptions.length || selectedCategories !== null) return;

    const requestedCategory = typeof router.query.categoryId === "string"
      ? router.query.categoryId
      : typeof router.query.category === "string"
        ? router.query.category
        : "";
    if (!requestedCategory) return;

    const requestedCategoryText = normalizeFilterText(requestedCategory);
    const matchedCategory = dynamicCategoryOptions.find((category) => (
      category.slug === requestedCategory || normalizeFilterText(category.title) === requestedCategoryText
    ));

    if (matchedCategory) {
      queueMicrotask(() => {
        setSelectedCategories([matchedCategory.slug]);
      });
    }
  }, [dynamicCategoryOptions, router.isReady, router.query.category, router.query.categoryId, selectedCategories]);

  useEffect(() => {
    let active = true;
    const selectedCategory = dynamicCategoryOptions.find((category) => category.slug === selectedCategoryValues[0]);
    const fallbackServices = selectedCategory?.services || [];

    if (!selectedCategoryValues[0]) {
      queueMicrotask(() => {
        if (!active) return;
        setApiServices([]);
        setServiceLoading(false);
      });
      return () => {
        active = false;
      };
    }

    queueMicrotask(() => {
      if (!active) return;
      setApiServices(fallbackServices);
      setServiceLoading(true);
    });
    fetchCategoryServices(selectedCategoryValues[0])
      .then((items) => {
        if (active) setApiServices(items.length ? items : fallbackServices);
      })
      .catch(() => {
        if (active) setApiServices(fallbackServices);
      })
      .finally(() => {
        if (active) setServiceLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dynamicCategoryOptions, selectedCategoryValues]);

  useEffect(() => {
    const selectedLocation = selectedLocationValues[0]
      ? vendorMarketplaceLocations.find((location) => location.slug === selectedLocationValues[0])
      : null;
    let active = true;

    queueMicrotask(() => {
      if (active) setVendorsLoading(true);
    });
    fetchVendors({
      city: selectedLocation?.name || "",
      state: selectedLocation?.state || "",
      country: selectedLocation ? "India" : "",
      categoryId: selectedCategoryValues[0] || "",
      serviceId: selectedServices[0] || "",
    })
      .then((items) => {
        if (active) {
          setApiVendors(items);
          setVendorsFetchFailed(false);
        }
      })
      .catch(() => {
        if (active) {
          setApiVendors([]);
          setVendorsFetchFailed(true);
        }
      })
      .finally(() => {
        if (active) setVendorsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCategoryValues, selectedLocationValues, selectedServices]);

  const filteredVendors = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const usingApiVendors = !vendorsFetchFailed;
    const vendors = usingApiVendors ? apiVendors : vendorMarketplaceListings;

    return vendors.filter((vendor) => {
      const matchesSearch = !keyword || [
        vendor.name,
        vendor.city,
        vendor.state,
        vendor.categoryTitle,
        vendor.specialty,
        vendor.responseTime,
        ...(vendor.services || []),
      ].some((value) => String(value || "").toLowerCase().includes(keyword));
      const matchesCategory = usingApiVendors || !selectedCategoryValues.length || selectedCategoryValues.some((selectedCategory) => {
        const selectedCategoryOption = dynamicCategoryOptions.find((category) => category.slug === selectedCategory);
        const categoryNeedles = getCategoryNeedles(selectedCategoryOption?.title || selectedCategory);
        return vendor.categoryId === selectedCategory
          || vendor.categorySlug === selectedCategory
          || textMatchesAny(vendor.categoryTitle, categoryNeedles)
          || textMatchesAny(vendor.specialty, categoryNeedles)
          || (vendor.services || []).some((service) => textMatchesAny(service, categoryNeedles));
      });
      const matchesLocation = usingApiVendors || !selectedLocationValues.length || selectedLocationValues.includes(vendor.locationSlug);
      const matchesService = usingApiVendors || !selectedServices.length || selectedServices.some((selectedService) => {
        const selectedServiceOption = dynamicServiceOptions.find((service) => service.slug === selectedService);
        const serviceNeedles = getCategoryNeedles(selectedServiceOption?.title || selectedService);
        return vendor.serviceId === selectedService
          || textMatchesAny(vendor.specialty, serviceNeedles)
          || (vendor.services || []).some((service) => textMatchesAny(service, serviceNeedles));
      });
      const matchesRating = vendor.rating >= minimumRating;

      return matchesSearch && matchesCategory && matchesLocation && matchesService && matchesRating;
    });
  }, [apiVendors, dynamicCategoryOptions, dynamicServiceOptions, minimumRating, search, selectedCategoryValues, selectedLocationValues, selectedServices, vendorsFetchFailed]);

  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / vendorsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const totalResults = filteredVendors.length;
  const paginatedVendors = useMemo(() => {
    const startIndex = (activePage - 1) * vendorsPerPage;

    return filteredVendors.slice(startIndex, startIndex + vendorsPerPage);
  }, [activePage, filteredVendors]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedServices([]);
    setMinimumRating(4.3);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const toggleValue = (value, setter, currentValues) => {
    setCurrentPage(1);
    setter(currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value]);
    setShowFilters(false);
  };

  const applyTopRated = () => {
    setMinimumRating((rating) => (rating >= 4.8 ? 4.3 : 4.8));
    setCurrentPage(1);
    setShowFilters(false);
  };

  const selectSingleCategory = (value) => {
    setSelectedCategories(value ? [value] : []);
    setSelectedServices([]);
    setCurrentPage(1);
  };

  const selectSingleService = (value) => {
    setSelectedServices(value ? [value] : []);
    setCurrentPage(1);
  };

  const firstLocation = selectedLocationValues[0]
    ? vendorMarketplaceLocations.find((location) => location.slug === selectedLocationValues[0])
    : null;
  const locationName = firstLocation?.name || "India";
  const firstCategory = selectedCategoryValues[0]
    ? dynamicCategoryOptions.find((category) => category.slug === selectedCategoryValues[0])
    : null;
  const categoryName = firstCategory?.title || "Immigration Vendors";

  return (
    <main className="min-h-screen bg-white pb-12">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tight text-blue-700">
            Immify
          </Link>
          <div className="grid flex-1 gap-3 md:grid-cols-[310px_1fr]">
            <div className="flex h-12 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 shadow-sm">
              <LocationOnOutlinedIcon className="h-5 w-5 text-slate-400" />
              <select
                value={selectedLocationValues[0] || ""}
                onChange={(event) => {
                  setSelectedLocations(event.target.value ? [event.target.value] : []);
                  setCurrentPage(1);
                }}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none"
              >
                <option value="">All India</option>
                {vendorMarketplaceLocations.slice(0, 30).map((location) => (
                  <option key={location.slug} value={location.slug}>{location.name}</option>
                ))}
              </select>
            </div>
            <div className="flex h-12 items-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search vendor, service or city"
                className="min-w-0 flex-1 px-4 text-sm font-medium text-slate-900 outline-none"
              />
              <button type="button" className="flex h-12 w-14 items-center justify-center bg-orange-600 text-white transition hover:bg-orange-700" aria-label="Search vendors">
                <SearchRoundedIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
            <span className="text-blue-700">EN</span>
            <Link href="/lead-generation" className="rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-50">Leads</Link>
            <Link href="/pricing" className="hover:text-blue-700">Advertise</Link>
            <Link href="/agent/sign-up" className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">Login / Sign Up</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-xl px-4 py-8 text-white sm:px-6">
          <Image
            src="/images/marketplace-banner.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-slate-950/75" />
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Vendor Marketplace</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Explore Trusted Immigration Vendors in {locationName}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="text-xs text-slate-600">
          <Link href="/" className="hover:text-blue-700">{locationName}</Link>
          <span className="mx-2 text-slate-400">&gt;</span>
          <span>{categoryName} in {locationName}</span>
          <span className="mx-2 text-slate-400">&gt;</span>
          <span>{totalResults}+ Listings</span>
        </div>

        <div className="scrollbar-none mt-6 flex gap-3 overflow-x-auto pb-2">
          <FilterChip label="Sort by" hasArrow />
          <SelectFilterChip
            label="Category"
            value={selectedCategoryValues[0] || ""}
            onChange={selectSingleCategory}
            options={dynamicCategoryOptions}
            getValue={(category) => category.slug}
            getLabel={(category) => category.title}
            emptyLabel={categoryLoading ? "Loading..." : "All"}
            disabled={categoryLoading}
            minWidth={260}
          />
          <SelectFilterChip
            label="Services"
            value={selectedServices[0] || ""}
            onChange={selectSingleService}
            options={dynamicServiceOptions}
            getValue={(service) => service.slug}
            getLabel={(service) => service.title}
            emptyLabel={!selectedCategoryValues[0] ? "Select category first" : serviceLoading ? "Loading..." : "All"}
            disabled={!selectedCategoryValues[0] || serviceLoading}
            minWidth={230}
          />
          <FilterChip label="Ratings" hasArrow onClick={applyTopRated} />
          <FilterChip label="All Filters" icon={<TuneRoundedIcon className="h-5 w-5" />} strong onClick={() => setShowFilters((value) => !value)} />
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-3">
            <InlineFilter
              title="Vendor Category"
              values={dynamicCategoryOptions.slice(0, 8)}
              selectedValues={selectedCategoryValues}
              getValue={(category) => category.slug}
              getLabel={(category) => category.title}
              onToggleValue={(value) => toggleValue(value, setSelectedCategories, selectedCategoryValues)}
            />
            <InlineFilter
              title="Services"
              values={dynamicServiceOptions.slice(0, 10)}
              selectedValues={selectedServices}
              getValue={(service) => service.slug}
              getLabel={(service) => service.title}
              onToggleValue={(value) => toggleValue(value, setSelectedServices, selectedServices)}
            />
            <InlineFilter
              title="Popular Cities"
              values={vendorMarketplaceLocations.slice(0, 10)}
              selectedValues={selectedLocationValues}
              getValue={(location) => location.slug}
              getLabel={(location) => location.name}
              onToggleValue={(value) => toggleValue(value, setSelectedLocations, selectedLocationValues)}
            />
            <div className="lg:col-span-3">
              <button type="button" onClick={resetFilters} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Clear all filters
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-5">
            {vendorsLoading && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-sm font-semibold text-slate-500">
                Loading vendors...
              </div>
            )}

            {paginatedVendors.map((vendor) => (
              <VendorListCard key={vendor.id} vendor={vendor} />
            ))}

            {!vendorsLoading && !filteredVendors.length && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-lg font-semibold text-slate-900">No vendors found</p>
                <p className="mt-2 text-sm text-slate-500">Try clearing filters or lowering the minimum rating.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={activePage === 1}
                  className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 text-sm font-semibold text-slate-600">Page {activePage} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={activePage === totalPages}
                  className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>

          <aside className="hidden xl:block">
            <LeadPanel categoryName={categoryName} />
          </aside>
        </div>
      </section>
    </main>
  );
}

function FilterChip({ label, icon, active = false, hasArrow = false, strong = false, field = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-bold transition ${
        active
          ? "border-blue-200 bg-blue-50 text-blue-800"
          : field
            ? "min-w-[170px] border-slate-300 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50"
            : strong
            ? "border-slate-900 bg-white text-slate-950 hover:bg-slate-50"
            : "border-slate-200 bg-white text-slate-950 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
      {hasArrow && <KeyboardArrowDownRoundedIcon className="h-5 w-5" />}
    </button>
  );
}

function SelectFilterChip({
  label,
  value,
  onChange,
  options,
  emptyLabel = "All",
  disabled = false,
  minWidth = 220,
  getValue = (item) => item,
  getLabel = (item) => item,
}) {
  return (
    <div className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-950">
      <span className="shrink-0">{label}</span>
      <FormControl size="small" sx={{ minWidth }}>
        <Select
          displayEmpty
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          renderValue={(selected) => {
            if (!selected) return emptyLabel;
            const selectedOption = options.find((item) => getValue(item) === selected);
            return selectedOption ? getLabel(selectedOption) : selected;
          }}
          sx={{
            height: 26,
            fontSize: 12,
            fontWeight: 700,
            color: "#334155",
            ".MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#93c5fd" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
            ".MuiSelect-select": { py: 0.25 },
          }}
          MenuProps={{ disableScrollLock: true, PaperProps: { sx: { maxHeight: 320 } } }}
        >
          <MenuItem value="">{emptyLabel}</MenuItem>
          {options.map((item) => {
            const optionValue = getValue(item);
            const optionLabel = getLabel(item);

            return (
              <MenuItem key={optionValue} value={optionValue}>
                {optionLabel}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}

function VendorListCard({ vendor }) {
  const detailSlug = vendor.vendorUserId || vendor.slug;
  const phoneNumber = vendor.phone || "08487868432";

  return (
    <article className="group relative min-h-[188px] rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md">
      <Link href={`/marketplace/vendors/${detailSlug}`} className="absolute inset-0 z-0 rounded-xl" aria-label={`View ${vendor.name} details`} />
      <div className="pointer-events-none relative z-10 grid gap-5 md:grid-cols-[190px_1fr]">
        <div className="relative h-[156px] overflow-hidden rounded-md bg-slate-100">
          <Image
            src={vendor.image || vendorFallbackImage}
            alt={vendor.name}
            fill
            unoptimized
            sizes="(min-width: 768px) 190px, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute right-2 top-1/2 flex h-9 w-8 -translate-y-1/2 items-center justify-center bg-transparent text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">
            <KeyboardArrowRightRoundedIcon className="h-6 w-6" />
          </span>
        </div>

        <div className="min-w-0">
          <h2 className="min-h-7 text-lg font-bold tracking-tight text-slate-950 group-hover:text-blue-700">{vendor.name}</h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-sm font-bold text-white">
              {vendor.rating.toFixed(1)}
              <StarRoundedIcon className="h-4 w-4" />
            </span>
            <span className="text-xs text-slate-600">{Math.round(vendor.rating * 340)} Ratings</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
              <VerifiedRoundedIcon className="h-5 w-5" />
              Verified
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-900">
            <LocationOnOutlinedIcon className="h-5 w-5 text-slate-700" />
            <span>{vendor.city}, {vendor.state}</span>
          </div>

          <div className="pointer-events-auto relative z-20 mt-5 flex flex-wrap gap-2">
            <Link href={`tel:${phoneNumber}`} className="inline-flex h-9 min-w-[150px] items-center justify-center gap-2 rounded-md bg-green-600 px-3 text-xs font-bold text-white hover:bg-green-700">
              <PhoneRoundedIcon className="h-4 w-4" />
              {phoneNumber}
            </Link>
            <Link href={{ pathname: "/lead-generation", query: { vendor: detailSlug } }} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-xs font-bold text-slate-950 hover:bg-slate-50">
              <WhatsAppIcon className="h-5 w-5 text-green-600" />
              WhatsApp
            </Link>
            <Link href={{ pathname: "/lead-generation", query: { vendor: detailSlug } }} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-xs font-bold text-white hover:bg-blue-800">
              <ChatRoundedIcon className="h-4 w-4" />
              Send Enquiry
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function LeadPanel({ categoryName }) {
  return (
    <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-950">
        Get the list of Top <span className="text-blue-700">{categoryName}</span>
      </h2>
      <p className="mt-3 text-xs font-medium text-slate-900">We&apos;ll send you contact details in seconds for free</p>

      <div className="mt-7">
        <p className="text-sm font-bold text-slate-950">What type of service do you prefer?</p>
        <div className="mt-5 flex flex-wrap gap-6 text-sm font-bold text-slate-950">
          {["Consultation", "Documentation", "Others"].map((item, index) => (
            <label key={item} className="inline-flex items-center gap-2">
              <input type="radio" name="vendor-service-type" defaultChecked={index === 0} className="h-5 w-5 accent-blue-600" />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-7 space-y-3">
        <label className="flex h-11 items-center gap-3 rounded border border-slate-300 px-4">
          <PersonRoundedIcon className="h-5 w-5 text-slate-950" />
          <input placeholder="Name" className="min-w-0 flex-1 text-sm font-bold outline-none" />
        </label>
        <label className="flex h-11 items-center gap-3 rounded border border-slate-300 px-4">
          <PhoneAndroidRoundedIcon className="h-5 w-5 text-slate-950" />
          <input placeholder="Mobile Number" className="min-w-0 flex-1 text-sm font-bold outline-none" />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" defaultChecked className="mt-0.5 h-5 w-5 rounded accent-blue-600" />
        <span>I Agree to <Link href="/lead-generation" className="underline">T&amp;C&apos;s Privacy Policy</Link></span>
      </label>

      <Link href="/lead-generation" className="mt-5 flex h-11 items-center justify-center rounded-md bg-blue-700 text-sm font-bold text-white hover:bg-blue-800">
        Send Enquiry &gt;&gt;&gt;
      </Link>
    </div>
  );
}

function InlineFilter({
  title,
  values,
  selectedValues,
  onToggleValue,
  getValue = (value) => value,
  getLabel = (value) => value,
}) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-950">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((item) => {
          const value = getValue(item);
          const label = getLabel(item);
          const active = selectedValues.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggleValue(value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                active
                  ? "border-blue-200 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
