import { useEffect, useState } from "react";
import LeadGenerationButton from "@/components/common/LeadGenerationButton";
import { destinations } from "./mbbsData";

export default function MbbsHeroSection() {
  const heroCountries = destinations.slice(0, 10);
  const countryNames = destinations.map((country) => country.name);
  const [countryIndex, setCountryIndex] = useState(0);
  const activeCountryName = countryNames[countryIndex] || "Russia";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountryIndex((currentIndex) => (currentIndex + 1) % countryNames.length);
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, [countryNames.length]);

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 pt-24 pb-10 text-white sm:px-6 lg:px-8">
      <img
        src="/images/home/home-hero-study.png"
        alt="MBBS study abroad"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-900/62 to-slate-950/10" />
      <div className="relative mx-auto flex min-h-[470px] max-w-7xl items-center">
        <div>
          <p className="text-base font-semibold text-emerald-200">Committed to Success</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Study <span className="text-yellow-300">MBBS</span> in{" "}
            <span className="text-yellow-300">{activeCountryName}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            Explore affordable medical universities, country options, admission steps, visa support, and expert counselling for Indian students.
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {heroCountries.map((country) => (
              <a
                key={country.name}
                href="#destinations"
                className="group flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-white">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/images/services/service-dummy.svg";
                    }}
                  />
                </span>
                <span className="truncate text-sm font-semibold">{country.name}</span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <LeadGenerationButton label="Get Free Counselling" variant="light" />
            <a href="#destinations" className="rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Explore Destinations
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
