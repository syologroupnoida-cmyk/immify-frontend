import Link from "next/link";
import Image from "next/image";
import {
  AccountBalanceOutlined,
  AutoStoriesOutlined,
  Login,
  MenuBookOutlined,
  PersonAddAlt1,
  SchoolOutlined,
} from "@mui/icons-material";
import SiteLogo from "@/images/site-logo.png";

const navItems = [
  { label: "Universities", href: "#top-universities", Icon: AccountBalanceOutlined },
  { label: "Courses", href: "#popular-courses", Icon: MenuBookOutlined },
  { label: "Partner Schools", href: "#partner-schools", Icon: SchoolOutlined },
  { label: "Stories", href: "#success-stories", Icon: AutoStoriesOutlined },
];

export default function PartnerHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/partner" className="flex items-center">
          <Image src={SiteLogo} alt="Immify" width={72} height={72} className="h-16 w-auto object-contain" priority />
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
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <Login sx={{ fontSize: 18 }} />
            Login
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
          >
            <PersonAddAlt1 sx={{ fontSize: 18 }} />
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}
