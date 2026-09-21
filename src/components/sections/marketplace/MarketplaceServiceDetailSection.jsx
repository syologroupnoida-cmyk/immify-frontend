import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StudyAbroadServiceEnquiryModal from "./StudyAbroadServiceEnquiryModal";
import { fetchServiceListingById, fetchServiceListings, serviceListingFallbackImage } from "@/util/serviceListings";

function labelFromKey(value) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function displayValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return Object.values(value).filter(Boolean).join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value ?? "");
}

export default function MarketplaceServiceDetailSection() {
  const router = useRouter();
  const id = typeof router.query.slug === "string" && router.query.slug.startsWith("listing-")
    ? router.query.slug.slice(8) : "";
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedListings, setRelatedListings] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    let active = true;
    if (!id) {
      queueMicrotask(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }
    fetchServiceListingById(id)
      .then((item) => { if (active) setListing(item); })
      .catch(() => { if (active) setListing(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, router.isReady]);

  useEffect(() => {
    if (!listing?.categoryName) return undefined;
    let active = true;
    queueMicrotask(() => setRelatedLoading(true));
    fetchServiceListings({ categoryName: listing.categoryName })
      .then((items) => {
        if (active) setRelatedListings(items.filter((item) => item.id !== listing.id).slice(0, 4));
      })
      .catch(() => { if (active) setRelatedListings([]); })
      .finally(() => { if (active) setRelatedLoading(false); });
    return () => { active = false; };
  }, [listing?.categoryName, listing?.id]);

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          <ArrowBackRoundedIcon className="h-4 w-4" /> Back to Marketplace
        </Link>
        {loading ? <p className="py-20 text-center text-slate-600">Loading service...</p> : !listing ? (
          <p className="py-20 text-center text-slate-600">This service is unavailable.</p>
        ) : (<>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-200">
                <Image src={listing.image} alt={listing.title} fill unoptimized sizes="(min-width: 1024px) 800px, 100vw" className="object-cover"
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} />
              </div>
              <p className="mt-7 text-xs font-semibold uppercase text-blue-700">{listing.categoryName}</p>
              <h1 className="mt-2 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">{listing.title}</h1>
              {listing.serviceName && listing.serviceName !== listing.title && <p className="mt-2 text-base font-medium text-slate-700">{listing.serviceName}</p>}
              {listing.city && <p className="mt-2 text-sm text-slate-500">{listing.city}</p>}
              <div className="mt-7 border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-900">About this service</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.description || "Contact the provider for more details about this service."}</p>
                {listing.serviceDescription && listing.serviceDescription !== listing.description && <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.serviceDescription}</p>}
                {listing.categoryDescription && listing.categoryDescription !== listing.description && <p className="mt-3 text-sm leading-7 text-slate-500">Category: {listing.categoryDescription}</p>}
              </div>
              {listing.overview && listing.overview !== listing.description && (
                <section className="mt-7 border-t border-slate-200 pt-6">
                  <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.overview}</p>
                </section>
              )}
              {Array.isArray(listing.includes) && listing.includes.length > 0 && (
                <div className="mt-7 border-t border-slate-200 pt-6">
                  <h2 className="text-lg font-semibold text-slate-900">What is included</h2>
                  <ul className="mt-4 space-y-3">
                    {listing.includes.map((item, index) => <li key={index} className="flex gap-2 text-sm text-slate-700"><CheckCircleOutlineRoundedIcon className="h-5 w-5 shrink-0 text-teal-700" />{typeof item === "string" ? item : item?.name || item?.title || "Included service"}</li>)}
                  </ul>
                </div>
              )}
              {listing.process && <section className="mt-7 border-t border-slate-200 pt-6"><h2 className="text-lg font-semibold text-slate-900">How it works</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.process}</p></section>}
              {Object.keys(listing.dynamicData || {}).length > 0 && (
                <section className="mt-7 border-t border-slate-200 pt-6">
                  <h2 className="text-lg font-semibold text-slate-900">Service details</h2>
                  <dl className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white">
                    {Object.entries(listing.dynamicData).filter(([, value]) => value !== null && value !== "").map(([key, value]) => <div key={key} className="grid grid-cols-[minmax(120px,35%)_1fr] gap-4 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0"><dt className="font-semibold text-slate-700">{labelFromKey(key)}</dt><dd className="text-slate-600">{displayValue(value)}</dd></div>)}
                  </dl>
                </section>
              )}
              {listing.pricingDetails && <section className="mt-7 border-t border-slate-200 pt-6"><h2 className="text-lg font-semibold text-slate-900">Pricing details</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.pricingDetails}</p></section>}
              {listing.termsAndConditions && <section className="mt-7 border-t border-slate-200 pt-6"><h2 className="text-lg font-semibold text-slate-900">Terms and conditions</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.termsAndConditions}</p></section>}
            </article>
            {listing.categoryName === "Study Abroad Services" ? (
              <aside className="self-start lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                  <h2 className="bg-[#203b46] px-5 py-4 text-center font-serif text-xl font-bold text-white">Get Started Now</h2>
                  <div className="p-5 text-center">
                    <h3 className="font-serif text-base font-bold text-slate-900">We Guide You to Choose the Best College</h3>
                    <p className="mt-2 text-sm text-slate-600">Explore, compare &amp; secure your future today.</p>
                    <a href="tel:+919540237575" className="mt-6 block rounded border border-blue-700 px-4 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50">Call Expert Now</a>
                    <button type="button" onClick={() => setQuoteOpen(true)} className="mt-3 w-full rounded bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">Enquire Now</button>
                    <button type="button" onClick={() => setQuoteOpen(true)} className="mt-3 w-full rounded bg-rose-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600">Apply Now</button>
                  </div>
                </div>
              </aside>
            ) : (
              <aside className="self-start rounded-lg border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
                <p className="text-sm text-slate-500">Service price</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{listing.priceLabel}</p>
                <p className="mt-2 text-xs text-slate-500">{listing.chargesIncludeGst ? "GST included" : "GST may be charged separately"}</p>
                {listing.vendor && <div className="mt-6 border-t border-slate-100 pt-5"><p className="text-xs font-semibold uppercase text-slate-500">Service provider</p><div className="mt-3 flex items-center gap-3">{listing.vendor.avatarUrl ? <Image src={listing.vendor.avatarUrl} alt="" width={44} height={44} unoptimized className="h-11 w-11 rounded-full object-cover" /> : <AccountCircleOutlinedIcon className="h-11 w-11 text-slate-300" />}<div><p className="font-semibold text-slate-900">{[listing.vendor.firstName, listing.vendor.lastName].filter(Boolean).join(" ") || "Verified provider"}</p><p className="text-xs text-slate-500">Verified service partner</p></div></div></div>}
                <Link href="/lead-generation" className="mt-6 flex min-h-11 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">Get a free quote</Link>
              </aside>
            )}
          </div>
          <section className="mt-14 border-t border-slate-200 pt-9" aria-labelledby="related-services-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-xs font-semibold uppercase text-blue-700">You may also need</p><h2 id="related-services-heading" className="mt-2 text-2xl font-bold text-slate-900">Related {listing.categoryName}</h2></div>
              <Link href={{ pathname: "/", query: { serviceCategory: listing.categoryName } }} className="text-sm font-semibold text-blue-700 hover:text-blue-900">View all services</Link>
            </div>
            {relatedLoading ? <p className="py-10 text-center text-sm text-slate-500">Loading related services...</p> : relatedListings.length ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedListings.map((item) => <Link key={item.id} href={`/marketplace/${item.detailSlug}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100"><Image src={item.image} alt={item.title} fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-300 group-hover:scale-105" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} /></div>
                  <div className="p-4"><p className="text-xs font-semibold uppercase text-blue-700">{item.serviceName}</p><h3 className="mt-2 line-clamp-2 min-h-12 font-semibold text-slate-900">{item.title}</h3><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="font-semibold text-slate-900">{item.priceLabel}</span><ArrowForwardRoundedIcon className="h-5 w-5 text-blue-700" /></div></div>
                </Link>)}
              </div>
            ) : <p className="py-10 text-sm text-slate-500">No other services are available in this category right now.</p>}
          </section>
        </>)}
      </div>
      {listing?.categoryName === "Study Abroad Services" && <StudyAbroadServiceEnquiryModal open={quoteOpen} onClose={() => setQuoteOpen(false)} listing={listing} />}
    </main>
  );
}
