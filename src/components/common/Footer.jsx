import Link from "next/link";
import Image from "next/image";
import SiteLogo from "@/images/site-logo.png";
import { marketplaceTabs } from "../sections/home/homeData";
import LeadGenerationButton from "./LeadGenerationButton";

const importantLinks = [
  { label: "Marketplace", href: "/services/immigration-services" },
  { label: "Categories", href: "#categories" },
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
  const serviceGroups = marketplaceTabs.map((tab) => ({
    slug: serviceDetailSlugMap[tab.slug] || tab.slug,
    heading: tab.name,
    services: tab.services,
  }));

  return (
    <footer className="border-t border-slate-200/10 bg-[#1f2a77] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] xl:gap-14">
          <div className="min-w-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-white/70">
              <Image src={SiteLogo} alt="Immify" width={76} height={76} className="h-[76px] w-[76px] object-contain" priority />
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
              We connect aspiring movers with trusted consultants, practical guidance, and end-to-end planning for visas, education, and relocation.
            </p>
            <div className="mt-6">
              <LeadGenerationButton label="Get Quote" variant="light" />
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Important Link</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {importantLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Main Page</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {mainPageLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">About Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {aboutCompanyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/75 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="grid items-start gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {serviceGroups.map((group) => (
              <div key={group.heading} className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/90">{group.heading}</p>
                <ul className="mt-3 space-y-1 text-xs leading-6 text-white/70">
                  {group.services.map((service) => (
                    <li key={`${group.heading}-${service}`}>
                      <Link href={`/services/${group.slug}`} className="transition hover:text-white">
                        {service}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/70">
          <p>© 2026 Immify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
