import { AlertCircle, Printer } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';
import { TableWrap, Th, Td } from '../../shared/ui/Table.jsx';
import { reqVariant, packVariant, delivVariant } from '../utils.js';

export default function DispatchPage({ dispatches, onSelectDispatch, onShowChallan }) {
  return (
    <div className="space-y-5">
      <PageHeader title="Material Dispatch" subtitle="Manage packing, challan generation, and shipping validation across all events." />
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-900">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
        <span><strong>Business Rule Enforced:</strong> Vidya Mandir can begin packing ONLY after the Event Head marks the requirement as <strong>Finalised</strong>.</span>
      </div>
      <Card>
        <TableWrap>
          <thead><tr><Th>Event / City</Th><Th>Type</Th><Th>Requirement</Th><Th>Packing</Th><Th>Delivery</Th><Th>Expected</Th><Th>Priority</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {dispatches.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition">
                <Td>
                  <p className="font-semibold text-slate-900">{d.event}</p>
                  <p className="text-[10px] text-slate-500">{d.city} · {d.id}</p>
                </Td>
                <Td className="font-medium text-slate-700">{d.type}</Td>
                <Td><Badge label={d.reqStatus} variant={reqVariant(d.reqStatus)} /></Td>
                <Td><Badge label={d.packingStatus} variant={packVariant(d.packingStatus)} /></Td>
                <Td><Badge label={d.deliveryStatus} variant={delivVariant(d.deliveryStatus)} /></Td>
                <Td className="font-mono text-slate-600">{d.expectedDelivery}</Td>
                <Td><Badge label={d.priority} variant={d.priority === 'Urgent' ? 'danger' : d.priority === 'High' ? 'warning' : 'neutral'} /></Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onSelectDispatch(d)} className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition">Manage</button>
                    <button onClick={() => onShowChallan(d)} className="bg-amber-500 text-slate-950 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-amber-400 transition flex items-center gap-1"><Printer className="h-3 w-3" /> Challan</button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
    </div>
  );
}
