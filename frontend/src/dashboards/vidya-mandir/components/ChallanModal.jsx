import { Printer } from 'lucide-react';

export default function ChallanModal({ challan, onClose }) {
  if (!challan) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl print:shadow-none">
        <div className="p-8 print:p-6">
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-6">
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-slate-900">SHIBIR FOUNDATION</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mt-0.5">Delivery Challan & Gate Pass</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-slate-900">#{challan.id}</p>
              <p className="text-xs text-slate-500">{new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Destination</p>
              <p className="font-bold text-slate-900">{challan.event}</p>
              <p className="text-slate-600">City: {challan.city}</p>
              <p className="text-slate-600 mt-1">{challan.address}</p>
            </div>
            <div>
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Receivers</p>
              <p className="text-slate-800 font-medium">{challan.receiver1}</p>
              <p className="text-slate-800 font-medium mt-1">{challan.receiver2}</p>
            </div>
          </div>

          <table className="w-full text-xs text-left border border-slate-300 rounded-xl overflow-hidden mb-6">
            <thead><tr className="bg-slate-200 border-b border-slate-300"><th className="p-3">Item</th><th className="p-3">Req Qty</th><th className="p-3">Sent Qty</th><th className="p-3">Baggage</th></tr></thead>
            <tbody>
              {challan.items.map((it, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="p-3 font-semibold">{it.name}</td>
                  <td className="p-3">{it.req} {it.unit}</td>
                  <td className="p-3 font-bold">{it.sent || it.req} {it.unit}</td>
                  <td className="p-3 font-mono font-bold text-amber-800">{it.baggage}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-4">
            <div>
              <p className="font-bold text-slate-700">Prepared By: Vidya Mandir HQ</p>
              <p>Dispatched By: Transport Logistics</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button onClick={() => window.print()} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-slate-800 transition">
                <Printer className="h-4 w-4" /> Print
              </button>
              <button onClick={onClose} className="bg-slate-100 border border-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-200 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
