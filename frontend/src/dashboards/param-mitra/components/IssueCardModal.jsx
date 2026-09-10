export default function IssueCardModal({ open, cardForm, contacts = [], onChange, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
        <h3 className="font-bold text-base text-slate-900">Send Ticket Payment Link</h3>
        <p className="text-xs text-slate-500">The invitation card and token are created only after payment succeeds.</p>
        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Interested person *</label>
            <select required value={cardForm.contact_id} onChange={e => {
              const contact = contacts.find(item => String(item.id) === e.target.value);
              onChange({ ...cardForm, contact_id: e.target.value, registered_name: contact?.name || '' });
            }} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none">
              <option value="">Select person</option>
              {contacts.map(contact => <option key={contact.id} value={contact.id}>{contact.name} · {contact.mobile}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Participant Name *</label>
            <input
              type="text"
              required
              value={cardForm.registered_name}
              onChange={e => onChange({ ...cardForm, registered_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ticket amount (₹) *</label>
              <input type="number" required min="1" step="0.01" value={cardForm.amount} onChange={e => onChange({ ...cardForm, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Card number</label>
              <input type="text" value={cardForm.card_number} onChange={e => onChange({ ...cardForm, card_number: e.target.value })} placeholder="Optional" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-sm">Send Payment Link</button>
          </div>
        </form>
      </div>
    </div>
  );
}
