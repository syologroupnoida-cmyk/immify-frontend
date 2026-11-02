import Link from "next/link";
import { WorkOutlineRounded, SchoolOutlined, GroupsOutlined, PublicOutlined, FlightTakeoffRounded, MapOutlined, DescriptionOutlined, SupportAgentOutlined, ArrowForwardRounded, CheckRounded } from "@mui/icons-material";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import LeadGenerationButton from "@/components/common/LeadGenerationButton";
import { premiumServiceItems } from "@/components/sections/home/homeData";

const page = {
  title: "Premium Visa, Immigration & Study Support | Immify",
  description: "Explore premium service options for visas, immigration, education, family sponsorship and consultation. Review service scope and connect with providers.",
  heading: "Premium Support for Your Global Plans",
  intro: "Explore focused support for the next stage of your journey. Review each service, compare the help available and confirm the scope, availability and fees with your provider before you proceed.",
};

const presentation = {
  "work-visa": { icon: WorkOutlineRounded, label: "Work & careers", description: "Explore support with work visa preparation, employer documentation and interview planning." },
  "study-visa": { icon: SchoolOutlined, label: "Overseas education", description: "Plan your student application with support for course choices, financial documents and visa preparation." },
  "family-sponsorship": { icon: GroupsOutlined, label: "Family & relocation", description: "Understand the documentation and planning involved in preparing a family sponsorship enquiry." },
  "permanent-residency": { icon: PublicOutlined, label: "Long-term planning", description: "Compare residency pathways and explore profile and application-document support." },
  "visitor-visa": { icon: FlightTakeoffRounded, label: "Travel & visits", description: "Organise travel-purpose documents, itineraries and supporting records for a visitor visa enquiry." },
  "canada-immigration": { icon: MapOutlined, label: "Destination support", description: "Explore Canada-focused profile preparation, pathway comparisons and application support." },
  "citizenship-services": { icon: DescriptionOutlined, label: "Application support", description: "Find help reviewing residency records, organising documents and preparing citizenship applications." },
  consultation: { icon: SupportAgentOutlined, label: "Personal planning", description: "Discuss your goals, compare options and prepare clear questions for your next step." },
};

function PremiumServicesIndexPage() {
  return (
    <PortalPageLayout page={page} bannerKey="premium-services" bannerImage="/images/page-banners/full-width/services.webp">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Explore your options</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Find the right kind of support</h2></div>
        <p className="max-w-sm text-sm leading-7 text-slate-500">Service inclusions vary. Ask for a written quote and confirm the details that matter to your case.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {premiumServiceItems.map(service => {
          const details = presentation[service.slug];
          const Icon = details.icon;
          return (
            <article key={service.slug} data-premium-service={service.slug} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg hover:shadow-blue-950/5">
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icon aria-hidden="true" /></span><span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{details.label}</span></div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">{service.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{details.description}</p>
              </div>
              <div className="mx-6 border-t border-slate-100 pt-5 sm:mx-7"><p className="text-xs font-semibold text-slate-800">Support to explore</p><ul className="mt-3 space-y-2.5 pb-6">{service.benefits.map(benefit => <li key={benefit} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><CheckRounded sx={{ fontSize: 16, color: "#2563eb", mt: "3px", flexShrink: 0 }} aria-hidden="true" /><span>{benefit}</span></li>)}</ul></div>
              <Link href={`/premium-services/${service.slug}`} className="mt-auto flex min-h-14 items-center justify-between gap-3 border-t border-slate-100 bg-[#f8fafc] px-6 py-4 text-sm font-semibold text-[#1f2a77] transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-blue-600 sm:px-7"><span>View {service.title.toLowerCase()} details</span><ArrowForwardRounded sx={{ fontSize: 18 }} aria-hidden="true" /></Link>
            </article>
          );
        })}
      </div>
      <section className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#1f2a77] p-6 text-white sm:p-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl"><h2 className="text-xl font-bold">Not sure where to start?</h2><p className="mt-3 text-sm leading-7 text-white/80">Share your destination and goal so you can ask about relevant services, fees and the next steps available.</p></div>
        <LeadGenerationButton label="Request a service quote" variant="light" className="shrink-0 rounded-xl" />
      </section>
    </PortalPageLayout>
  );
}

PremiumServicesIndexPage.useDefaultLayout = true;
export default PremiumServicesIndexPage;
