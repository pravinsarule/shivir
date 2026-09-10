import Swal from 'sweetalert2';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';

export default function FollowupsTab({ followups, onAddFollowup }) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Follow-up Center"
        subtitle="Scheduled follow-up interactions"
        action={
          <button onClick={onAddFollowup} className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs">
            + Schedule Follow-up
          </button>
        }
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {followups.map(f => (
          <Card key={f.id} className="p-4 space-y-2">
            <div className="flex justify-between">
              <h4 className="font-bold text-sm text-slate-900">{f.title}</h4>
              <Badge label={f.status} variant="warning" />
            </div>
            <p className="text-xs text-slate-500">Contact: {f.contact_name || 'Contact'} ({f.mobile})</p>
            <button
              onClick={() => Swal.fire('Done', 'Completed', 'success')}
              className="w-full bg-emerald-50 text-emerald-700 text-xs font-bold py-1.5 rounded-lg border border-emerald-200 mt-2"
            >
              Mark Done
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
