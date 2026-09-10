const stats = [
  ["5,000+", "Students Placed"],
  ["99%", "Visa Success Rate"],
  ["100%", "No Hidden Fees"],
  ["100+", "Top Medical Universities"],
];

export default function MbbsStatsSection() {
  return (
    <section className="border-b border-slate-100 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 sm:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="border-slate-200 px-4 py-3 sm:border-r last:border-r-0">
            <p className="text-2xl font-bold text-[#062c53]">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
