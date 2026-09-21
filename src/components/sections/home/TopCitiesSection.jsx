import Link from "next/link";
import LeadGenerationButton from "../../common/LeadGenerationButton";
import { topCities } from "./homeData";

export default function TopCitiesSection() {
  return (
    <section id="cities" className="w-full bg-[#f7f9ff] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f2a77]">Explore India</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Top cities in India</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Find local consultants and support teams in leading migration cities.
          </p>
        </div>
        <LeadGenerationButton label="Get Quote" variant="primary" />
      </div>

      <div className="mx-auto mt-7 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {topCities.map((city) => (
          <Link
            key={city.slug}
            href={`/cities/${city.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 transition hover:border-[#1f2a77]/30 hover:shadow-sm"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
              <img
                src={city.image}
                alt={city.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/images/services/service-dummy.svg";
                }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">{city.name}</h3>
              <p className="mt-1 truncate text-xs text-slate-500">{city.highlights?.[0] || "Consultation support"}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
