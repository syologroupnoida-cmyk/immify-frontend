import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { fetchCategoryServices, fetchServiceCategories, fetchServiceListings, serviceListingCategories, serviceListingFallbackImage } from "@/util/serviceListings";
import { buildFilterGroups, categoryKey, marketplaceRequestGroups, matchesMarketplaceCategory, matchesMarketplaceService, paginationItems, queryValues, serviceKey } from "@/util/marketplaceFilters.mjs";
import { marketplaceTabs } from "../home/homeData";
import MarketplaceSearch from "./MarketplaceSearch";

const pageSize = 9;
const fallbackTabs = marketplaceTabs.map((tab) => ({ ...tab, name: serviceListingCategories.find((name) => categoryKey(name) === categoryKey(tab.name)) || tab.name }));
const inputClass = "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function FilterCheckbox({ checked, onChange, label, count }) {
  return (
    <label className={`flex min-h-9 cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2 text-xs leading-5 transition hover:bg-blue-50 ${checked ? "bg-blue-50 font-semibold text-[#1f2a77]" : "text-slate-600"}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#1f2a77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" />
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined && <span className="shrink-0 text-[10px] tabular-nums text-slate-400">{count}</span>}
    </label>
  );
}

export default function MarketplaceMainSection() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");

  useEffect(() => {
    let active = true;
    fetchServiceCategories().then(async (items) => {
      if (!active) return;
      setCategories(items);
      const results = await Promise.allSettled(items.map(async (category) => {
        if (category.services.length) return category;
        return { ...category, services: await fetchCategoryServices(category.id) };
      }));
      if (active) setCategories(results.map((result, index) => result.status === "fulfilled" ? result.value : items[index]));
    }).catch(() => { if (active) setCategories([]); })
      .finally(() => { if (active) setCategoryLoading(false); });
    return () => { active = false; };
  }, []);

  const groups = useMemo(() => buildFilterGroups(categories, listings, fallbackTabs), [categories, listings]);
  const selectedCategories = queryValues(router.query.categoryId ?? router.query.category);
  const selectedServices = queryValues(router.query.serviceId ?? router.query.service);
  const requestGroups = marketplaceRequestGroups(selectedCategories, selectedServices, groups);
  const requestKey = JSON.stringify(requestGroups.flatMap((group) => group.ids.length ? group.ids.map((id) => ({ id, name: group.name })) : [{ name: group.name }]));
  const selectionKey = JSON.stringify([selectedCategories, selectedServices]);

  useEffect(() => {
    if (!router.isReady || categoryLoading) return;
    let active = true;
    Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      setError(false);
      const targets = JSON.parse(requestKey);
      try {
        const [collections, serviceUpdates] = await Promise.all([
          targets.length ? Promise.all(targets.map(async (target) => {
            const items = await fetchServiceListings({ categoryName: target.name });
            return items.map((item) => item.categoryName === "Services" ? { ...item, categoryId: item.categoryId || target.id || "", categoryName: target.name, categorySlug: item.categoryId || target.id || target.name } : item);
          })) : fetchServiceListings().then((items) => [items]),
          Promise.all(targets.filter((target) => target.id).map(async (target) => {
            try { return { id: target.id, services: await fetchCategoryServices(target.id) }; } catch { return null; }
          })),
        ]);
        if (!active) return;
        setListings([...new Map(collections.flat().map((item) => [item.id, item])).values()]);
        const updates = serviceUpdates.filter((update) => update?.services.length);
        if (updates.length) setCategories((current) => current.map((category) => {
          const update = updates.find((entry) => entry.id === category.id);
          return update ? { ...category, services: update.services } : category;
        }));
      } catch {
        if (active) { setListings([]); setError(true); }
      } finally { if (active) setLoading(false); }
    });
    return () => { active = false; };
  }, [router.isReady, categoryLoading, requestKey, selectionKey]);
  const search = typeof router.query.q === "string" ? router.query.q : "";
  const location = typeof router.query.location === "string" ? router.query.location : "";
  const maxPrice = typeof router.query.maxPrice === "string" ? router.query.maxPrice : "";
  const page = Math.max(1, Math.floor(Number(router.query.page)) || 1);

  const updateFilters = (changes, replace = false) => {
    const query = { ...router.query, page: undefined, ...changes };
    Object.keys(query).forEach((key) => { if (query[key] === undefined || query[key] === "" || (Array.isArray(query[key]) && !query[key].length)) delete query[key]; });
    void router[replace ? "replace" : "push"]({ pathname: "/marketplace", query }, undefined, { shallow: true, scroll: false });
  };
  const categoryValues = selectedCategories.map((value) => groups.find((group) => group.ids.includes(value))?.key || categoryKey(value));
  const serviceValues = selectedServices.map((value) => groups.flatMap((group) => group.services).find((service) => service.ids.includes(value))?.key || serviceKey(value));
  const sidebarGroups = categoryValues.length ? groups.filter((group) => categoryValues.includes(group.key)) : groups;
  const bannerOptions = groups.flatMap((group) => [
    { key: group.key, label: group.name, group: group.name, category: group.key, service: "", isCategory: true },
    ...group.services.map((service) => ({ key: `${group.key}::${service.key}`, label: service.name, group: group.name, category: group.key, service: service.key })),
  ]);
  const bannerValue = search || (selectedServices.length === 1
    ? bannerOptions.find((option) => option.service === serviceValues[0] && (!categoryValues.length || categoryValues.includes(option.category)))
    : selectedCategories.length === 1 && !selectedServices.length ? bannerOptions.find((option) => option.isCategory && option.category === categoryValues[0]) : null);
  const toggleCategory = (key) => updateFilters({ categoryId: undefined, category: categoryValues.includes(key) ? categoryValues.filter((value) => value !== key) : [...categoryValues, key], serviceId: undefined, service: undefined });
  const toggleService = (key) => updateFilters({ serviceId: undefined, service: serviceValues.includes(key) ? serviceValues.filter((value) => value !== key) : [...serviceValues, key] });
  const reset = () => { setServiceSearch(""); void router.push("/marketplace", undefined, { shallow: true, scroll: false }); };

  const filtered = listings.filter((item) => {
    const query = search.trim().toLowerCase();
    return (!query || `${item.service} ${item.serviceName} ${item.categoryName} ${item.description}`.toLowerCase().includes(query))
      && matchesMarketplaceCategory(item, selectedCategories, groups)
      && matchesMarketplaceService(item, selectedServices, groups)
      && (!location.trim() || `${item.city} ${item.dynamicData?.country || ""}`.toLowerCase().includes(location.trim().toLowerCase()))
      && (!maxPrice || item.priceValue <= Number(maxPrice));
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visible = loading ? [] : filtered.slice((activePage - 1) * pageSize, activePage * pageSize);
  const hasFilters = Boolean(selectedCategories.length || selectedServices.length || search || location || maxPrice);
  const chips = [
    ...selectedCategories.map((value, index) => ({ key: `category-${value}`, label: groups.find((group) => group.key === categoryValues[index])?.name || value, remove: () => updateFilters({ categoryId: undefined, category: selectedCategories.filter((entry) => entry !== value) }) })),
    ...selectedServices.map((value, index) => ({ key: `service-${value}`, label: groups.flatMap((group) => group.services).find((service) => service.key === serviceValues[index])?.name || value, remove: () => updateFilters({ serviceId: undefined, service: selectedServices.filter((entry) => entry !== value) }) })),
  ];
  const pageButtonClass = "flex h-10 min-w-10 items-center justify-center rounded-full border text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-12 pt-[88px]">
      <section aria-labelledby="marketplace-heading" className="relative isolate bg-[#111a4f]">
        <Image src="/images/marketplace-banner.png" alt="" fill preload sizes="100vw" className="-z-20 object-cover object-center opacity-50" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#101a46]/60 via-[#172454]/40 to-[#111a4f]/90" />
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-7xl items-center gap-2 px-4 pt-5 text-xs text-blue-100 sm:px-6 lg:px-8"><Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-semibold text-white">Explore Services</span></nav>
        <div className="mx-auto max-w-4xl px-4 pb-9 pt-6 text-center sm:px-6 sm:pb-10 sm:pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-200">Support for your next chapter</p>
          <h1 id="marketplace-heading" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">Explore Services</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-blue-100">From your first question to your next move, find services that fit your plans.</p>
          <MarketplaceSearch key={JSON.stringify([search, categoryValues, serviceValues])} options={bannerOptions} value={bannerValue || null} loading={categoryLoading} onSelect={(option) => updateFilters({ categoryId: undefined, category: option?.category, serviceId: undefined, service: option?.service, q: undefined })} onSearch={(value) => updateFilters({ q: value.trim(), serviceId: undefined, service: undefined })} />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 pt-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside aria-label="Filter services" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4"><h2 className="flex items-center gap-2 font-semibold text-slate-900"><TuneRoundedIcon aria-hidden="true" sx={{ fontSize: 19, color: "#1f2a77" }} />Filters</h2><button type="button" onClick={reset} className="min-h-9 text-xs font-semibold text-blue-700 hover:text-blue-900">Clear all</button></div>
          <a href="#marketplace-results" className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 text-xs font-semibold text-[#1f2a77] lg:hidden">View matching services<ChevronRightRoundedIcon aria-hidden="true" sx={{ fontSize: 17 }} /></a>
          <fieldset className="mt-6 border-t border-slate-100 pt-4">
            <legend className="px-1 text-xs font-semibold text-slate-800">Categories</legend>
            {categoryLoading && <p role="status" className="mb-2 text-xs text-slate-400">Updating services…</p>}
            <div data-marketplace-categories className="space-y-0.5">{groups.map((group) => <FilterCheckbox key={group.key} label={group.name} checked={categoryValues.includes(group.key)} onChange={() => toggleCategory(group.key)} />)}</div>
          </fieldset>

          <fieldset className="mt-6 border-t border-slate-100 pt-4">
            <legend className="px-1 text-xs font-semibold text-slate-800">Services</legend>
            <label className="sr-only" htmlFor="filter-service-search">Find a service filter</label>
            <input id="filter-service-search" value={serviceSearch} onChange={(event) => setServiceSearch(event.target.value)} placeholder="Find a service…" className={`${inputClass} mb-3`} />
            <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
              {sidebarGroups.map((group) => {
                const services = group.services.filter((service) => `${service.name} ${group.name}`.toLowerCase().includes(serviceSearch.trim().toLowerCase()));
                if (!services.length) return null;
                return <div key={group.key}><p className="mb-1 px-2 text-[10px] font-bold uppercase leading-5 tracking-wide text-slate-400">{group.name}</p>{services.map((service) => <FilterCheckbox key={service.key} label={service.name} checked={serviceValues.includes(service.key)} onChange={() => toggleService(service.key)} />)}</div>;
              })}
              {!sidebarGroups.some((group) => group.services.some((service) => `${service.name} ${group.name}`.toLowerCase().includes(serviceSearch.trim().toLowerCase()))) && <p className="px-2 text-xs text-slate-500">No service filters found.</p>}
            </div>
          </fieldset>

          <div className="mt-6 border-t border-slate-100 pt-4"><label className="block text-xs font-semibold text-slate-700" htmlFor="service-location">Location</label><input id="service-location" value={location} onChange={(event) => updateFilters({ location: event.target.value }, true)} placeholder="City or country" className={inputClass} /></div>
          <label className="mt-5 block text-xs font-semibold text-slate-700" htmlFor="service-price">Maximum price</label><input id="service-price" type="number" min="0" value={maxPrice} onChange={(event) => updateFilters({ maxPrice: event.target.value }, true)} placeholder="Any price" className={inputClass} />
        </aside>

        <section id="marketplace-results" aria-label="Service listings" aria-busy={loading} className="min-h-[480px] min-w-0 scroll-mt-28">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900">{hasFilters ? "Matching services" : "Services for your plans"}</h2><p role="status" aria-live="polite" className="text-xs text-slate-500">{loading ? "Loading services..." : `Showing ${filtered.length ? (activePage - 1) * pageSize + 1 : 0}–${Math.min(activePage * pageSize, filtered.length)} of ${filtered.length} services`}</p></div>
          {hasFilters && <div className="mb-5 flex flex-wrap items-center gap-2">{chips.map((chip) => <button key={chip.key} type="button" onClick={chip.remove} aria-label={`Remove ${chip.label} filter`} className="inline-flex min-h-8 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-[#1f2a77]">{chip.label}<CloseRoundedIcon aria-hidden="true" sx={{ fontSize: 14 }} /></button>)}<button type="button" onClick={reset} className="min-h-8 px-2 text-xs font-semibold text-blue-700">Clear all filters</button></div>}
          {error && <p role="alert" className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm text-red-700">Services could not be loaded. Please try again later.</p>}
          {!loading && !error && !visible.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><h3 className="font-semibold text-slate-900">No services match your filters</h3><p className="mt-2 text-sm text-slate-500">Try another service, location or price range.</p><button type="button" onClick={reset} className="mt-5 rounded-xl bg-[#1f2a77] px-5 py-3 text-xs font-semibold text-white">Clear filters</button></div>}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {loading && Array.from({ length: 6 }, (_, index) => <div key={`loading-${index}`} aria-hidden="true" className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white motion-reduce:animate-none"><div className="aspect-[16/10] bg-slate-200/70" /><div className="space-y-4 p-4"><div className="h-2.5 w-20 rounded bg-slate-100" /><div className="h-4 w-3/4 rounded bg-slate-200" /><div className="h-12 rounded bg-slate-100" /><div className="h-4 w-1/2 rounded bg-slate-100" /></div></div>)}
            {visible.map((item) => <Link key={item.id} href={`/marketplace/${item.detailSlug}`} data-marketplace-listing={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md">
              <div className="relative aspect-[16/10] bg-slate-100"><Image src={item.image} alt="" fill unoptimized className="object-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} /></div>
              <div className="p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">{item.categoryName}</p><h3 className="mt-2 line-clamp-2 min-h-12 font-semibold text-slate-900">{item.service}</h3><p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-600">{item.description || "Explore this service and its details."}</p><div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs"><span className="text-slate-500">{item.city}</span><strong className="text-blue-700">{item.priceLabel}</strong></div></div>
            </Link>)}
          </div>
          {!loading && !error && totalPages > 1 && <nav aria-label="Service pages" className="mt-8 flex items-center justify-center gap-2">
            <button type="button" aria-label="Previous page" disabled={activePage === 1} onClick={() => updateFilters({ page: activePage - 1 })} className={`${pageButtonClass} border-slate-200 bg-white text-[#1f2a77] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-35`}><ChevronLeftRoundedIcon aria-hidden="true" sx={{ fontSize: 20 }} /></button>
            {paginationItems(activePage, totalPages).map((number) => typeof number === "number" ? <button key={number} type="button" aria-label={`Page ${number}`} aria-current={number === activePage ? "page" : undefined} onClick={() => updateFilters({ page: number })} className={`${pageButtonClass} ${number === activePage ? "border-[#1f2a77] bg-[#1f2a77] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"}`}>{number}</button> : <span key={number} aria-hidden="true" className="px-0.5 text-sm text-slate-400">…</span>)}
            <button type="button" aria-label="Next page" disabled={activePage === totalPages} onClick={() => updateFilters({ page: activePage + 1 })} className={`${pageButtonClass} border-slate-200 bg-white text-[#1f2a77] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-35`}><ChevronRightRoundedIcon aria-hidden="true" sx={{ fontSize: 20 }} /></button>
          </nav>}
        </section>
      </div>
    </main>
  );
}
