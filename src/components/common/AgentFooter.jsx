import Link from "next/link";
import Image from "next/image";
import ImmifyLogo from "@/images/immify-logo.png";

export default function AgentFooter() {
  return (
    <footer id="agent-footer" className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Image src={ImmifyLogo} alt="Immify" width={64} height={64} className="h-full w-full scale-[1.9] rounded-full object-contain" />
          </span>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Trusted support for immigration and travel partners.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-500">
          <Link href="/agent" className="transition hover:text-sky-700">Agent Home</Link>
          <a href="#why-us" className="transition hover:text-sky-700">Why Us</a>
          <a href="#verification" className="transition hover:text-sky-700">Sign Up</a>
          <span className="text-slate-400">© 2026 Immify</span>
        </div>
      </div>
    </footer>
  );
}
