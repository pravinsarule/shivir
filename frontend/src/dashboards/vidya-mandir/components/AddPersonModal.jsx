import { X } from 'lucide-react';

export default function AddPersonModal({ open, person, onChange, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Add New Person</h3>
            <p className="text-xs text-slate-400">Assign role (Param Mitra, Crew, etc.) and location</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input type="text" required placeholder="e.g. Ramesh Shah" value={person.name} onChange={e => onChange({ ...person, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input type="email" required placeholder="ramesh@shibir.org" value={person.email} onChange={e => onChange({ ...person, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input type="text" placeholder="+91 9876543210" value={person.phone} onChange={e => onChange({ ...person, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Role *</label>
              <select value={person.role} onChange={e => onChange({ ...person, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500 font-semibold cursor-pointer">
                <option value="Param Mitra">Param Mitra</option>
                <option value="Crew">Crew</option>
                <option value="Programme Lead">Programme Lead</option>
                <option value="Field Volunteer">Field Volunteer</option>
                <option value="Vidya Mandir">Vidya Mandir</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <select value={person.city} onChange={e => onChange({ ...person, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500 font-semibold cursor-pointer">
                <option value="Delhi">Delhi</option>
                <option value="Jamnagar">Jamnagar</option>
                <option value="Surat">Surat</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex gap-2 justify-end border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm">Add Person</button>
          </div>
        </form>
      </div>
    </div>
  );
}
