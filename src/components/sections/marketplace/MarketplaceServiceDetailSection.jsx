import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
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
  const routeSlug = typeof router.query.slug === "string" ? router.query.slug : "";
  const id = routeSlug.startsWith("listing-") ? routeSlug.slice(8) : routeSlug;
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
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <article>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                <div className="relative aspect-[16/8.5] overflow-hidden bg-slate-200">
                  <Image src={listing.image} alt={listing.title} fill unoptimized sizes="(min-width: 1024px) 800px, 100vw" className="object-cover"
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">{listing.categoryName}</p>
                    <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight sm:text-4xl">{listing.title}</h1>
                    <p className="mt-2 text-sm font-medium text-white/85">{listing.description}</p>
                  </div>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-3">
                  <Metric icon={<BusinessCenterOutlinedIcon className="h-5 w-5 text-blue-700" />} label="Service" value={listing.serviceName || listing.service} />
                  <Metric icon={<LocationOnOutlinedIcon className="h-5 w-5 text-emerald-700" />} label="Location" value={listing.city || "Online"} />
                  <Metric icon={<ReceiptLongOutlinedIcon className="h-5 w-5 text-amber-600" />} label="Price" value={listing.priceLabel} />
                </div>

                <div className="space-y-7 border-t border-slate-100 p-5 sm:p-6">
                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Details</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">About this service</h2>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.description || "Contact the provider for more details about this service."}</p>
                    {listing.serviceDescription && listing.serviceDescription !== listing.description && <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.serviceDescription}</p>}
                    {listing.categoryDescription && listing.categoryDescription !== listing.description && <p className="mt-3 text-sm leading-7 text-slate-500">Category: {listing.categoryDescription}</p>}
                  </section>

                  {listing.overview && listing.overview !== listing.description && (
                    <section className="border-t border-slate-100 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Summary</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">Overview</h2>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.overview}</p>
                    </section>
                  )}

                  {Array.isArray(listing.includes) && listing.includes.length > 0 && (
                    <section className="border-t border-slate-100 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Inclusions</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">What is included</h2>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {listing.includes.map((item, index) => <li key={index} className="flex gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-slate-700"><CheckCircleOutlineRoundedIcon className="h-5 w-5 shrink-0 text-teal-700" />{typeof item === "string" ? item : item?.name || item?.title || "Included service"}</li>)}
                      </ul>
                    </section>
                  )}

                  {listing.process && (
                    <section className="border-t border-slate-100 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Process</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">How it works</h2>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.process}</p>
                    </section>
                  )}

                  {Object.keys(listing.dynamicData || {}).length > 0 && (
                    <section className="border-t border-slate-100 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Specifics</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">Service details</h2>
                      <dl className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white">
                        {Object.entries(listing.dynamicData).filter(([, value]) => value !== null && value !== "").map(([key, value]) => <div key={key} className="grid grid-cols-[minmax(120px,35%)_1fr] gap-4 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0"><dt className="font-semibold text-slate-700">{labelFromKey(key)}</dt><dd className="text-slate-600">{displayValue(value)}</dd></div>)}
                      </dl>
                    </section>
                  )}

                  {listing.pricingDetails && (
                    <section className="border-t border-slate-100 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Commercials</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">Pricing details</h2>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.pricingDetails}</p>
                    </section>
                  )}

                  {listing.termsAndConditions && (
                    <section className="border-t border-slate-100 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Important</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">Terms and conditions</h2>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.termsAndConditions}</p>
                    </section>
                  )}
                </div>
              </div>

              {listing.vendor && (
                <div className="mt-5">
                  <VendorCard vendor={listing.vendor} />
                </div>
              )}
            </article>
            {listing.categoryName === "Study Abroad Services" ? (
              <aside className="self-start lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                  <h2 className="bg-[#203b46] px-5 py-4 text-center font-serif text-xl font-bold text-white">Get Started Now</h2>
                  <div className="p-5 text-center">
                    <p className="text-sm text-slate-500">Service price</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{listing.priceLabel}</p>
                    <p className="mt-2 text-xs text-slate-500">{listing.chargesIncludeGst ? "GST included" : "GST may be charged separately"}</p>
                    <QuoteSummary listing={listing} />
                    <h3 className="font-serif text-base font-bold text-slate-900">We Guide You to Choose the Best College</h3>
                    <p className="mt-2 text-sm text-slate-600">Explore, compare &amp; secure your future today.</p>
                    <a href="tel:+919540237575" className="mt-6 block rounded border border-blue-700 px-4 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50">Call Expert Now</a>
                    <button type="button" onClick={() => setQuoteOpen(true)} className="mt-3 w-full rounded bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">Enquire Now</button>
                    <button type="button" onClick={() => setQuoteOpen(true)} className="mt-3 w-full rounded bg-rose-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600">Apply Now</button>
                  </div>
                </div>
              </aside>
            ) : (
              <aside className="self-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:sticky lg:top-24">
                <div className="bg-[#111a4f] p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Service price</p>
                  <p className="mt-2 text-3xl font-bold">{listing.priceLabel}</p>
                  <p className="mt-2 text-xs text-white/75">{listing.chargesIncludeGst ? "GST included" : "GST may be charged separately"}</p>
                </div>
                <div className="p-5">
                  <QuoteSummary listing={listing} />
                  <Link href={{ pathname: "/lead-generation", query: { service: listing.id, vendor: listing.vendor?.id || "" } }} className="mt-6 flex min-h-11 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">Get a free quote</Link>
                </div>
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

function Metric({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
      {icon}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-slate-900">{value || "Available"}</p>
      </div>
    </div>
  );
}

function QuoteSummary({ listing }) {
  return (
    <div className="my-5 grid gap-3 text-left">
      {[
        { label: "Service", value: listing.serviceName || listing.service || listing.title },
        { label: "Location", value: listing.city || "Online" },
        { label: "Price", value: listing.priceLabel },
      ].map((item) => (
        <div key={item.label} className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function VendorCard({ vendor }) {
  const vendorName = [vendor.firstName, vendor.lastName].filter(Boolean).join(" ") || "Verified provider";
  const vendorHref = vendor.id ? `/marketplace/vendors/${vendor.id}` : "/marketplace/vendors";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Service provider</p>
      <div className="mt-3 flex items-center gap-3">
        {vendor.avatarUrl ? <Image src={vendor.avatarUrl} alt="" width={48} height={48} unoptimized className="h-12 w-12 rounded-full object-cover" /> : <AccountCircleOutlinedIcon className="h-12 w-12 text-slate-300" />}
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{vendorName}</p>
          <p className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <VerifiedRoundedIcon className="h-4 w-4" />
            Verified service partner
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <VendorInfoTile label="Provider" value={vendorName} />
        <VendorInfoTile label="Status" value="Verified" />
        <VendorInfoTile label="Profile" value="Marketplace" />
      </div>
      <Link href={vendorHref} className="mt-4 flex min-h-10 items-center justify-center rounded-md border border-blue-200 px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        View vendor profile
      </Link>
    </div>
  );
}

function VendorInfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
