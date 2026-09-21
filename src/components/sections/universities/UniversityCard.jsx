import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import universityFallbackCampus from "@/images/university-fallback-campus.png";

export default function UniversityCard({ university }) {
  const [imageSrc, setImageSrc] = useState(university.image || universityFallbackCampus);

  return (
    <Link
      href={`/marketplace/universities/${university.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={university.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          onError={() => setImageSrc(universityFallbackCampus)}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
          {university.type}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white">
          <StarRoundedIcon className="h-3.5 w-3.5 text-amber-400" />
          {university.rating}
        </span>
      </div>

      <div className="p-4">
        <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
          <SchoolOutlinedIcon className="h-3.5 w-3.5" />
          {university.course}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-tight text-slate-900">{university.name}</h3>
        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <LocationOnOutlinedIcon className="h-4 w-4" />
          {university.city}, {university.country}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Tuition from</p>
            <p className="text-base font-bold text-blue-700">{university.tuitionLabel}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{university.scholarship}</span>
        </div>
      </div>
    </Link>
  );
}
