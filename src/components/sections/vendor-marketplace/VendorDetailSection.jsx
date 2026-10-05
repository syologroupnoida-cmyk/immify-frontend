import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { fetchServiceListings, serviceListingFallbackImage } from "@/util/serviceListings";
import { fetchVendorById, vendorFallbackImage } from "@/util/vendors";

const planningSteps = [
  {
    title: "Profile review",
    text: "Understand your goals, preferred destination, eligibility, and urgency before suggesting the next step.",
  },
  {
    title: "Document planning",
    text: "Prepare a clear checklist for identity, education, financial, employment, and supporting documents.",
  },
  {
    title: "Case guidance",
    text: "Support application preparation, submission readiness, follow-up planning, and quote coordination.",
  },
];

const trustHighlights = [
  "Verified marketplace profile",
  "Category-specific service coverage",
  "Quote request support through Immify",
];

export default function VendorDetailSection({ vendor, vendorUserId = "" }) {
  const [apiVendor, setApiVendor] = useState(null);
  const [vendorServices, setVendorServices] = useState([]);
  const [loading, setLoading] = useState(Boolean(vendorUserId && !vendor));
  const currentVendor = apiVendor || vendor;
  const currentVendorUserId = currentVendor?.vendorUserId || vendorUserId;
  const services = currentVendor?.services || [];
  const displayServiceListings = vendorServices.length ? vendorServices : currentVendor?.serviceListings || [];
  const categoryTitle = currentVendor?.categoryTitle || "Immigration Vendor";
  const company = currentVendor?.company || {};
  const detailSlug = currentVendor?.vendorUserId || currentVendor?.slug || vendorUserId;
  const phoneNumber = currentVendor?.phone || "08487868432";

  useEffect(() => {
    if (!vendorUserId || vendor?.vendorUserId === vendorUserId) return undefined;
    let active = true;

    queueMicrotask(() => {
      if (active) setLoading(true);
    });
    fetchVendorById(vendorUserId)
      .then((item) => {
        if (active) setApiVendor(item);
      })
      .catch(() => {
        if (active) setApiVendor(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [vendor, vendorUserId]);

  useEffect(() => {
    if (!currentVendorUserId) return undefined;
    let active = true;

    fetchServiceListings({ vendorUserId: currentVendorUserId })
      .then((items) => {
        if (active) setVendorServices(items);
      })
      .catch(() => {
        if (active) setVendorServices([]);
      });

    return () => {
      active = false;
    };
  }, [currentVendorUserId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Loading vendor...</h1>
          <p className="mt-2 text-sm text-slate-600">Fetching the latest vendor profile and services.</p>
        </div>
      </main>
    );
  }

  if (!currentVendor) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Vendor not found</h1>
          <p className="mt-2 text-sm text-slate-600">Please choose another vendor from the marketplace.</p>
          <Link href="/marketplace/vendors" className="mt-6 inline-flex rounded-xl bg-[#1f2a77] px-5 py-2.5 text-sm font-semibold text-white">
            Back to Vendors
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] pb-12">
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-slate-950 px-4 pb-16 pt-28 text-center text-white sm:px-6 lg:px-8">
        <Image src={currentVendor.image || vendorFallbackImage} alt={currentVendor.name} fill priority unoptimized sizes="100vw" className="absolute inset-0 -z-20 object-cover opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/86 via-[#1f2a77]/72 to-slate-950/82" />
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">{categoryTitle}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">{currentVendor.name}</h1>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <HeroPill icon={<StarRoundedIcon className="h-4 w-4 text-amber-300" />} text={`${currentVendor.rating.toFixed(1)} rating`} />
            <HeroPill icon={<VerifiedRoundedIcon className="h-4 w-4 text-emerald-300" />} text={`${currentVendor.experience} experience`} />
            <HeroPill icon={<LocationOnOutlinedIcon className="h-4 w-4 text-sky-200" />} text={`${currentVendor.city}, ${currentVendor.state}`} />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 px-4 sm:px-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-3">
            <Metric icon={<StarRoundedIcon className="h-5 w-5 text-amber-500" />} label="Rating" value={currentVendor.rating.toFixed(1)} />
            <Metric icon={<VerifiedRoundedIcon className="h-5 w-5 text-emerald-600" />} label="Experience" value={currentVendor.experience} />
            <Metric icon={<LocationOnOutlinedIcon className="h-5 w-5 text-blue-600" />} label="Location" value={`${currentVendor.city}, ${currentVendor.state}`} />
          </div>

          <div className="p-5 sm:p-7">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Profile summary</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Vendor details</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {currentVendor.description || `${currentVendor.name} helps customers with ${String(currentVendor.specialty || categoryTitle).toLowerCase()} and related immigration support. Use this profile to review their focus areas, response expectation, and service coverage before requesting a quote.`}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {trustHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                    <CheckCircleRoundedIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <dl className="mt-5 grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:grid-cols-2">
                {[
                  { label: "Category", value: categoryTitle },
                  { label: "Primary service", value: currentVendor.specialty },
                  { label: "Response time", value: currentVendor.responseTime },
                  { label: "Service area", value: `${currentVendor.city}, ${currentVendor.state}` },
                  { label: "Company", value: company.companyName || company.businessName },
                  { label: "Team size", value: company.teamSize ? `${company.teamSize}+ people` : "" },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">{item.label}</dt>
                    <dd className="mt-1 text-sm font-bold text-slate-900">{item.value || "Available on request"}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Coverage</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Services offered</h2>
              {displayServiceListings.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {displayServiceListings.slice(0, 8).map((service) => (
                    <Link key={service.id} href={`/marketplace/${service.detailSlug}`} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
                      <div className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image src={service.image || serviceListingFallbackImage} alt="" fill unoptimized sizes="56px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase text-blue-700">{service.categoryName}</p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-blue-700">{service.service}</h3>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{service.priceLabel}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {services.map((service) => (
                    <span key={service} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800">
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Process</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">How they can help</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {planningSteps.map((step) => (
                  <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
                    <CheckCircleRoundedIcon className="mb-2 h-5 w-5 text-emerald-600" />
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-2 text-slate-600">{step.text}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Best fit</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Recommended for</h2>
              <div className="mt-4 rounded-2xl bg-[#f4f7fb] p-5">
                <p className="text-sm leading-7 text-slate-600">
                  This vendor profile is suited for applicants comparing options for {String(currentVendor.specialty || categoryTitle).toLowerCase()}, document readiness, and guided quote discovery in {currentVendor.city}. Request a quote when you are ready to share your case details.
                </p>
              </div>
            </section>
          </div>
        </article>

        <aside className="self-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:sticky lg:top-24">
          <div className="bg-[#111a4f] p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Vendor profile</p>
                <h2 className="mt-2 text-2xl font-bold">Connect with this vendor</h2>
              </div>
              <Link
                href="/agent/login"
                aria-label="Edit or claim this vendor profile"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:border-white/50 hover:bg-white/20"
              >
                <EditRoundedIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm leading-6 text-slate-600">
              Share your requirement and Immify will help route your enquiry for this vendor category.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Is this your vendor profile?{" "}
              <Link href="/agent/login" className="text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900">
                Claim this profile
              </Link>
            </p>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex justify-between gap-4">
                <span>Response time</span>
                <strong className="text-slate-900">{currentVendor.responseTime}</strong>
              </div>
              <div className="mt-3 flex justify-between gap-4">
                <span>Primary focus</span>
                <strong className="text-right text-slate-900">{currentVendor.specialty}</strong>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <Link href={`tel:${phoneNumber}`} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-green-600 px-3 text-sm font-bold text-white hover:bg-green-700">
                <PhoneRoundedIcon className="h-4 w-4" />
                {phoneNumber}
              </Link>
              <Link href={{ pathname: "/lead-generation", query: { vendor: detailSlug } }} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-950 hover:bg-slate-50">
                <WhatsAppIcon className="h-5 w-5 text-green-600" />
                WhatsApp
              </Link>
              <Link href={{ pathname: "/lead-generation", query: { vendor: detailSlug } }} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800">
                <ChatRoundedIcon className="h-4 w-4" />
                Send Enquiry
              </Link>
            </div>
            <Link href="/marketplace/vendors" className="mt-3 flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
              Compare more vendors
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function HeroPill({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
      {icon}
      {text}
    </span>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
      {icon}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="mt-1 font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
