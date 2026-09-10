import SectionTitle from "./SectionTitle";
import { steps } from "./mbbsData";

export default function MbbsJourneySection() {
  return (
    <section className="bg-[#f6f8ff] px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Your Journey"
        title="How MBBS Admission Abroad Works"
        description="A simple step-by-step admission journey inspired by the reference layout."
      />
      <div className="mx-auto mt-9 grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(([title, text], index) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2a77] text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
