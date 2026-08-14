import Link from "next/link";
import { useEffect, useRef } from "react";
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
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-slate-900 sm:text-3xl">
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
                className="min-w-[280px] max-w-[320px] snap-start focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <div className="flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div>
                    <div className="h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={category.image || fallbackImage}
                        alt={category.name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                      <p className="mt-2 line-clamp-1 text-sm leading-6 text-slate-600">{category.shortDescription}</p>
                    </div>
                    <div className="mt-3 space-y-2 px-4 pb-4 text-sm text-slate-600">
                      {category.services.slice(0, 2).map((service) => (
                        <div key={service} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-sky-600" />
                          <span className="line-clamp-1">{service}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 pb-4 inline-flex items-center text-sm font-semibold text-sky-700">
                      Explore →
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
