import Link from "next/link";
import Image from "next/image";
import SiteLogo from "@/images/site-logo.png";
import { marketplaceTabs } from "../sections/home/homeData";

const importantLinks = [
  { label: "Marketplace", href: "/marketplace" },
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

export default function Footer() {
  const serviceGroups = marketplaceTabs.map((tab) => ({
    slug: tab.slug,
    heading: tab.name,
    services: tab.services,
  }));

  return (
    <footer className="border-t border-slate-200/10 bg-[#1f2a77] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] xl:gap-14">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Image src={SiteLogo} alt="Immify" width={56} height={56} className="h-14 w-14 object-contain" priority />
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
              We connect aspiring movers with trusted consultants, practical guidance, and end-to-end planning for visas, education, and relocation.
            </p>
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
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">Our Services</h3>
          <div className="mt-5 grid items-start gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {serviceGroups.map((group) => (
              <div key={group.heading} className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/90">{group.heading}</p>
                <ul className="mt-3 space-y-1 text-xs leading-6 text-white/70">
                  {group.services.map((service) => (
                    <li key={`${group.heading}-${service}`}>
                      <Link
                        href={{ pathname: "/marketplace", query: { category: group.slug, service } }}
                        className="transition hover:text-white"
                      >
                        {service}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Immify. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span>Trusted by global movers</span>
            <span>•</span>
            <span>Fast response support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
