import Link from "next/link";
import Image from "next/image";
import SiteLogo from "@/images/site-logo.png";

const quickLinks = [
  { label: "Partner Home", href: "/partner" },
  { label: "Top Universities", href: "#top-universities" },
  { label: "Partner Schools", href: "#partner-schools" },
  { label: "Student Stories", href: "#success-stories" },
];

export default function PartnerFooter() {
  return (
    <footer className="bg-[#132a7a] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src={SiteLogo} alt="Immify" width={58} height={58} className="h-12 w-auto object-contain" />
            <div>
              <p className="text-xl font-extrabold">Immify Partner</p>
              <p className="text-sm text-white/70">Helping students join top global universities.</p>
            </div>
          </div>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">
            Explore trusted schools, expert counseling, and clear admission pathways for students planning to study abroad.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Quick Links</h3>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            {quickLinks.map((item) => (
              <Link key={item.label} href={item.href} className="block transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Support</h3>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <a href="#" className="block transition hover:text-white">Talk to an Expert</a>
            <a href="#" className="block transition hover:text-white">Counseling Session</a>
            <a href="#" className="block transition hover:text-white">Partner Assistance</a>
            <a href="mailto:support@immify.example" className="block transition hover:text-white">support@immify.example</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Immify Partner. All rights reserved.</p>
          <p>Trusted global admission support</p>
        </div>
      </div>
    </footer>
  );
}
