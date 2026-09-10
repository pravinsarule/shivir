import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';

export default function ShivirTab({
  verifySearch,
  verifyResults,
  onSearchChange,
  onVerify,
}) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Shivir-Day Gate Verification"
        subtitle="Verify token numbers, card entries, and attendee names at entry"
      />
      <Card className="p-5 space-y-4">
        <form onSubmit={onVerify} className="flex gap-2 max-w-lg">
          <input
            type="text"
            placeholder="Enter Token (e.g. TOK-1001), Mobile, Name..."
            value={verifySearch}
            onChange={e => onSearchChange(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none"
          />
          <button type="submit" className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs">Verify</button>
        </form>
        {verifyResults.map(r => (
          <div key={r.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-slate-900">{r.registered_name || r.contact_name} ({r.mobile})</p>
              <p className="text-slate-500">Token: <span className="font-mono font-bold text-amber-700">{r.token_number}</span></p>
            </div>
            <Badge label="VERIFIED ENTRY ✓" variant="success" />
          </div>
        ))}
      </Card>
    </div>
  );
}
