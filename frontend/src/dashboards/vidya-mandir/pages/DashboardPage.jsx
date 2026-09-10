import {
  AlertTriangle, X, Building2, PackageCheck, ArrowRightLeft,
  AlertCircle, ChevronRight,
} from 'lucide-react';
import Card from '../../shared/ui/Card.jsx';
import KpiCard from '../../shared/ui/KpiCard.jsx';
import Badge from '../../shared/ui/Badge.jsx';
import { TableWrap, Th, Td } from '../../shared/ui/Table.jsx';
import { reqVariant, packVariant, delivVariant } from '../utils.js';

export default function DashboardPage({
  stockError, onDismissError, dispatches, onNavigate, onSelectDispatch,
}) {
  return (
    <div className="space-y-6">
      {stockError && (
        <div className="flex items-start gap-3 bg-rose-600 text-white p-4 rounded-xl shadow-lg border-l-4 border-rose-900">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Stock Blocked — Dispatch Cannot Continue</p>
            <p className="text-xs text-rose-100 mt-0.5">{stockError}</p>
          </div>
          <button onClick={onDismissError} className="shrink-0 hover:bg-rose-700 rounded p-1 transition"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Active Events" value="3 Events" sub="Delhi, Jamnagar, Surat" color="border-blue-500" icon={Building2} onClick={() => onNavigate('events')} />
        <KpiCard title="Dispatches Pending" value="2 Finalised" sub="Awaiting packing / shipping" color="border-amber-500" icon={PackageCheck} onClick={() => onNavigate('dispatch')} />
        <KpiCard title="Materials In Transit" value="1 Shipment" sub="Surat Craft Fair" color="border-violet-500" icon={ArrowRightLeft} onClick={() => onNavigate('transfers')} />
        <KpiCard title="Low Stock Alerts" value="1 Item" sub="Entry Cards — shortfall 1,800" color="border-rose-500" icon={AlertTriangle} onClick={() => onNavigate('stock')} />
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <h2 className="font-bold text-slate-900">Today's Operations &amp; Urgent Alerts</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { tag: 'Packing Required', tagColor: 'bg-amber-100 text-amber-800', title: '1. Dispatch Awaiting Packing', body: 'Delhi Shiksha Camp requirement is Finalised by Event Head. Ready for VM packing.', action: () => onNavigate('dispatch'), actionLabel: 'Open Dispatch' },
            { tag: 'Stock Warning', tagColor: 'bg-rose-100 text-rose-800', title: '2. Negative Stock Warning', body: 'Entry Cards: 3,200 available vs 5,000 requested. Purchase required before shipping.', action: () => onNavigate('stock'), actionLabel: 'Manage Stock' },
            { tag: 'Travel Alert', tagColor: 'bg-blue-100 text-blue-800', title: '3. PNR Missing', body: "Meera Joshi's return from Surat is missing PNR. Ticket update required.", action: () => onNavigate('travel'), actionLabel: 'Manage Travel' },
          ].map((a, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${a.tagColor}`}>{a.tag}</span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{a.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.body}</p>
              </div>
              <button onClick={a.action} className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-auto">
                {a.actionLabel} <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Live Dispatch Pipeline</h2>
          <button onClick={() => onNavigate('dispatch')} className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            View All <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <TableWrap>
          <thead><tr><Th>Dispatch ID</Th><Th>Event &amp; City</Th><Th>Requirement</Th><Th>Packing</Th><Th>Delivery</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {dispatches.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition">
                <Td><span className="font-mono font-bold text-slate-700">{d.id}</span></Td>
                <Td>
                  <p className="font-semibold text-slate-900">{d.event}</p>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{d.city}</span>
                </Td>
                <Td><Badge label={d.reqStatus} variant={reqVariant(d.reqStatus)} /></Td>
                <Td><Badge label={d.packingStatus} variant={packVariant(d.packingStatus)} /></Td>
                <Td><Badge label={d.deliveryStatus} variant={delivVariant(d.deliveryStatus)} /></Td>
                <Td>
                  <button onClick={() => onSelectDispatch(d)} className="bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition">
                    Manage
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
    </div>
  );
}
