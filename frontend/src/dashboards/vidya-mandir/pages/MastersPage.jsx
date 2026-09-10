import { Boxes, Download } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';

const MASTERS = [
  { title: 'General Material', sub: 'Entry Cards, Books, Bags, Banners, Sound …', count: 24 },
  { title: 'ABM Utensils', sub: 'Kadai, Tawa, Thalis, Storage containers …', count: 113 },
  { title: 'ABM Grocery', sub: 'Basmati Rice, Dal, Oil, Spices, Pulses …', count: 94 },
];

export default function MastersPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Foundation Item Masters" subtitle="3 separate masters: General Stock, ABM Utensils, and ABM Grocery." />
      <div className="grid sm:grid-cols-3 gap-5">
        {MASTERS.map(m => (
          <Card key={m.title} className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Boxes className="h-5 w-5 text-amber-600" />
              <Badge label={`${m.count} items`} variant="info" />
            </div>
            <h3 className="font-bold text-slate-900">{m.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{m.sub}</p>
            <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
              <button className="flex-1 text-[11px] font-semibold bg-slate-900 text-white py-1.5 rounded-lg hover:bg-slate-800 transition">View Items</button>
              <button className="flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition border border-slate-200">
                <Download className="h-3 w-3" /> Export
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
