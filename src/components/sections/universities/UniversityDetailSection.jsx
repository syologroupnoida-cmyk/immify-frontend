import Link from "next/link";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { universities } from "./universityData";

export default function UniversityDetailSection() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const university = universities.find((item) => item.slug === slug);

  if (!university) {
    return (
      <main className="min-h-screen bg-[#f6f8ff] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">University not found</h1>
          <Link href="/marketplace/universities" className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white">
            Back to Universities
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faff] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/marketplace/universities" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
          <ArrowBackRoundedIcon className="h-4 w-4" />
          Back to Universities
        </Link>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_38px_rgba(15,23,42,0.08)]">
          <div className="relative h-[260px] sm:h-[380px]">
            <img src={university.image} alt={university.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-8">
              <p className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <SchoolOutlinedIcon className="h-4 w-4" />
                {university.course}
              </p>
              <h1 className="mt-3 max-w-4xl text-3xl font-bold sm:text-5xl">{university.name}</h1>
              <p className="mt-3 inline-flex items-center gap-1 text-sm text-white/85">
                <LocationOnOutlinedIcon className="h-4 w-4" />
                {university.city}, {university.country}
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_340px] lg:p-8">
            <section>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Ranking", university.ranking],
                  ["Tuition", university.tuitionLabel],
                  ["Next Intake", university.intake],
                  ["Duration", university.duration],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{university.summary}</p>
              </div>

              <div className="mt-7">
                <h2 className="text-xl font-bold text-slate-900">Highlights</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {university.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
                      <CheckCircleRoundedIcon className="h-4 w-4" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-slate-200 bg-[#fbfdff] p-5">
                <h2 className="text-xl font-bold text-slate-900">Dummy Admission Requirements</h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                  <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-700" />Academic transcripts and valid passport.</li>
                  <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-700" />English proficiency or interview-based assessment.</li>
                  <li className="flex items-start gap-2"><CheckCircleRoundedIcon className="mt-0.5 h-4 w-4 text-blue-700" />Statement of purpose and financial documents.</li>
                </ul>
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-500">
                <StarRoundedIcon className="h-5 w-5" />
                <span className="text-lg font-bold">{university.rating}</span>
                <span className="text-sm text-slate-500">({university.reviews} reviews)</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Scholarship</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">{university.scholarship}</p>
              <button type="button" className="mt-5 h-11 w-full rounded-xl bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-800">
                Enquire Now
              </button>
              <button type="button" className="mt-3 h-11 w-full rounded-xl border border-blue-200 text-sm font-semibold text-blue-700 transition hover:border-blue-300">
                Download Brochure
              </button>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
