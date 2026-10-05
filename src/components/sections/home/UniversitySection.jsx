import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { fetchServiceListings, serviceListingFallbackImage } from "@/util/serviceListings";

const universityCategory = "Study Abroad Services";

export default function UniversitySection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchServiceListings({ categoryName: universityCategory })
      .then((items) => { if (active) setServices(items.slice(0, 4)); })
      .catch(() => { if (active) setServices([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section id="universities" className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-blue-700 sm:text-sm"><SchoolOutlinedIcon className="h-5 w-5" /> Study Abroad Services</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Explore Partner Universities</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Explore university admission and study-abroad services from our providers.</p>
        </div>

        {loading ? <p className="py-12 text-center text-sm text-slate-500">Loading university services...</p> : services.length ? (
          <div className="scrollbar-none mt-8 flex snap-x snap-mandatory justify-start gap-4 overflow-x-auto pb-3 pl-1 pr-1 scroll-smooth lg:justify-center">
            {services.map((service) => (
              <Link key={service.id} href={`/marketplace/${service.detailSlug}`} className="group flex min-h-[270px] w-[min(82vw,260px)] min-w-[230px] snap-center flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 hover:ring-blue-100 sm:min-w-[245px] lg:min-w-[260px]">
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <Image src={service.image || serviceListingFallbackImage} alt="" fill unoptimized sizes="(min-width: 1024px) 260px, 82vw" className="object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-slate-950/80 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                    {service.priceLabel}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <div>
                    <p className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">{service.categoryName}</p>
                    <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-950 group-hover:text-blue-700">{service.service}</h3>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-500">{service.city || "Online"}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-700">
                      Details
                      <ArrowForwardRoundedIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : <p className="py-12 text-center text-sm text-slate-500">No study abroad services are available right now.</p>}

        <div className="mt-8 flex justify-center">
          <Link href={{ pathname: "/marketplace", query: { category: "study-abroad-services" } }} className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Show More <ArrowForwardRoundedIcon className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
