import Link from "next/link";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LeadGenerationButton from "@/components/common/LeadGenerationButton";

export default function DestinationEnquiryCard({ title, description, highlights, action, eyebrow = "Plan your next step", headingAs: Heading = "h2" }) {
  return (
    <aside aria-label="Destination guidance" className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_12px_36px_rgba(31,42,119,0.08)] sm:p-6">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#1f2a77]" />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><SupportAgentOutlinedIcon aria-hidden="true" /></span>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{eyebrow}</p>
      </div>
      <Heading className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</Heading>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-slate-700">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><CheckRoundedIcon aria-hidden="true" sx={{ fontSize: 14 }} /></span>{item}
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <p className="mb-3 text-xs leading-5 text-slate-500">Share your goals, destination and timeline to get started.</p>
        <LeadGenerationButton label={action} className="min-h-11 w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700" />
        <Link href="/providers" className="mt-2 flex min-h-11 items-center justify-center text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700">Browse service providers</Link>
      </div>
    </aside>
  );
}
