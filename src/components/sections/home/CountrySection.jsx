import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { destinations } from "../mbbs/mbbsData";

const admissionSupport = ["Eligibility review", "University shortlist", "Application support", "Visa guidance"];

export default function CountrySection() {
  return (
    <section id="countries" className="bg-[#f5f8fb] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Medical education overseas</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">MBBS Study Abroad</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Explore medical study destinations and compare indicative tuition and course duration in one place.
            </p>
          </div>
          <Link href="/mbbs-study-abroad" className="inline-flex shrink-0 items-center gap-1 self-start text-sm font-semibold text-blue-700 hover:text-blue-900 sm:self-auto">
            Explore all destinations <ArrowForwardRoundedIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.slice(0, 4).map((destination) => (
            <Link
              key={destination.name}
              href="/mbbs-study-abroad#destinations"
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-teal-400 hover:shadow-lg hover:shadow-slate-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              aria-label={`Explore MBBS in ${destination.name}`}
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-200">
                <img
                  src={destination.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.src = "/images/services/service-detail-dummy.png";
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">MBBS in {destination.name}</h3>
                  <ArrowForwardRoundedIcon className="h-5 w-5 shrink-0 text-teal-700 transition group-hover:translate-x-1" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <span><strong className="font-semibold text-slate-800">Fees</strong> {destination.fee}</span>
                  <span><strong className="font-semibold text-slate-800">Duration</strong> {destination.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 lg:flex lg:items-center lg:gap-8">
          <p className="shrink-0 text-sm font-semibold text-slate-900">Support at every step</p>
          <ul className="mt-4 grid flex-1 gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
            {admissionSupport.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircleOutlineRoundedIcon className="h-5 w-5 shrink-0 text-teal-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
