import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { fetchServiceListingById, serviceListingFallbackImage } from "@/util/serviceListings";

export default function MarketplaceServiceDetailSection() {
  const router = useRouter();
  const id = typeof router.query.slug === "string" && router.query.slug.startsWith("listing-")
    ? router.query.slug.slice(8) : "";
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
          <ArrowBackRoundedIcon className="h-4 w-4" /> Back to Marketplace
        </Link>
        {loading ? <p className="py-20 text-center text-slate-600">Loading service...</p> : !listing ? (
          <p className="py-20 text-center text-slate-600">This service is unavailable.</p>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article>
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-slate-200">
                <img src={listing.image} alt="" className="h-full w-full object-cover"
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} />
              </div>
              <p className="mt-7 text-xs font-semibold uppercase text-blue-700">{listing.categoryName}</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{listing.service}</h1>
              {listing.city && <p className="mt-2 text-sm text-slate-500">{listing.city}</p>}
              <div className="mt-7 border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-900">About this service</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{listing.description || "Contact the provider for more details about this service."}</p>
              </div>
              {Array.isArray(listing.includes) && listing.includes.length > 0 && (
                <div className="mt-7 border-t border-slate-200 pt-6">
                  <h2 className="text-lg font-semibold text-slate-900">What is included</h2>
                  <ul className="mt-4 space-y-3">
                    {listing.includes.map((item, index) => <li key={index} className="flex gap-2 text-sm text-slate-700"><CheckCircleOutlineRoundedIcon className="h-5 w-5 shrink-0 text-teal-700" />{typeof item === "string" ? item : item?.name || item?.title || "Included service"}</li>)}
                  </ul>
                </div>
              )}
            </article>
            <aside className="self-start rounded-lg border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
              <p className="text-sm text-slate-500">Service price</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{listing.priceLabel}</p>
              <Link href="/#free-quote" className="mt-6 flex min-h-11 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">Get a free quote</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
