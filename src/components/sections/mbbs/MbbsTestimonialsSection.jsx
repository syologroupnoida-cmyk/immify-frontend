import SectionTitle from "./SectionTitle";
import { testimonials } from "./mbbsData";

export default function MbbsTestimonialsSection() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Student Stories"
        title="Goodwill Generated Over the Years"
        description="Dummy testimonials for the MBBS study abroad journey."
      />
      <div className="mx-auto mt-8 grid max-w-7xl gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <article key={item.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm leading-7 text-slate-600">{item.text}</p>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{item.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{item.university}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
