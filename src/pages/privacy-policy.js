import Link from "next/link";
import PortalPageLayout from "@/components/common/PortalPageLayout";
import { privacyPage, privacySections } from "@/content/privacyPolicy";

function PrivacyPolicyPage() {
  return (
    <PortalPageLayout page={privacyPage} bannerKey="privacy-policy" bannerImage="/images/page-banners/full-width/legal.webp">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Your information. Clear choices.</p>
        <p className="text-xs text-slate-500">Last updated: <time dateTime="2026-10-26">26 October 2026</time></p>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-9">
        <aside className="min-w-0 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 lg:sticky lg:top-28 lg:p-5">
          <h2 className="px-2 text-sm font-bold text-slate-900">In this policy</h2>
          <nav aria-label="Privacy policy sections" className="mt-3">
            <ol className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:pb-0">
              {privacySections.map((section, index) => <li key={section.id} className="shrink-0 lg:shrink"><a href={`#${section.id}`} className="flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-xs leading-5 text-slate-600 transition hover:bg-white hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"><span className="font-semibold tabular-nums text-blue-700">{String(index + 1).padStart(2, "0")}</span><span>{section.title}</span></a></li>)}
            </ol>
          </nav>
          <div className="mt-4 hidden border-t border-slate-200 px-2 pt-4 lg:block"><p className="text-xs leading-6 text-slate-600">Have a question about your information?</p><Link href="/contact" className="mt-2 inline-block text-sm font-semibold text-blue-700">Contact Immify</Link></div>
        </aside>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {privacySections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-slate-200 p-6 last:border-b-0 sm:p-8">
              <div className="flex items-start gap-3"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2 className="text-xl font-bold leading-snug text-slate-900">{section.title}</h2></div>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                {section.items && <ul className="list-disc space-y-3 pl-5">{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
                {section.links?.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-block font-semibold text-blue-700 underline underline-offset-4">{link.label}</a>)}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-sm"><Link href="/contact" className="inline-flex min-h-11 items-center rounded-xl bg-[#1f2a77] px-5 font-semibold text-white hover:bg-[#17215f]">Raise a privacy question</Link><Link href="/legal" className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-5 font-semibold text-blue-700 hover:bg-slate-50">Read the platform disclaimer</Link></div>
    </PortalPageLayout>
  );
}

PrivacyPolicyPage.useDefaultLayout = true;
export default PrivacyPolicyPage;
