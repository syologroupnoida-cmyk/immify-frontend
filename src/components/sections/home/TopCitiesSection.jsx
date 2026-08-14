import Link from "next/link";
import { topCities } from "./homeData";

export default function TopCitiesSection() {
  return (
    <section id="cities" className="relative w-full overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-10 top-20 h-24 w-24 rounded-full border border-sky-100" />
      <div className="pointer-events-none absolute -right-12 top-28 h-36 w-36 rounded-full border border-amber-200" />

      <div className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-amber-500">Explore India</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Top Cities in India</h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-slate-600">
          Find trusted consultants and relocation support in India&apos;s leading migration cities.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {topCities.map((city) => (
          <Link
            key={city.slug}
            href={`/cities/${city.slug}`}
            className="group mx-auto flex max-w-[190px] flex-col items-center text-center transition duration-300 hover:-translate-y-1"
          >
            <div className="aspect-square h-24 w-24 overflow-hidden rounded-full border-[4px] border-white shadow-[0_10px_20px_rgba(15,23,42,0.16)] sm:h-28 sm:w-28">
              <img
                src={city.image}
                alt={city.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/images/services/service-dummy.svg";
                }}
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800">{city.name}</h3>
            <div className="mt-2 h-1 w-10 rounded-full bg-amber-400" />
            <p className="mt-3 text-sm leading-7 text-slate-600">{city.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
