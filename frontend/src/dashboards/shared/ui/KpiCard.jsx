export default function KpiCard({ title, value, sub, color, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left transition hover:shadow-md hover:-translate-y-0.5 duration-150 border-l-4 ${color} w-full`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 leading-none">{value}</p>
          {sub && <p className="text-[11px] text-slate-500 mt-1.5 truncate">{sub}</p>}
        </div>
        <div className="shrink-0 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </button>
  );
}
