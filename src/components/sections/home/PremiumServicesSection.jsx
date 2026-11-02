import Link from "next/link";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { premiumServiceItems } from "./homeData";

const servicePresentation = {
  "work-visa": { icon: WorkOutlineRoundedIcon, label: "Work & careers", description: "Explore support for work visa preparation, employer documents and interview planning." },
  "study-visa": { icon: SchoolOutlinedIcon, label: "Study abroad", description: "Plan your study journey with help choosing courses and preparing student visa documents." },
  "family-sponsorship": { icon: GroupsOutlinedIcon, label: "Family & relocation", description: "Find guidance on the documents and planning involved in family sponsorship." },
  "permanent-residency": { icon: PublicOutlinedIcon, label: "Long-term plans", description: "Compare residency pathways and explore support with your profile and application." },
  "visitor-visa": { icon: FlightTakeoffRoundedIcon, label: "Travel & visits", description: "Prepare travel-purpose documents, itineraries and supporting records for your visit." },
  "canada-immigration": { icon: MapOutlinedIcon, label: "Destination support", description: "Explore Canada-focused planning, profile preparation and immigration service options." },
  "citizenship-services": { icon: DescriptionOutlinedIcon, label: "Application support", description: "Find help organising residency records, reviewing documents and preparing your application." },
  consultation: { icon: SupportAgentOutlinedIcon, label: "Personal guidance", description: "Discuss your goals, understand the options and plan your next steps with a provider." },
};

export default function PremiumServicesSection() {
  return (
    <section id="premium-services" aria-labelledby="home-premium-heading" className="bg-[#f5f7fc] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            <WorkspacePremiumOutlinedIcon aria-hidden="true" sx={{ fontSize: 19 }} />
            What We Offer
          </p>
          <h2 id="home-premium-heading" className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Premium Immigration Services</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Focused support for your work, study, family and relocation plans. Explore the services that match your next step.</p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:mt-8">
          {premiumServiceItems.map((service) => {
            const details = servicePresentation[service.slug];
            const Icon = details.icon;
            return (
              <article key={service.slug} data-home-premium-service={service.slug} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5 motion-safe:hover:-translate-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-[#1f2a77]">
                    <Icon aria-hidden="true" sx={{ fontSize: 20 }} />
                  </span>
                  <span className="text-right text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-500">{details.label}</span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{service.title}</h3>
                <p className="mb-4 mt-1.5 text-xs leading-5 text-slate-600">{details.description}</p>
                <Link href={`/premium-services/${service.slug}`} aria-label={`Explore ${service.title}`} className="mt-auto flex min-h-11 items-center justify-between gap-3 border-t border-slate-100 pt-2 text-xs font-semibold text-[#1f2a77] transition hover:text-blue-700 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
                  Explore service
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-blue-700 transition group-hover:bg-blue-50"><ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 16 }} /></span>
                </Link>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
