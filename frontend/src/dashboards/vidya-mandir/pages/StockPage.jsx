import { AlertCircle, Eye } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import { TableWrap, Th, Td } from '../../shared/ui/Table.jsx';

export default function StockPage({ stockList, onViewLedger }) {
  return (
    <div className="space-y-5">
      <PageHeader title="Append-Only Stock Ledger" subtitle="Balance is computed from dated transactions. Stock quantities are never manually overwritten." />
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-900">
        <AlertCircle className="h-4 w-4 shrink-0 text-blue-600" />
        <span>Every movement (Purchase, Dispatch, Return, Transfer) is recorded. Current balance = sum of all ledger entries.</span>
      </div>
      <Card>
        <TableWrap>
          <thead>
            <tr>
              <Th>Item</Th><Th>Category</Th><Th>Opening</Th>
              <Th><span className="text-emerald-700">Purchased</span></Th>
              <Th><span className="text-rose-700">Dispatched</span></Th>
              <Th><span className="text-emerald-700">Returned</span></Th>
              <Th><span className="text-blue-700 font-bold">Balance</span></Th>
              <Th>Exp. Return</Th><Th>Ledger</Th>
            </tr>
          </thead>
          <tbody>
            {stockList.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition">
                <Td className="font-semibold text-slate-900">{s.name}</Td>
                <Td className="text-slate-500">{s.category}</Td>
                <Td>{s.opening.toLocaleString()}</Td>
                <Td className="text-emerald-700 font-semibold">+{s.purchases.toLocaleString()}</Td>
                <Td className="text-rose-700 font-semibold">−{s.dispatched.toLocaleString()}</Td>
                <Td className="text-emerald-700 font-semibold">+{s.returned.toLocaleString()}</Td>
                <Td>
                  <span className={`font-bold text-sm px-2 py-0.5 rounded ${s.currentBalance < 500 ? 'bg-rose-100 text-rose-800' : 'bg-blue-50 text-blue-900'}`}>
                    {s.currentBalance.toLocaleString()}
                  </span>
                </Td>
                <Td className="text-amber-700 font-medium">+{s.expectedReturn.toLocaleString()}</Td>
                <Td>
                  <button onClick={() => onViewLedger(s)} className="bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Timeline
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
