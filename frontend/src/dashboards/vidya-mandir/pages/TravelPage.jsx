import { Plane, RefreshCw, Receipt } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';
import { TableWrap, Th, Td } from '../../shared/ui/Table.jsx';

export default function TravelPage({ travels }) {
  return (
    <div className="space-y-5">
      <PageHeader title="Travel & Ticket Management" subtitle="Vidya Mandir books tickets based on Event Head requests. Payable = Booking − Refund." />
      <div className="grid sm:grid-cols-3 gap-4">
        {[['Total Booked', '₹6,300', Plane, 'border-blue-500'], ['Total Refunds', '₹300', RefreshCw, 'border-emerald-500'], ['Total Payable', '₹6,000', Receipt, 'border-amber-500']].map(([t, v, I, c]) => (
          <div key={t} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${c} p-4 shadow-sm`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">{t}</p>
              <I className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{v}</p>
          </div>
        ))}
      </div>
      <Card>
        <TableWrap>
          <thead><tr><Th>Traveller</Th><Th>Event</Th><Th>Route &amp; Date</Th><Th>PNR</Th><Th>Booking</Th><Th>Refund</Th><Th>Payable</Th><Th>Onward Split</Th></tr></thead>
          <tbody>
            {travels.map(t => {
              const payable = t.bookingAmount - t.refundAmount;
              return (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <Td className="font-semibold">{t.traveller}</Td>
                  <Td>{t.event}</Td>
                  <Td>
                    <p className="font-medium">{t.from} → {t.to}</p>
                    <p className="text-slate-400">{t.travelDate}</p>
                  </Td>
                  <Td>
                    {t.pnr === 'MISSING'
                      ? <Badge label="MISSING" variant="danger" />
                      : <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{t.pnr}</span>
                    }
                  </Td>
                  <Td className="font-semibold">₹{t.bookingAmount.toLocaleString()}</Td>
                  <Td className="text-rose-600">₹{t.refundAmount.toLocaleString()}</Td>
                  <Td className="font-bold text-emerald-700">₹{payable.toLocaleString()}</Td>
                  <Td>{t.onwardSplit ? <Badge label="50/50 Split" variant="info" /> : <span className="text-slate-400 text-[11px]">—</span>}</Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Card>
    </div>
  );
}
