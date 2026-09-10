import PageHeader from '../../shared/ui/PageHeader.jsx';

export default function AccountingPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Head Office Accounting" subtitle="Only HO-level expenses are included. Local Param Mitra expenses are excluded per policy." />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          ['Total HO Spend', '₹1,45,000', 'border-slate-500'],
          ['Material Spend', '₹92,000', 'border-blue-500'],
          ['Travel Spend', '₹35,000', 'border-emerald-500'],
          ['Reimbursement Pending', '₹18,000', 'border-amber-500'],
        ].map(([t, v, c]) => (
          <div key={t} className={`bg-white border border-slate-200 border-l-4 ${c} rounded-xl p-4 shadow-sm`}>
            <p className="text-xs text-slate-500 font-medium">{t}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
