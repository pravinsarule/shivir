import { FileText, ChevronRight } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';

const REPORTS = [
  'Stock Movement Report', 'Dispatch History', 'Travel Expenditure',
  'Reimbursement Report', 'Settlement Statement', 'Audit Trail Log',
  'Event-wise Summary', 'Cost per Event', 'Transfer Report',
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Audit Trail & Reports" subtitle="Complete operational history — all records are immutable and append-only." />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map(r => (
          <Card key={r} className="p-4 flex items-center justify-between gap-3 hover:shadow-md transition cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition">{r}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition" />
          </Card>
        ))}
      </div>
    </div>
  );
}
