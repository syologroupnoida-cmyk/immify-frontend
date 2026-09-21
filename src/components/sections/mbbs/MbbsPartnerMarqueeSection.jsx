import { countryPartnerTiles, universityPartnerTiles } from "./mbbsData";

function MarqueeRow({ items, reverse = false }) {
  return (
    <div className="mbbs-marquee overflow-hidden">
      <div className={`mbbs-marquee-track${reverse ? " mbbs-marquee-track-reverse" : ""}`}>
        {[...items, ...items].map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_10px_22px_rgba(8,47,73,0.10)] sm:h-28 sm:w-44"
          >
            <img
              src={partner.image}
              alt={partner.name}
              className="h-full w-full rounded-lg object-cover"
              onError={(event) => {
                event.currentTarget.src = "/images/services/service-dummy.svg";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MbbsPartnerMarqueeSection() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-[#eafcff] via-[#e8f8ff] to-[#dceeff] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-[#062c53] sm:text-4xl">
            Our Partner Universities &amp; Countries
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-teal-400" />
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-[#16476f] sm:text-base">
            Trusted medical universities across these countries - we work with top institutions worldwide.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          <MarqueeRow items={countryPartnerTiles} reverse />
          <MarqueeRow items={universityPartnerTiles} />
        </div>
      </div>
    </section>
  );
}
