export default function PortalContentSections({ sections = [] }) {
  return sections.map((section, sectionIndex) => {
    const isProcess = /how .*works|how to join/i.test(section.heading);
    const List = isProcess ? "ol" : "ul";
    return (
      <section key={section.heading} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
        <div className="grid lg:grid-cols-[0.75fr_1.65fr]">
          <div className="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <span className="text-xs font-bold tabular-nums tracking-widest text-blue-700" aria-hidden="true">{String(sectionIndex + 1).padStart(2, "0")}</span>
            <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">{section.heading}</h2>
            <div className="mt-4 h-[3px] w-10 rounded-full bg-[#f5c542]" />
          </div>
          <div className="p-6 sm:p-8">
            {section.items.length === 1 ? <p className="max-w-prose text-[15px] leading-8 text-slate-600">{section.items[0]}</p> : (
              <List className={`grid gap-4 ${isProcess ? "" : "sm:grid-cols-2"}`}>
                {section.items.map((item, index) => {
                  const text = isProcess ? item.replace(/^\d+\.\s*/, "") : item;
                  const colon = text.indexOf(": ");
                  return (
                    <li key={item} className="flex items-start gap-3 rounded-xl bg-[#f8fafc] p-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700" aria-hidden="true">{isProcess ? index + 1 : <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3 3 7-7" /></svg>}</span>
                      <p className="min-w-0 text-sm leading-7 text-slate-600">{colon > 0 && colon < 45 ? <><strong className="mb-1 block font-semibold text-slate-900">{text.slice(0, colon)}</strong>{text.slice(colon + 2)}</> : text}</p>
                    </li>
                  );
                })}
              </List>
            )}
          </div>
        </div>
      </section>
    );
  });
}
