export default function PortalFeaturePanel({ title, label, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
      <div className="grid lg:grid-cols-[0.75fr_1.65fr]">
        <div className="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">{label}</p>
          <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
          <div className="mt-4 h-[3px] w-10 rounded-full bg-[#f5c542]" />
        </div>
        <div className="p-6 text-sm leading-7 text-slate-600 sm:p-8">{children}</div>
      </div>
    </section>
  );
}
