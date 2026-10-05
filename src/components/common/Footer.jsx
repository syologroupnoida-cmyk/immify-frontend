import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ImmifyLogo from "@/images/immify-logo.png";
import { marketplaceTabs } from "../sections/home/homeData";
import LeadGenerationButton from "./LeadGenerationButton";

const importantLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Vendors", href: "/marketplace/vendors" },
  { label: "Universities", href: "/marketplace/universities" },
  { label: "Services", href: "#services" },
  { label: "Premium Services", href: "/premium-services" },
];

const mainPageLinks = [
  { label: "Home", href: "/" },
  { label: "Visa Services", href: "#services" },
  { label: "Immigration News", href: "#about" },
  { label: "Resources", href: "#about" },
];

const aboutCompanyLinks = [
  { label: "About Immify", href: "#about" },
  { label: "Contact Us", href: "#about" },
  { label: "Privacy Policy", href: "#about" },
  { label: "Terms & Conditions", href: "#about" },
];

const serviceDetailSlugMap = {
  "test-prepation": "test-preparation",
  "international-services": "career-employment-services",
  "document-attention-services": "documentation-services",
  "business-setup-services-and-immigration": "business-setup-immigration",
  "helth-insurance": "healthcare-insurance",
  "forex-services": "financial-services",
  "legal-and-complance": "legal-compliance-services",
};

export default function Footer() {
  const [openServiceGroups, setOpenServiceGroups] = useState({});
  const serviceGroups = marketplaceTabs.map((tab) => ({
    slug: serviceDetailSlugMap[tab.slug] || tab.slug,
    heading: tab.name,
    services: tab.services,
  }));

  const toggleServiceGroup = (heading) => {
    setOpenServiceGroups((prev) => ({ ...prev, [heading]: !prev[heading] }));
  };

  return (
    <footer className="relative mt-44 bg-[#111a4f] text-white sm:mt-36 lg:mt-20">
      <section className="absolute left-0 right-0 top-0 z-10 -translate-y-1/2 px-4 sm:px-6 lg:px-8" aria-label="Newsletter signup">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] border border-white/20 bg-white shadow-2xl shadow-slate-900/20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#1f2a77] px-5 py-7 text-white sm:px-8 lg:px-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Newsletter</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Get immigration updates in your inbox</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                Receive market updates, study-abroad reminders, and practical visa planning notes from Immify.
              </p>
            </div>

            <form action="#" className="flex flex-col justify-center gap-4 bg-white px-5 py-6 sm:px-8 lg:px-10">
              <label className="text-sm font-semibold text-slate-800" htmlFor="footer-newsletter-email">
                Email address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <EmailRoundedIcon className="h-5 w-5 text-slate-400" />
                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1f2a77] px-5 text-sm font-semibold text-white transition hover:bg-[#17215f]"
                >
                  Subscribe
                  <SendRoundedIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs leading-5 text-slate-500">No spam. Just useful updates for students, workers, families, and global movers.</p>
            </form>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-56 sm:px-6 sm:pt-44 lg:px-8 lg:pt-32">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.9fr] xl:gap-12">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image src={ImmifyLogo} alt="Immify" width={80} height={80} className="h-full w-full scale-[1.9] rounded-full object-contain" priority />
              </div>
              <div>
                <p className="text-2xl font-bold">Immify</p>
                <p className="mt-1 text-sm text-white/65">Visa, study, relocation, and vendor discovery.</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
              We connect aspiring movers with trusted consultants, practical guidance, and end-to-end planning for visas, education, and relocation.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <LeadGenerationButton label="Get Quote" variant="light" />
              <Link href="/marketplace/vendors" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-4 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10">
                Browse Vendors
              </Link>
            </div>
          </div>

          <FooterLinkGroup title="Explore" links={importantLinks} />
          <FooterLinkGroup title="Main Page" links={mainPageLinks} />

          <div className="min-w-0">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {aboutCompanyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <EmailRoundedIcon className="h-4 w-4 text-sky-200" />
                support@immify.example
              </p>
              <p className="flex items-center gap-2">
                <LocationOnRoundedIcon className="h-4 w-4 text-sky-200" />
                India and global destinations
              </p>
            </div>
          </div>
        </div>

        <div className="py-9">
          <div className="grid items-start gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
            {serviceGroups.map((group) => (
              <ServiceDropdown
                key={group.heading}
                group={group}
                isOpen={Boolean(openServiceGroups[group.heading])}
                onToggle={() => toggleServiceGroup(group.heading)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm text-white/70">
          <p>&copy; 2026 Immify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function ServiceDropdown({ group, isOpen, onToggle }) {
  return (
    <div className="min-w-0 border-b border-white/10 py-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-white/90 transition hover:text-white"
      >
        <span>{group.heading}</span>
        <ExpandMoreRoundedIcon className={`h-5 w-5 shrink-0 text-white/70 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <ul aria-hidden={!isOpen} className={`mt-3 min-h-0 overflow-hidden space-y-1 text-xs leading-6 text-white/70 ${isOpen ? "" : "pointer-events-none"}`}>
          {group.services.map((service) => (
            <li key={`${group.heading}-${service}`}>
              <Link href={`/services/${group.slug}`} className="transition hover:text-white">
                {service}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FooterLinkGroup({ title, links }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-white/75 transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
