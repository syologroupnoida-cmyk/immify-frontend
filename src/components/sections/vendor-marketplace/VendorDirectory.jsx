import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Pagination from '@mui/material/Pagination';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PortalHero from '@/components/common/PortalHero';
import PortalFaqs from '@/components/common/PortalFaqs';
import { fetchDirectoryCategories, fetchDirectoryPage, shortVendorName } from '@/util/vendorDirectory';

const TAKE = 20;

export default function VendorDirectory() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState(null);
  const cityTimer = useRef(null);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryRetry, setCategoryRetry] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    const initialCategory = typeof router.query.category === 'string' ? router.query.category : '';
    const initialCity = typeof router.query.location === 'string' ? router.query.location : '';
    queueMicrotask(() => {
      setCategory(initialCategory);
      setCity(initialCity);
      setFilters((current) => ({ search: current?.search || '', city: initialCity, category: initialCategory }));
      setPage(0);
    });
  }, [router.isReady, router.query.category, router.query.location]);

  useEffect(() => () => clearTimeout(cityTimer.current), []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) { setCategoriesLoading(true); setCategoryError(false); } });
    fetchDirectoryCategories().then((items) => { if (active) setCategories(items); })
      .catch(() => { if (active) setCategoryError(true); })
      .finally(() => { if (active) setCategoriesLoading(false); });
    return () => { active = false; };
  }, [categoryRetry]);

  useEffect(() => {
    if (!router.isReady || !filters) return undefined;
    let active = true;
    queueMicrotask(() => { if (active) { setLoading(true); setError(''); } });
    fetchDirectoryPage({ take: TAKE, skip: page * TAKE, ...filters })
      .then((data) => { if (active) setResult(data); })
      .catch((err) => { if (active) { setResult({ items: [], total: 0 }); setError(err?.response?.data?.message || err.message || 'Unable to load providers.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [router.isReady, filters, page, retry]);

  const removeFilter = (field) => {
    if (field === 'city') { clearTimeout(cityTimer.current); setCity(''); }
    if (field === 'category') setCategory('');
    setPage(0);
    setFilters((current) => ({ ...current, [field]: '' }));
    if (router.query.category || router.query.location) {
      const query = { ...router.query };
      if (field === 'category') delete query.category;
      if (field === 'city') delete query.location;
      if (field !== 'category' && category) query.category = category;
      if (field !== 'city' && city.trim()) query.location = city.trim();
      void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
    }
  };

  const pages = Math.max(1, Math.ceil(result.total / TAKE));
  return <main className="min-h-screen bg-[#f6f8fb] pb-12 pt-[88px]">
    <PortalHero heading="Discover Providers for Your Global Plans" label="Provider Directory" description="Find the right expertise for your next chapter. Compare providers by service and location.">
      <form onSubmit={(event) => { event.preventDefault(); setPage(0); setFilters({ search: search.trim(), city: city.trim(), category: category.trim() }); }} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input aria-label="Search providers" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search provider or service" className="h-12 min-w-0 rounded-md border border-slate-200 bg-white px-4 text-sm outline-blue-600" />
        <button className="h-12 rounded-md bg-orange-600 px-6 text-sm font-bold text-white hover:bg-orange-700">Search</button>
      </form>
    </PortalHero>
    <section className="mx-auto w-[calc(100%-32px)] max-w-[1280px] py-8 sm:w-[calc(100%-48px)] lg:w-[calc(100%-64px)]">
      {typeof router.query.country === 'string' && router.query.country && <p role="status" className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Country filtering is not available in the provider directory. Use search or city to narrow the results.</p>}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900">Providers {!loading && !error && <span className="text-sm font-medium text-slate-500">({result.total})</span>}</h2></div>
      <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="text-base font-bold text-slate-900">Filters</h2><button type="button" onClick={() => { clearTimeout(cityTimer.current); setSearch(''); setCity(''); setCategory(''); setFilters({ search: '', city: '', category: '' }); setPage(0); void router.replace(router.pathname, undefined, { shallow: true, scroll: false }); }} className="text-sm font-semibold text-blue-700 hover:text-blue-900">Clear filters</button></div><form onSubmit={(event) => { event.preventDefault(); setPage(0); setFilters({ search: search.trim(), city: city.trim(), category: category.trim() }); }} className="mt-4 space-y-4"><label className="block text-sm font-semibold text-slate-700">City<input value={city} onChange={(event) => { const value = event.target.value; setCity(value); clearTimeout(cityTimer.current); cityTimer.current = setTimeout(() => { setPage(0); setFilters((current) => ({ ...(current || { search: '', category: '' }), city: value.trim() })); }, 350); }} placeholder="Enter city" className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-blue-600" /></label><fieldset><legend className="text-sm font-semibold text-slate-700">Categories</legend><p className="mt-1 text-xs text-slate-500">Select one category, or leave all unchecked.</p>{categoriesLoading ? <p className="mt-2 text-xs text-slate-500">Loading categories...</p> : categoryError ? <p className="mt-2 text-xs text-red-700">Unable to load categories. <button type="button" onClick={() => setCategoryRetry((value) => value + 1)} className="underline">Retry</button></p> : <div className="mt-2 space-y-1">{categories.map((name) => <label key={name} className="flex items-start gap-2 py-1 text-sm text-slate-700"><input type="checkbox" className="mt-1 shrink-0" checked={category === name} onChange={() => { const next = category === name ? '' : name; setCategory(next); setPage(0); setFilters((current) => ({ ...(current || { search: '', city: '' }), category: next })); }} /><span>{name}</span></label>)}</div>}</fieldset><button className="w-full rounded-md bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">Apply filters</button></form></aside>
      <div>
      {(filters?.city || filters?.category) && <div aria-label="Active filters" className="mb-4 flex flex-wrap gap-2">{['city', 'category'].map((field) => filters[field] && <button key={field} type="button" onClick={() => removeFilter(field)} aria-label={`Remove ${field} filter: ${filters[field]}`} className="inline-flex min-h-8 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-[#1f2a77] hover:bg-blue-100">{filters[field]}<CloseRoundedIcon aria-hidden="true" sx={{ fontSize: 15 }} /></button>)}</div>}
      {loading ? <p role="status" className="rounded-xl bg-white p-8 text-center text-slate-600">Loading providers...</p> : error ? <div role="alert" className="rounded-xl bg-white p-8 text-center text-slate-700"><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-blue-700 underline">Retry</button></div> : result.items.length ? <div className="space-y-4">{result.items.map((vendor) => <article key={vendor.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/providers/${encodeURIComponent(vendor.id)}`} title={vendor.companyName || 'Provider'} aria-label={`View ${vendor.companyName || 'provider'} details`} className="text-lg font-bold text-slate-900 hover:text-blue-700">{shortVendorName(vendor.companyName)}</Link><p className="mt-1 text-sm text-slate-600">{vendor.category || 'Service provider'}</p></div>{vendor.rating != null && <span className="rounded-md bg-emerald-600 px-2 py-1 text-sm font-bold text-white">★ {Number(vendor.rating).toFixed(1)} {vendor.reviewCount != null && <span className="font-normal">({vendor.reviewCount})</span>}</span>}</div>
        {(vendor.city || vendor.state) && <p className="mt-3 text-sm text-slate-600">{[vendor.city, vendor.state].filter(Boolean).join(', ')}</p>}
        <div className="mt-4 flex flex-wrap gap-2"><Link href={`/providers/${encodeURIComponent(vendor.id)}`} className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">View details</Link>{vendor.phone && <a href={`tel:${vendor.phone}`} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">{vendor.phone}</a>}</div>
      </article>)}</div> : <p className="rounded-xl bg-white p-8 text-center text-slate-600">No providers found.</p>}
      {!loading && !error && pages > 1 && <nav aria-label="Provider pages" className="mt-6 flex justify-center"><Pagination count={pages} page={page + 1} onChange={(_, next) => setPage(next - 1)} color="primary" siblingCount={1} boundaryCount={1} /></nav>}
      </div></div>
    </section>
    <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6"><PortalFaqs pageKey="providers" /></div>
  </main>;
}
