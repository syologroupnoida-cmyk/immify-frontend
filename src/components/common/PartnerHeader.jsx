import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AccountBalanceOutlined,
  AccountCircleOutlined,
  AutoStoriesOutlined,
  KeyboardArrowDown,
  MenuBookOutlined,
  PersonAddAlt1,
  SchoolOutlined,
} from "@mui/icons-material";
import ImmifyLogo from "@/images/immify-logo.png";

const navItems = [
  { label: "Universities", href: "#top-universities", Icon: AccountBalanceOutlined },
  { label: "Courses", href: "#popular-courses", Icon: MenuBookOutlined },
  { label: "Partner Schools", href: "#partner-schools", Icon: SchoolOutlined },
  { label: "Stories", href: "#success-stories", Icon: AutoStoriesOutlined },
];

export default function PartnerHeader() {
  const [signInOpen, setSignInOpen] = useState(false);
  const signInRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!signInRef.current?.contains(event.target)) setSignInOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/partner" className="flex items-center">
          <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
            <Image src={ImmifyLogo} alt="Immify" width={80} height={80} className="h-full w-full scale-[1.9] rounded-full object-contain" priority />
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 lg:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="inline-flex items-center gap-1.5 transition hover:text-blue-700">
              <item.Icon sx={{ fontSize: 17 }} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div ref={signInRef} className="relative">
            <button
              type="button"
              onClick={() => setSignInOpen((open) => !open)}
              aria-expanded={signInOpen}
              aria-haspopup="menu"
              className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-blue-200 bg-white px-2.5 text-xs font-semibold text-blue-800 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <AccountCircleOutlined sx={{ fontSize: 16 }} />
              Sign in
              <KeyboardArrowDown sx={{ fontSize: 15 }} />
            </button>
            {signInOpen && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                <Link role="menuitem" href="/partner/login" className="block px-3 py-2 text-sm text-slate-800 hover:bg-blue-50">Partner sign in</Link>
                <Link role="menuitem" href="/agent/login" className="block px-3 py-2 text-sm text-slate-800 hover:bg-blue-50">Agent sign in</Link>
                <Link role="menuitem" href="/user/login" className="block px-3 py-2 text-sm text-slate-800 hover:bg-blue-50">Customer sign in</Link>
              </div>
            )}
          </div>
          <Link
            href="/partner/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
          >
            <PersonAddAlt1 sx={{ fontSize: 18 }} />
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
