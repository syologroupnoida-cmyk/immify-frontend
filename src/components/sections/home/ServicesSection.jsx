import Link from "next/link";
import { useEffect, useRef } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { serviceCategories } from "./homeData";

const fallbackImage = "/images/services/service-dummy.svg";

export default function ServicesSection() {
  const sliderRef = useRef(null);
  const loopedCategories = [...serviceCategories, ...serviceCategories];

  useEffect(() => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const singleTrackWidth = container.scrollWidth / 2;

    const intervalId = window.setInterval(() => {
      const nextScrollLeft = container.scrollLeft + 320;

      if (container.scrollLeft >= singleTrackWidth) {
        container.scrollLeft -= singleTrackWidth;
      }

      if (nextScrollLeft < container.scrollWidth - container.clientWidth) {
        container.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section id="services" className="w-full bg-[#f3f4f6] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">Explore services</p>
            <h2 className="mt-2 max-w-2xl text-xl font-semibold text-slate-900 sm:text-2xl">
              Browse services with smart recommendations and fast discovery.
            </h2>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[1.6rem] bg-transparent p-0">
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pl-1 pr-1 scrollbar-none scroll-smooth"
          >
            {loopedCategories.map((category, index) => (
              <Link
                key={`${category.slug}-${index}`}
                href={`/services/${category.slug}`}
                className="w-[min(82vw,260px)] min-w-[230px] snap-center focus:outline-none focus:ring-2 focus:ring-sky-500 sm:min-w-[245px] lg:min-w-[260px]"
              >
                <div className="group flex h-full min-h-[270px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10 hover:ring-blue-100">
                  <div className="flex flex-1 flex-col">
                    <div className="h-36 w-full overflow-hidden bg-slate-100">
                      <img
                        src={category.image || fallbackImage}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-3.5">
                      <div>
                        <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-950 group-hover:text-blue-700">{category.name}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{category.shortDescription}</p>
                      </div>
                      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                        {category.services.slice(0, 2).map((service) => (
                          <div key={service} className="flex items-start gap-2">
                            <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-sky-600" />
                            <span className="line-clamp-1">{service}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs font-semibold text-slate-500">{category.services.length} services</span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-700">
                          Explore
                          <ArrowForwardRoundedIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
