import SectionTitle from "./SectionTitle";
import { destinations } from "./mbbsData";

export default function MbbsDestinationsSection() {
  return (
    <section id="destinations" className="px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="MBBS Destinations"
        title="Popular Countries for MBBS"
        description="Compare high-demand medical education destinations with dummy fee and duration details."
      />
      <div className="mx-auto mt-9 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((item) => (
          <article key={item.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900">MBBS in {item.name}</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <span className="rounded-lg bg-slate-50 p-2">Fees: {item.fee}</span>
                <span className="rounded-lg bg-slate-50 p-2">Duration: {item.duration}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
