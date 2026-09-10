export default function AddContactModal({ open, contact, onChange, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
        <h3 className="font-bold text-base text-slate-900">Add Foundation Contact</h3>
        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={contact.name}
              onChange={e => onChange({ ...contact, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                value={contact.mobile}
                onChange={e => onChange({ ...contact, mobile: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Area</label>
              <input
                type="text"
                value={contact.area}
                onChange={e => onChange({ ...contact, area: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email *</label>
              <input
                type="email"
                required
                value={contact.email || ''}
                onChange={e => onChange({ ...contact, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-sm">Save Contact</button>
          </div>
        </form>
      </div>
    </div>
  );
}
