import Link from "next/link";
import { vendorLocations } from "../vendors/vendorLocationData";

export default function ImmigrationVendorsByLocationSection() {
  return (
    <section id="immigration-vendors-by-location" className="border-t border-slate-100 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Immigration Vendors by Location</h2>
          <p className="mt-5 text-base font-semibold text-slate-800">Popular Cities</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-y-2 text-sm leading-7 text-slate-600">
          {vendorLocations.map((location, index) => (
            <span key={location.slug} className="inline-flex items-center">
              <Link href={`/immigration-vendors/${location.slug}`} className="transition hover:text-[#1f2a77] hover:underline">
                {location.name}
              </Link>
              {index < vendorLocations.length - 1 && <span className="mx-2 text-slate-400">|</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
