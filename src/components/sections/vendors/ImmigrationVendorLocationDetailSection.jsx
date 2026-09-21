import Link from "next/link";
import Image from "next/image";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

export default function ImmigrationVendorLocationDetailSection({ location }) {
  if (!location) {
    return (
      <main className="min-h-screen bg-[#f6f8ff] px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Location not found</h1>
          <p className="mt-2 text-sm text-slate-600">Please choose another immigration vendor location.</p>
          <Link href="/" className="mt-6 inline-flex rounded-xl bg-[#1f2a77] px-5 py-2.5 text-sm font-semibold text-white">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8ff] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <Link href="/#immigration-vendors-by-location" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1f2a77]">
          <ArrowBackRoundedIcon className="h-4 w-4" />
          Back to locations
        </Link>

        <div className="relative isolate min-h-[300px] overflow-hidden rounded-2xl px-5 py-10 text-white sm:min-h-[360px] sm:px-8 lg:px-10">
          <Image
            src={location.image}
            alt={`Immigration vendors in ${location.name}`}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/82 via-slate-950/52 to-slate-950/20" />
          <div className="flex min-h-[220px] max-w-2xl flex-col justify-center sm:min-h-[280px]">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              <LocationOnOutlinedIcon className="h-4 w-4" />
              {location.name}, {location.state}
            </p>
            <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Immigration Vendors in {location.name}</h1>
            <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base">{location.description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Listed vendors</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{location.vendorCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Average rating</p>
            <p className="mt-1 inline-flex items-center gap-1 text-2xl font-bold text-slate-900">
              <StarRoundedIcon className="h-5 w-5 text-amber-500" />
              {location.rating}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Popular services</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{location.services.join(", ")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {location.vendors.map((vendor) => (
            <article key={vendor.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{vendor.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{vendor.specialty}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <StarRoundedIcon className="h-3.5 w-3.5" />
                  {vendor.rating}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <CheckCircleRoundedIcon className="h-4 w-4 text-emerald-600" />
                {vendor.experience} experience
              </div>
              <Link href="/lead-generation" className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#1f2a77] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17215f]">
                Get Free Quote
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
