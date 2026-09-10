export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>}
    </div>
  );
}
