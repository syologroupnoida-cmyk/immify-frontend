import Link from "next/link";
import LeadGenerationButton from "@/components/common/LeadGenerationButton";
import { destinations, universities } from "./mbbsData";

export default function MbbsTrustedPartnersSection() {
  return (
    <section className="bg-gradient-to-br from-[#0d3f87] via-[#0759ac] to-[#0a74d7] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold leading-tight sm:text-4xl">
          Our Trusted Exclusive <span className="text-yellow-300">MBBS Abroad Partners</span>
        </h2>

        <div className="mt-9 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {destinations.map((country, index) => (
            <button
              key={country.name}
              type="button"
              className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                index === 0
                  ? "border-emerald-300 bg-emerald-400 text-[#06325f] shadow-lg"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/18"
              }`}
            >
              <span className="h-5 w-5 overflow-hidden rounded-full bg-white">
                <img
                  src={country.image}
                  alt={country.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/images/services/service-dummy.svg";
                  }}
                />
              </span>
              {country.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {universities.map((university) => (
            <article key={university.name} className="rounded-2xl bg-white p-5 text-slate-900 shadow-[0_14px_34px_rgba(2,6,23,0.18)]">
              <div className="flex gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2">
                  <img
                    src={university.logo}
                    alt={university.name}
                    className="h-full w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.src = "/images/services/service-dummy.svg";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-slate-900">{university.name}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{university.city}</span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      Est. {university.established}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      NMC Approved
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Intake</p>
                  <p className="mt-1 font-bold text-[#062c53]">Sept</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">Country Rank</p>
                  <p className="mt-1 font-bold text-[#062c53]">{university.rank}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Tuition Fee :</p>
                  <p className="mt-2 text-sm font-bold text-[#062c53]">{university.fee}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/mbbs-study-abroad/${university.slug}`} className="rounded-full border border-[#0759ac] px-4 py-2 text-xs font-bold text-[#0759ac] transition hover:bg-blue-50">
                    View details
                  </Link>
                  <LeadGenerationButton label="Apply Now" className="bg-yellow-300 px-4 py-2 text-xs text-slate-950 hover:bg-yellow-200" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
