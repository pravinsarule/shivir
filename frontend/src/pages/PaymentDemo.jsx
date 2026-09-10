import { CheckCircle2, CreditCard } from 'lucide-react';

export default function PaymentDemo() {
  const tokenNumber = decodeURIComponent(window.location.pathname.split('/').pop() || '');
  return <main className="min-h-screen bg-amber-50 p-5 flex items-center justify-center"><section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl border border-amber-200"><CreditCard className="mx-auto h-12 w-12 text-amber-600" /><h1 className="mt-4 text-2xl font-black text-slate-900">Demo payment link</h1><p className="mt-3 text-sm text-slate-600">No payment is required or collected. Your invitation card has already been created.</p><div className="my-6 rounded-xl bg-amber-50 p-4 font-mono font-bold text-amber-800">{tokenNumber}</div><a href={`/invitation/${encodeURIComponent(tokenNumber)}`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"><CheckCircle2 className="h-4 w-4" /> Open invitation card</a></section></main>;
}
