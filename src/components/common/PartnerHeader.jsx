import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ImmifyLogo from "@/images/immify-logo.png";

const navItems = [
  { label: "Home", href: "/partner#partner-home" },
  { label: "Why Partner", href: "/partner#why-partner" },
  { label: "How It Works", href: "/partner#how-it-works" },
  { label: "Who Can Join", href: "/partner#partner-types" },
  { label: "Resources", href: "/blog" },
];

export default function PartnerHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const selectLink = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md" onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/partner" aria-label="Immify partner home" className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"><Image src={ImmifyLogo} alt="Immify" width={56} height={56} className="h-full w-full scale-[1.9] rounded-full object-contain" preload /></span>
        </Link>
        <nav aria-label="Partner navigation" className="ml-auto hidden items-center gap-5 xl:gap-7 lg:flex">
          {navItems.map((item) => <Link key={item.label} href={item.href} onClick={selectLink} className="inline-flex min-h-11 items-center rounded-md text-xs font-semibold text-slate-600 transition-colors hover:text-[#1f2a77] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">{item.label}</Link>)}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-5">
          <Link href="/partner/login" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#1f2a77] px-3 text-xs font-semibold text-[#1f2a77] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Login</Link>
          <Link href="/partner/sign-up" aria-label="Become a Partner" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1f2a77] px-3 text-xs font-semibold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"><span className="sm:hidden">Join</span><span className="hidden sm:inline">Become a Partner</span><ArrowForwardRoundedIcon aria-hidden="true" sx={{ fontSize: 16 }} /></Link>
          <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-controls="partner-mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1f2a77] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700 lg:hidden">{menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}</button>
        </div>
      </div>
      {menuOpen && <nav id="partner-mobile-navigation" aria-label="Partner mobile navigation" className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">{navItems.map((item) => <Link key={item.label} href={item.href} onClick={selectLink} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-700">{item.label}</Link>)}</nav>}
    </header>
  );
}
