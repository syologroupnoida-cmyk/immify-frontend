import Link from "next/link";
import Image from "next/image";
import { Login, PersonAddAlt1 } from "@mui/icons-material";
import ImmifyLogo from "@/images/immify-logo.png";

export default function AgentHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6 lg:px-8">
        <Link href="/agent" className="flex items-center">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full sm:h-20 sm:w-20">
            <Image src={ImmifyLogo} alt="Immify" width={80} height={80} className="h-full w-full scale-[1.9] rounded-full object-contain" priority />
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/agent/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            <Login sx={{ fontSize: 18 }} />
            Login
          </Link>
          <Link
            href="/agent/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-4 py-1.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] transition hover:translate-y-[-1px]"
          >
            <PersonAddAlt1 sx={{ fontSize: 18 }} />
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
