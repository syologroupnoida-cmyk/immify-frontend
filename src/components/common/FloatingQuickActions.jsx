import Link from "next/link";
import {
  CampaignOutlined,
  FormatListBulletedOutlined,
} from "@mui/icons-material";

const actions = [
  {
    label: "Advertise",
    href: "/advertise",
    className: "bg-[#e5390f] hover:bg-[#cf330e] focus-visible:outline-[#e5390f]",
    icon: <CampaignOutlined sx={{ fontSize: 16 }} />,
  },
  {
    label: "Listing",
    href: "/agent/login",
    className: "bg-[#0875d1] hover:bg-[#0668ba] focus-visible:outline-[#0875d1]",
    icon: <FormatListBulletedOutlined sx={{ fontSize: 16 }} />,
  },
];

export default function FloatingQuickActions() {
  return (
    <aside
      className="fixed right-[calc(100vw-100%)] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
      aria-label="Quick business actions"
    >
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`group flex h-24 w-10 items-center justify-center overflow-hidden rounded-l-[7px] text-white shadow-md shadow-slate-950/20 transition hover:w-11 focus-visible:outline-2 focus-visible:outline-offset-2 ${action.className}`}
          aria-label={action.label}
        >
          <span className="flex max-h-[88px] rotate-180 items-center gap-1.5 [writing-mode:vertical-rl]">
            <span className="rotate-90 opacity-95">{action.icon}</span>
            <span className="whitespace-nowrap text-xs font-semibold leading-none tracking-normal">
              {action.label}
            </span>
          </span>
        </Link>
      ))}
    </aside>
  );
}
