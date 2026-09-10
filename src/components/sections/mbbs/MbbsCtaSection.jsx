import LeadGenerationButton from "@/components/common/LeadGenerationButton";

export default function MbbsCtaSection() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-2xl bg-[#1f2a77] p-6 text-white md:grid-cols-[1fr_auto] md:items-center sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Free Counselling Available</p>
          <h2 className="mt-2 text-2xl font-bold">Get Guided by MBBS Abroad Experts</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
            Start with a counselling call and compare destination, budget, eligibility, and admission timeline.
          </p>
        </div>
        <LeadGenerationButton label="Enquiry Now" variant="light" />
      </div>
    </section>
  );
}
