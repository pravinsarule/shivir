import { X } from 'lucide-react';

export default function LedgerTimelineModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-900 text-white px-5 py-4 flex items-center justify-between sm:rounded-t-2xl">
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-xs text-slate-400">Balance: <span className="text-blue-400 font-bold">{item.currentBalance.toLocaleString()}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-2">
          {item.timeline.map((tx, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs">
              <div>
                <span className="font-mono text-slate-400 mr-2">{tx.date}</span>
                <span className="font-bold text-slate-800">{tx.type}</span>
                <p className="text-slate-500 mt-0.5">{tx.note}</p>
              </div>
              <span className={`font-mono font-bold text-sm ${tx.qty > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tx.qty > 0 ? `+${tx.qty}` : tx.qty}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
