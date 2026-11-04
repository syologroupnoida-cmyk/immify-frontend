import { FlagOutlined, TravelExploreOutlined, ForumOutlined, TaskAltRounded } from "@mui/icons-material";
import content from "@/content/portalContent.json";

const icons = [FlagOutlined, TravelExploreOutlined, ForumOutlined, TaskAltRounded];

export default function HowItWorksSection() {
  const sections = content["/"].sections;
  const process = sections.find(section => section.heading === "How Immify works");
  return (
    <section aria-labelledby="how-immify-works" className="bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Your journey, step by step</p><h2 id="how-immify-works" className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">How Immify works</h2></div>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {process.items.map((item, index) => {
            const text = item.replace(/^\d+\.\s*/, "");
            const separator = text.indexOf(":");
            const Icon = icons[index];
            return (
              <li key={item} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icon aria-hidden="true" /></span><span className="text-2xl font-bold tabular-nums text-slate-200" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
                <h3 className="text-lg font-semibold text-slate-900">{separator < 0 ? text : text.slice(0, separator)}</h3>
                {separator >= 0 && <p className="mt-3 text-sm leading-7 text-slate-600">{text.slice(separator + 1).trim()}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
