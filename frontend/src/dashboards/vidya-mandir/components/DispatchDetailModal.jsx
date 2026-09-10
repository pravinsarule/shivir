import { X, Printer } from 'lucide-react';
import { Th, Td } from '../../shared/ui/Table.jsx';

export default function DispatchDetailModal({
  dispatch, onClose, onUpdate, onPack, onShip, onShowChallan,
}) {
  if (!dispatch) return null;

  const updateField = (key, val) => onUpdate(prev => ({ ...prev, [key]: val }));

  const updateItem = (idx, key, val) => {
    onUpdate(prev => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [key]: val };
      return { ...prev, items };
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-900 text-white px-5 py-4 flex items-center justify-between sm:rounded-t-2xl">
          <div>
            <p className="font-bold text-base leading-tight">{dispatch.event} · {dispatch.city}</p>
            <p className="text-xs text-slate-400 mt-0.5">ID: {dispatch.id} · Req: <span className="text-emerald-400 font-semibold">{dispatch.reqStatus}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
            {[['Receiver 1', 'receiver1'], ['Receiver 2', 'receiver2']].map(([label, key]) => (
              <div key={key}>
                <p className="font-semibold text-slate-500 mb-1">{label}</p>
                <input
                  value={dispatch[key]}
                  onChange={e => updateField(key, e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-amber-500 outline-none"
                />
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse min-w-[400px]">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><Th>Item</Th><Th>Req Qty</Th><Th>Stock</Th><Th>Sent Qty</Th><Th>Baggage</Th></tr></thead>
              <tbody>
                {dispatch.items.map((it, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <Td className="font-semibold">{it.name}</Td>
                    <Td><span className="font-bold text-amber-700">{it.req} {it.unit}</span></Td>
                    <Td><span className={it.stock < it.req ? 'text-rose-700 font-bold' : 'text-slate-600'}>{it.stock} {it.unit}</span></Td>
                    <Td>
                      <input type="number" value={it.sent} onChange={e => updateItem(idx, 'sent', Number(e.target.value))} className="w-20 border border-slate-300 rounded-lg px-2 py-1.5 font-bold text-xs focus:border-amber-500 outline-none" />
                    </Td>
                    <Td>
                      <input value={it.baggage} onChange={e => updateItem(idx, 'baggage', e.target.value)} className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:border-amber-500 outline-none font-mono" />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button onClick={() => onShowChallan(dispatch)} className="flex items-center justify-center gap-2 text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition">
              <Printer className="h-4 w-4" /> Print Delivery Challan
            </button>
            <div className="flex gap-3">
              <button onClick={() => onPack(dispatch.id)} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition">
                ✓ Packing Complete
              </button>
              <button onClick={() => onShip(dispatch)} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition">
                🚚 Mark In Transit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
