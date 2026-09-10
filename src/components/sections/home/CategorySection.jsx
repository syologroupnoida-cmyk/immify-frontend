import Link from "next/link";
import { useEffect, useRef } from "react";
import LeadGenerationButton from "../../common/LeadGenerationButton";
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
    <section id="categories" className="w-full bg-[#f7f9ff] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f2a77]">Categories You May Like</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Choose the right support category</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Browse core Immify categories and send your requirement when you are ready.
          </p>
        </div>
        <LeadGenerationButton label="Get Quote" variant="primary" />
      </div>

      <div className="mx-auto mt-7 max-w-7xl overflow-hidden">
        <div ref={sliderRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {vendorCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group min-w-[220px] max-w-[240px] snap-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:border-[#1f2a77]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <img src={category.image} alt={category.title} className="h-14 w-14 rounded-xl object-cover" />
                <h3 className="text-sm font-semibold leading-5 text-slate-900">{category.title}</h3>
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{category.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
