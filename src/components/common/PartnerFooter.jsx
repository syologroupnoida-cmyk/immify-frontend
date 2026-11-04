import Link from "next/link";
import Image from "next/image";
import ImmifyLogo from "@/images/immify-logo.png";

const footerLinks = [
  { label: "Visit Immify", href: "/" },
  { label: "Partner login", href: "/partner/login" },
  { label: "Contact us", href: "/contact" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Platform disclaimer", href: "/legal" },
];

export default function PartnerFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#f7f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <Link href="/partner" aria-label="Immify partner home" className="flex items-center gap-3 self-start rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full"><Image src={ImmifyLogo} alt="Immify" width={44} height={44} className="h-full w-full scale-[1.9] rounded-full object-contain" /></span>
            <span><span className="block text-sm font-semibold text-slate-900">Immify Partner Network</span><span className="mt-1 block text-xs text-slate-500">Expertise that connects people and possibilities.</span></span>
          </Link>
          <nav aria-label="Partner footer" className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium text-slate-600">
            {footerLinks.map(({ label, href }) => <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded hover:text-[#1f2a77] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">{label}</Link>)}
          </nav>
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4 text-[11px] leading-5 text-slate-500">
          <p>&copy; 2026 Immify. All rights reserved.</p>
          <p>Connecting immigration and education professionals.</p>
        </div>
      </div>
    </footer>
  );
}
