import { useId } from "react";
import { getPortalFaqs } from "@/content/portalFaqs";

export default function PortalFaqs({ pageKey, title = "Frequently asked questions", standalone = false }) {
  const groupId = useId();
  const questions = getPortalFaqs(pageKey);
  if (!questions.length) return null;
  return (
    <section aria-labelledby={`${groupId}-heading`} className={`${standalone ? "" : "mt-12 sm:mt-14"} rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 text-left sm:p-8 lg:p-10`}>
      <div className="grid items-start gap-7 lg:grid-cols-[0.75fr_1.5fr] lg:gap-10">
        <div className="min-w-0 lg:pr-4">
          <span className="inline-flex items-center rounded-md border border-blue-100 bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-[#1f2a77]">FAQs</span>
          <h2 id={`${groupId}-heading`} className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">Clear answers about this page, the services available and what to check before taking your next step.</p>
          <div className="mt-5 h-[3px] w-10 rounded-full bg-[#f5c542]" />
        </div>
        <div className="space-y-3">
          {questions.map(({ question, answer }) => (
            <details key={question} name={groupId} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300 open:border-blue-200 motion-reduce:transition-none">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-blue-600 sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1 text-sm font-semibold leading-6 text-slate-900 group-open:text-[#1f2a77] sm:text-base">{question}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#1f2a77] group-open:border-blue-100 group-open:bg-blue-50" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 7h8" /><path d="M7 3v8" className="group-open:opacity-0" /></svg>
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6"><p className="border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">{answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
