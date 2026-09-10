import Link from "next/link";
import { topCountries } from "./homeData";

const mbbsBenefits = [
  { title: "NMC Approved Options", text: "Compare medical universities with recognized programs and clear eligibility guidance." },
  { title: "Affordable Fee Planning", text: "Review tuition, hostel, living cost, and travel budget before choosing a destination." },
  { title: "English Medium Courses", text: "Find MBBS programs designed for international students with English-medium teaching." },
];

const admissionSupport = [
  "NEET score and eligibility review",
  "University shortlisting",
  "Admission letter assistance",
  "Visa documentation support",
];

export default function CountrySection() {
  const countriesToShow = topCountries.slice(0, 10);

  return (
    <section id="countries" className="w-full bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f2a77]">Medical Education</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">MBBS Study Abroad</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Compare popular MBBS destinations, admission support, visa guidance, and trusted study abroad experts.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-7 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {countriesToShow.map((country) => (
          <Link
            key={country.slug}
            href={`/countries/${country.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-[#1f2a77]/30 hover:bg-white hover:shadow-sm"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
              <img
                src={country.image}
                alt={country.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/images/services/service-dummy.svg";
                }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">{country.flag} {country.name}</h3>
              <p className="mt-1 truncate text-xs text-slate-500">{country.programs?.[0] || "Study abroad support"}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Why Choose MBBS Abroad</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {mbbsBenefits.map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-2 text-xs leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#1f2a77] p-5 text-white">
          <h3 className="text-lg font-semibold">Admission Support</h3>
          <div className="mt-4 grid gap-2">
            {admissionSupport.map((item) => (
              <div key={item} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white/90">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/mbbs-study-abroad"
          className="rounded-xl border border-blue-300 px-8 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
        >
          View More
        </Link>
      </div>
    </section>
  );
}
