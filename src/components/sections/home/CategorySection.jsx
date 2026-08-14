import Link from "next/link";
import { useEffect, useRef } from "react";
import { vendorCategories } from "./homeData";

export default function CategorySection() {
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const intervalId = window.setInterval(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const nextScrollLeft = container.scrollLeft + 320;

      if (nextScrollLeft >= maxScrollLeft) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section id="categories" className="w-full bg-[#f3f4f6] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">Categories You May Like</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Find the right category for your next move</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          To simplify onboarding and improve search, vendors can register under one or more of these primary categories.
        </p>

      </div>

      <div className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-[1.2rem]">
        <div ref={sliderRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pl-1 pr-1 scrollbar-none scroll-smooth">
          {vendorCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group min-w-[280px] max-w-[320px] snap-start overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden">
                <img src={category.image} alt={category.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{category.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
