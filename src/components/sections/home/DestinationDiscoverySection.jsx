import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useState } from "react";
import { topCities, topCountries } from "./homeData";
import { getDestinationPhoto } from "./destinationData";

export function DestinationPhoto({ photo }) {
  const [failed, setFailed] = useState(false);
  return <Image src={failed ? "/images/services/service-detail-dummy.png" : photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 292px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" unoptimized={photo.src.startsWith("https://")} onError={() => setFailed(true)} className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />;
}

export default function DestinationDiscoverySection({ standalone = false, category = "international" }) {
  const Heading = standalone ? "h1" : "h2";
  const national = category === "national";
  const destinations = national ? topCities : topCountries;
  return (
    <section id="destinations" aria-labelledby="destination-discovery-title" className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">{national ? "National destinations" : "International destinations"}</p>
            <Heading id="destination-discovery-title" className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{national ? "Discover Cities Across India" : "Find the Destination That Feels Like You"}</Heading>
            <p className="mt-2 text-sm leading-6 text-slate-600">{national ? "Explore cities and find local guidance for your global plans." : "Explore a new place to study, work or begin your next chapter."}</p>
          </div>
          {!standalone && <Link href="/destinations" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">Explore destinations <ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 18 }} /></Link>}
        </div>
        <div className="mt-6 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => {
            const photo = national ? { src: destination.image, alt: `Explore ${destination.name}, India` } : getDestinationPhoto(destination.slug);
            return (
              <article key={destination.slug} className="min-w-0">
              <Link href={national ? `/cities/${destination.slug}` : { pathname: "/providers", query: { country: destination.name } }} className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                <div className="relative h-36 overflow-hidden rounded-xl bg-blue-50 sm:h-40">
                  <DestinationPhoto key={photo.src} photo={photo} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{destination.name}</h3>
                  <ArrowForwardRoundedIcon aria-hidden="true" className="text-blue-700" sx={{ fontSize: 18 }} />
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{destination.summary}</p>
              </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
