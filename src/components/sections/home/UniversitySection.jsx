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
      .then((items) => { if (active) setServices(items.slice(0, 3)); })
      .catch(() => { if (active) setServices([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section id="universities" className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-blue-700 sm:text-sm"><SchoolOutlinedIcon className="h-5 w-5" /> Study Abroad Services</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Explore Partner Universities</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Explore university admission and study-abroad services from our providers.</p>
        </div>

        {loading ? <p className="py-12 text-center text-sm text-slate-500">Loading university services...</p> : services.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.id} href={`/marketplace/${service.detailSlug}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md">
                <div className="relative h-44 overflow-hidden bg-slate-100"><Image src={service.image} alt="" fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = serviceListingFallbackImage; }} /></div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-blue-700">{service.categoryName}</p>
                  <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-bold text-slate-900">{service.service}</h3>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-600">{service.description || "Explore this study-abroad service and admission support."}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="font-semibold text-slate-900">{service.priceLabel}</span><ArrowForwardRoundedIcon className="h-5 w-5 text-blue-700" /></div>
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
