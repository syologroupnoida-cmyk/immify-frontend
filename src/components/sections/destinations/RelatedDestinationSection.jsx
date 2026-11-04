import Link from "next/link";
import { topCities, topCountries } from "@/components/sections/home/homeData";
import { getDestinationPhoto } from "@/components/sections/home/destinationData";
import { DestinationPhoto } from "@/components/sections/home/DestinationDiscoverySection";

export default function RelatedDestinationSection({ category }) {
  const showCities = category === "international";
  const items = showCities ? ["jaipur", "lucknow", "new-delhi"].map((slug) => topCities.find((city) => city.slug === slug)) : topCountries.slice(0, 3);
  return (
    <section aria-labelledby="related-directory-destinations" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border-t border-slate-200 pt-8">
        <div className="text-center">
          <div className="mx-auto max-w-2xl">
            <h2 id="related-directory-destinations" className="text-xl font-bold text-slate-900">Related destinations</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{showCities ? "Discover cities across India for local guidance and support." : "Explore international destinations for your next chapter."}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {items.map((item) => {
            const photo = showCities ? { src: item.image, alt: item.name } : getDestinationPhoto(item.slug);
            return (
              <article key={item.slug} className="min-w-0">
                <Link href={`/${showCities ? "cities" : "countries"}/${item.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                  <div className="relative h-36 overflow-hidden bg-blue-50"><DestinationPhoto photo={photo} /></div>
                  <div className="p-4"><h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{item.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p></div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
