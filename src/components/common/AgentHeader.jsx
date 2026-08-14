import Link from "next/link";
import Image from "next/image";
import { Login, PersonAddAlt1 } from "@mui/icons-material";
import SiteLogo from "@/images/site-logo.png";

export default function AgentHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6 lg:px-8">
        <Link href="/agent" className="flex items-center">
          <Image src={SiteLogo} alt="Immify" width={82} height={82} className="h-14 w-auto object-contain sm:h-16" priority />
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            <Login sx={{ fontSize: 18 }} />
            Login
          </a>
          <a
            href="#verification"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-4 py-1.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] transition hover:translate-y-[-1px]"
          >
            <PersonAddAlt1 sx={{ fontSize: 18 }} />
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}