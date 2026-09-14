import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import UniversityCard from "../universities/UniversityCard";
import { universities } from "../universities/universityData";

export default function UniversitySection() {
  return (
    <section id="universities" className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mx-auto max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 sm:text-sm">
              <SchoolOutlinedIcon className="h-5 w-5" />
              Explore Universities
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Explore Dummy Partner Universities
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Compare sample universities by country, course, fee range, and intake before connecting with an advisor.
            </p>
          </div>
          <Link href="/marketplace/universities" className="mt-4 hidden items-center justify-center gap-1 text-sm font-semibold text-blue-700 transition hover:text-blue-800 sm:inline-flex">
            View All
            <ArrowForwardRoundedIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.slice(0, 3).map((university) => (
            <UniversityCard key={university.slug} university={university} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/marketplace/universities"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-300 px-8 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
          >
            Show More
            <ArrowForwardRoundedIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
