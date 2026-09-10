import { useEffect, useState } from 'react';
import { CheckCircle2, Ticket } from 'lucide-react';

const API_BASE = 'https://backend-729310986605.asia-south1.run.app/api/param-mitra';

export default function InvitationCard() {
  const tokenNumber = decodeURIComponent(window.location.pathname.split('/').pop() || '');
  const [state, setState] = useState({ loading: true, invitation: null, message: '' });

  useEffect(() => {
    fetch(`${API_BASE}/invitations/${encodeURIComponent(tokenNumber)}`)
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => setState({ loading: false, invitation: ok ? data.invitation : null, message: data.message || 'Invitation card is unavailable.' }))
      .catch(() => setState({ loading: false, invitation: null, message: 'Unable to load the invitation card.' }));
  }, [tokenNumber]);

  if (state.loading) return <main className="min-h-screen grid place-items-center bg-amber-50 text-slate-700">Loading invitation card…</main>;
  if (!state.invitation) return <main className="min-h-screen grid place-items-center bg-amber-50 p-6"><section className="max-w-md text-center bg-white rounded-3xl p-8 shadow-xl"><Ticket className="mx-auto h-10 w-10 text-amber-600" /><h1 className="mt-4 text-xl font-bold text-slate-900">Invitation unavailable</h1><p className="mt-2 text-sm text-slate-600">{state.message}</p></section></main>;

  const card = state.invitation;
  return <main className="min-h-screen bg-amber-50 p-5 flex items-center justify-center"><section className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-200"><div className="bg-slate-900 px-7 py-8 text-center text-white"><p className="text-xs uppercase tracking-[0.2em] text-amber-300">Sun to Human Foundation</p><h1 className="mt-2 text-2xl font-black">Shivir Invitation Card</h1></div><div className="p-7 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><p className="mt-4 text-sm text-slate-500">Payment confirmed</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{card.registered_name || card.contact_name}</h2><div className="my-6 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 px-5 py-4"><p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Entry token</p><p className="mt-1 font-mono text-3xl font-black text-slate-900">{card.token_number}</p></div><div className="grid grid-cols-2 gap-3 text-left text-sm"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Card type</p><p className="mt-1 font-bold text-slate-800">{card.card_type}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Amount paid</p><p className="mt-1 font-bold text-slate-800">₹{Number(card.amount).toFixed(2)}</p></div></div><p className="mt-6 text-xs text-slate-500">Please show this card and token at the Shivir counter.</p></div></section></main>;
}
