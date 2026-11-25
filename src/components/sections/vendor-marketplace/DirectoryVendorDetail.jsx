import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageSeo from '@/components/common/PageSeo';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { fetchDirectoryPage, fetchDirectoryVendor, safeExternalUrl, shortVendorName } from '@/util/vendorDirectory';

function RelatedVendors({ vendor }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!vendor.category) return undefined;
    let active = true;
    queueMicrotask(() => { if (active) { setLoading(true); setError(false); } });
    fetchDirectoryPage({ take: 5, skip: 0, category: vendor.category })
      .then((data) => { if (active) setItems(data.items.filter((item) => item.id && item.id !== vendor.id).slice(0, 4)); })
      .catch(() => { if (active) { setItems([]); setError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [vendor.id, vendor.category, retry]);

  return <section className="mt-10">
    <h2 className="text-center text-xl font-bold text-[#0c1b49] sm:text-2xl">Related vendors</h2>
    {!vendor.category ? <p className="mt-4 text-sm text-slate-600">No category is available for this provider.</p> : loading ? <p role="status" className="mt-4 text-sm text-slate-600">Loading related vendors...</p> : error ? <p role="alert" className="mt-4 text-sm text-red-700">Unable to load related vendors. <button type="button" onClick={() => setRetry((value) => value + 1)} className="font-semibold underline">Retry</button></p> : items.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <Link key={item.id} href={`/providers/${encodeURIComponent(item.id)}`} aria-label={`View ${item.companyName || 'provider'} details`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md">
      <div aria-hidden="true" className="h-28 bg-[#06265f] bg-[url('/images/provider-directory-banner.png')] bg-cover bg-center" />
      <div className="p-4"><p className="text-xs font-semibold text-blue-700">{item.category || 'Service provider'}</p><h3 title={item.companyName || 'Provider'} className="mt-2 text-sm font-bold text-slate-900 group-hover:text-blue-700">{shortVendorName(item.companyName)}</h3>{(item.city || item.state) && <p className="mt-2 text-xs text-slate-600">{[item.city, item.state].filter(Boolean).join(', ')}</p>}{item.rating != null && <p className="mt-2 text-xs font-semibold text-slate-700">★ {Number(item.rating).toFixed(1)}{item.reviewCount != null ? ` · ${item.reviewCount} reviews` : ''}</p>}<span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700">View details <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} /></span></div>
    </Link>)}</div> : <p className="mt-4 text-sm text-slate-600">No related vendors found.</p>}
  </section>;
}

export default function DirectoryVendorDetail({ id }) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!id) return undefined;
    let active = true;
    queueMicrotask(() => { if (active) { setLoading(true); setVendor(null); setError(''); } });
    fetchDirectoryVendor(id).then((data) => { if (active) setVendor(data); })
      .catch((err) => { if (active) setError(err?.response?.status === 404 ? 'Provider not found.' : err?.response?.data?.message || err.message || 'Unable to load provider.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, retry]);

  const website = safeExternalUrl(vendor?.websiteUrl);
  const maps = safeExternalUrl(vendor?.googleMapsUrl);
  const details = [
    { label: 'Category', value: vendor?.category, icon: <LayersOutlinedIcon /> },
    { label: 'City', value: vendor?.city, icon: <LocationOnOutlinedIcon /> },
    { label: 'Phone', value: vendor?.phone, icon: <CallRoundedIcon />, phone: true },
    { label: 'Address', value: vendor?.address, icon: <LocationOnOutlinedIcon /> },
    { label: 'State or Region', value: vendor?.state, icon: <LanguageRoundedIcon /> },
    { label: 'Postal code', value: vendor?.pincode, icon: <LocationOnOutlinedIcon /> },
  ].filter((item) => item.value);
  return <main className="min-h-screen bg-[#f1f6fd] px-4 pb-12 pt-28 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <Link href="/providers" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900"><ArrowBackRoundedIcon sx={{ fontSize: 19 }} /> Back to providers</Link>
      {loading ? <p role="status" className="mt-5 rounded-2xl bg-white p-8 text-center text-slate-600">Loading provider...</p> : error ? <div role="alert" className="mt-5 rounded-2xl bg-white p-8 text-center"><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 font-semibold text-blue-700 underline">Retry</button></div> : vendor && <>
        <PageSeo title={`${vendor.companyName || 'Provider'} | Immify`} description={`View details for ${vendor.companyName || 'this provider'} on Immify.`} />
        <section className="relative mt-5 overflow-hidden rounded-[22px] bg-[#06265f] text-white">
          <div aria-hidden="true" className="absolute inset-0 bg-[url('/images/provider-directory-banner.png')] bg-cover bg-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#06245b] via-[#06245b]/90 to-[#06245b]/25" />
          <div className="relative flex min-h-[285px] flex-col justify-between gap-6 p-6 sm:p-9">
            <div><span className="inline-flex items-center gap-2 rounded-full bg-blue-700/80 px-3 py-1.5 text-xs font-semibold sm:text-sm"><GavelRoundedIcon sx={{ fontSize: 18 }} />{vendor.category || 'Service provider'}</span>
              <h1 className="mt-3 max-w-3xl break-words text-2xl font-bold leading-tight sm:text-4xl">{vendor.companyName || 'Provider'}</h1>
              {vendor.rating != null && <p className="mt-3 inline-flex items-center gap-1 text-base font-semibold"><StarRoundedIcon sx={{ color: '#ffc107', fontSize: 22 }} />{Number(vendor.rating).toFixed(1)}{vendor.reviewCount != null ? ` ? ${vendor.reviewCount} reviews` : ''}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {vendor.phone && <a href={`tel:${vendor.phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold hover:bg-green-700"><CallRoundedIcon sx={{ fontSize: 19 }} />Call {vendor.phone}</a>}
              {website && <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold hover:bg-blue-700"><OpenInNewRoundedIcon sx={{ fontSize: 19 }} />Visit website</a>}
              {maps && <a href={maps} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/80 bg-[#082859]/60 px-5 py-2.5 text-sm font-bold hover:bg-[#082859]"><LocationOnOutlinedIcon sx={{ fontSize: 19 }} />View on Google Maps</a>}
              <Link href="/lead-generation" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#09245e] hover:bg-blue-50 sm:ml-auto"><PeopleOutlineRoundedIcon sx={{ fontSize: 20, color: '#155eef' }} />Get a Free Consultation<ArrowForwardRoundedIcon sx={{ fontSize: 18, color: '#155eef' }} /></Link>
            </div>
          </div>
        </section>
        <section className="mt-5 rounded-[22px] border border-[#dce6f4] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-3 border-b border-slate-200 pb-3 text-xl font-bold text-[#0c1b49] sm:text-2xl"><InfoOutlinedIcon sx={{ color: '#075bf5', fontSize: 28 }} />Provider details</h2>
          <dl className="mt-4 grid gap-x-10 gap-y-4 sm:grid-flow-col sm:grid-rows-3 sm:grid-cols-2">{details.map((item) => <div key={item.label} className="flex min-w-0 items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf1fb] text-[#0755c9]">{item.icon}</span><div className="min-w-0"><dt className="text-sm font-bold text-[#0c1b49]">{item.label}</dt><dd className="mt-0.5 break-words text-sm text-[#17254c]">{item.phone ? <a className="font-semibold text-blue-700" href={`tel:${item.value}`}>{item.value}</a> : item.value}</dd></div></div>)}</dl>
        </section>
        <section className="mt-5 rounded-[22px] border border-[#dce6f4] bg-white p-6 shadow-sm sm:p-8"><h2 className="flex items-center gap-3 border-b border-slate-200 pb-3 text-xl font-bold text-[#0c1b49] sm:text-2xl"><DescriptionOutlinedIcon sx={{ color: '#0755c9', fontSize: 28 }} />About {vendor.companyName || 'this provider'}</h2><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{vendor.description || 'No description provided.'}</p></section>
        <RelatedVendors key={vendor.id} vendor={vendor} />
      </>}
    </div>
  </main>;
}
