import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";
import {
  buildMarketplaceListings,
  structuredMarketplaceTabs,
} from "./marketplaceData";

const socialLinks = [
  { label: "Facebook", icon: FacebookRoundedIcon, href: "#" },
  { label: "X", icon: XIcon, href: "#" },
  { label: "LinkedIn", icon: LinkedInIcon, href: "#" },
  { label: "WhatsApp", icon: WhatsAppIcon, href: "#" },
];

const summaryCards = [
  { icon: VerifiedRoundedIcon, value: "98%", label: "Success Rate" },
  { icon: ShieldRoundedIcon, value: "15+", label: "Years Experience" },
  { icon: SupportAgentRoundedIcon, value: "24/7", label: "Support" },
  { icon: ShieldRoundedIcon, value: "Secure", label: "Data & Payments" },
];

const chooseUsCards = [
  { icon: VerifiedRoundedIcon, label: "Experienced Visa Experts" },
  { icon: ShieldRoundedIcon, label: "High Visa Success Rate" },
  { icon: CheckCircleRoundedIcon, label: "End-to-End Assistance" },
  { icon: SupportAgentRoundedIcon, label: "Transparent Process" },
  { icon: LanguageRoundedIcon, label: "Affordable Pricing" },
];

const extraGalleryImages = [
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1471623817296-aa07ae5c9f47?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1522098543979-ffc7f79d11f3?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1000&q=80",
];
const dummyServiceImage = "/images/services/service-detail-dummy.png";

function handleImageFallback(event) {
  if (event.currentTarget.src.includes(dummyServiceImage)) return;
  event.currentTarget.src = dummyServiceImage;
}

export default function MarketplaceServiceDetailSection() {
  const router = useRouter();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const listings = useMemo(() => buildMarketplaceListings(structuredMarketplaceTabs), []);

  const detailSlug = typeof router.query.slug === "string" ? router.query.slug : "";
  const listing = useMemo(
    () => listings.find((item) => item.detailSlug === detailSlug),
    [detailSlug, listings]
  );

  const sameCategoryItems = useMemo(() => {
    if (!listing) return [];
    return listings.filter((item) => item.categorySlug === listing.categorySlug);
  }, [listing, listings]);

  const galleryImages = useMemo(() => {
    if (!listing) return [];

    const fromCategory = sameCategoryItems.map((item) => item.image);
    const ordered = [listing.image, ...fromCategory.filter((image) => image !== listing.image)];

    return [...ordered, ...extraGalleryImages];
  }, [listing, sameCategoryItems]);

  const relatedListings = useMemo(() => {
    if (!listing) return [];

    return listings
      .filter((item) => item.categorySlug === listing.categorySlug && item.id !== listing.id)
      .slice(0, 4);
  }, [listing, listings]);

  const visibleThumbnails = galleryImages.slice(0, 6);
  const activeImage = galleryImages[activeGalleryIndex] || listing?.image || dummyServiceImage;

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Service not found</h1>
          <p className="mt-3 text-sm text-slate-600">This listing is unavailable right now. Please explore other marketplace services.</p>
          <Link href="/marketplace" className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Back to Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faff] px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>&gt;</span>
          <Link href="/marketplace" className="hover:text-blue-700">Marketplace</Link>
          <span>&gt;</span>
          <span>{listing.categoryName}</span>
          <span>&gt;</span>
          <span className="font-medium text-slate-700">{listing.service}</span>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-5">
            <div>
              <div className="relative mt-2 h-[220px] overflow-hidden rounded-xl sm:mt-3 sm:h-[320px]">
                <img src={activeImage} alt={listing.service} className="h-full w-full object-cover" onError={handleImageFallback} />
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white ${listing.badgeClass}`}>
                  {listing.badgeLabel}
                </span>
                <button type="button" aria-label="Add to wishlist" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm">
                  <FavoriteBorderRoundedIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-6">
                {visibleThumbnails.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveGalleryIndex(index)}
                    className={`overflow-hidden rounded-lg border ${
                      activeGalleryIndex === index ? "border-blue-500" : "border-slate-200"
                    }`}
                  >
                    <img src={image || dummyServiceImage} alt={`${listing.service} ${index + 1}`} className="h-12 w-full object-cover sm:h-14" onError={handleImageFallback} />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{listing.categoryLabel}</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-[40px] sm:leading-[1.12]">{listing.service} Package</h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                  <StarRoundedIcon className="h-4 w-4" />
                  {listing.rating}
                </span>
                <span>({listing.votes} Reviews)</span>
                <span>1250+ Happy Clients</span>
                <span className="inline-flex items-center gap-1">
                  <LocationOnOutlinedIcon className="h-4 w-4" />
                  {listing.city}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Complete visa assistance for your travel, work, and study needs. We manage documentation,
                appointment booking, and end-to-end submission guidance with a transparent process.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Icon className="h-4 w-4" />
                        <p className="text-sm font-semibold text-slate-900">{card.value}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{card.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                  <button type="button" className="border-b-2 border-blue-600 pb-2 text-blue-700">Overview</button>
                  <button type="button" className="pb-2 hover:text-slate-700">What&apos;s Included</button>
                  <button type="button" className="pb-2 hover:text-slate-700">Process</button>
                  <button type="button" className="pb-2 hover:text-slate-700">Requirements</button>
                  <button type="button" className="pb-2 hover:text-slate-700">FAQ&apos;s</button>
                  <button type="button" className="pb-2 hover:text-slate-700">Reviews</button>
                </div>

                <div className="mt-6 space-y-4 text-sm text-slate-600 sm:text-base">
                  <h2 className="text-lg font-semibold text-slate-900">About this service</h2>
                  <p>
                    This package is designed to simplify your application journey with expert support, document
                    verification, and timeline-based tracking from start to finish.
                  </p>
                  <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-600" />Expert guidance and profile review</li>
                      <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-600" />Document checklist and corrections</li>
                      <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-600" />Application form support and final audit</li>
                      <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-600" />Visa appointment and interview prep</li>
                      <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-600" />Post-submission response handling</li>
                    </ul>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                      <p className="text-sm font-semibold text-slate-900">Your Data is Safe</p>
                      <p className="mt-2 text-xs leading-6 text-slate-600">
                        We use secure completion workflows and confidential handling standards for your documents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-slate-200 bg-[#fbfdff] p-4 sm:p-5">
                <h3 className="text-base font-semibold text-slate-900">Why Choose Us?</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {chooseUsCards.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.label} className="rounded-xl border border-slate-100 bg-white px-3 py-3 text-center">
                        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-700">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">What Our Clients Say</h3>
                  <button type="button" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View All Reviews</button>
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-5">
                  <button type="button" className="absolute -left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                    <ArrowBackIosNewRoundedIcon className="h-4 w-4" />
                  </button>

                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=200&q=80"
                        alt="Client"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">Rohit Sharma</p>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">Verified Buyer</span>
                      </div>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <StarRoundedIcon className="h-3.5 w-3.5" /> 5.0
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Excellent service. Got my visa without any hassle. The team guided me at every step.
                      </p>
                      <p className="mt-2 text-xs text-slate-500">April 28, 2025</p>
                    </div>
                  </div>

                  <button type="button" className="absolute -right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                    <ArrowForwardIosRoundedIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">You May Also Like</h3>
                <Link href="/marketplace" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View All</Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {relatedListings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/marketplace/${item.detailSlug}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_6px_22px_rgba(15,23,42,0.06)]"
                  >
                    <img src={item.image || dummyServiceImage} alt={item.service} className="h-36 w-full object-cover" onError={handleImageFallback} />
                    <div className="space-y-2 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">{item.categoryLabel}</p>
                      <h4 className="line-clamp-1 text-sm font-semibold text-slate-900">{item.service}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-semibold text-blue-700">{item.priceLabel}</p>
                        <p className="inline-flex items-center gap-1 text-amber-500"><StarRoundedIcon className="h-3.5 w-3.5" />{item.rating}</p>
                      </div>
                      <p className="inline-flex items-center gap-1 text-xs text-slate-500"><LocationOnOutlinedIcon className="h-3.5 w-3.5" />{item.city}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-20 xl:h-fit">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <h2 className="text-[38px] font-bold leading-none text-slate-900">{listing.priceLabel.replace("INR ", "₹")}</h2>
              <p className="mt-1 text-sm text-slate-500">Starting Price</p>
              <button type="button" className="mt-4 h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">
                Enquire Now
              </button>
              <button type="button" className="mt-2 inline-flex h-11 w-full items-center justify-center gap-1 rounded-lg border border-blue-200 text-sm font-semibold text-blue-700 hover:border-blue-300">
                <LanguageRoundedIcon className="h-4 w-4" />
                Chat with Provider
              </button>
              <p className="mt-3 text-xs text-emerald-600">Usually replies in a few minutes</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">Service Provider</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl font-semibold text-blue-700">IV</div>
                <div>
                  <p className="font-semibold text-slate-900">Immify Visas</p>
                  <p className="text-xs text-slate-500">Verified Provider</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-500"><StarRoundedIcon className="h-3.5 w-3.5" />4.8 (520 Reviews)</p>
                  <p className="text-xs text-slate-500">1250+ Services Completed</p>
                </div>
              </div>
              <button type="button" className="mt-4 h-10 w-full rounded-lg border border-slate-200 text-sm font-semibold text-blue-700 hover:border-blue-300">
                View Profile
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">Service Details</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Category</dt><dd className="text-right text-slate-800">{listing.categoryName}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Sub Category</dt><dd className="text-right text-slate-800">{listing.service}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Service Type</dt><dd className="text-right text-slate-800">Visa Assistance</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Locations Covered</dt><dd className="text-right text-slate-800">All India</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Processing Time</dt><dd className="text-right text-slate-800">15 - 25 Working Days</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Languages Support</dt><dd className="text-right text-slate-800">English, Hindi</dd></div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">Share this Service</p>
              <div className="mt-3 flex items-center gap-2">
                {socialLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-700"
                      aria-label={link.label}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                    </a>
                  );
                })}
              </div>
              <button type="button" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-700">
                <FavoriteBorderRoundedIcon className="h-4 w-4" />
                Save to Wishlist
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-slate-900">Need Help?</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">Our support team is here to help you 24/7.</p>
              <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300">
                Contact Support
                <ArrowForwardIosRoundedIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
