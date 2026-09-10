import Swal from 'sweetalert2';
import { Plus, Calendar, Clock, CreditCard, Users } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import KpiCard from '../../shared/ui/KpiCard.jsx';
import Badge from '../../shared/ui/Badge.jsx';

export default function DashboardTab({
  dashboardData,
  onAddContact,
  onCreateDemo,
  onNavigate,
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="What do I need to do today?"
        subtitle="Param Mitra Operational Command Center · Real-time field status"
        action={
          <div className="flex gap-2">
            <button
              onClick={onAddContact}
              className="flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add Contact
            </button>
            <button
              onClick={onCreateDemo}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
            >
              <Calendar className="h-3.5 w-3.5" /> Create Demo
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Today's Sessions" value={dashboardData?.todaySessions?.length || 0} sub="Scheduled workshops" color="border-amber-500" icon={Calendar} onClick={() => onNavigate('demo')} />
        <KpiCard title="Overdue Follow-ups" value={dashboardData?.overdueFollowups?.length || 0} sub="Requires attention" color="border-rose-500" icon={Clock} onClick={() => onNavigate('followups')} />
        <KpiCard title="Cards in Hand" value={dashboardData?.cardOverview?.in_hand_count || 5} sub="Active inventory" color="border-blue-500" icon={CreditCard} onClick={() => onNavigate('cards')} />
        <KpiCard title="Pending Names" value={dashboardData?.pendingNamesCount || 3} sub="To be filled" color="border-violet-500" icon={Users} onClick={() => onNavigate('cards')} />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600" /> Today's Demo Sessions
          </h3>
          <Badge label="FREE DEMO (No Charge)" variant="success" />
        </div>

        <div className="space-y-3">
          {dashboardData?.todaySessions?.length > 0 ? (
            dashboardData.todaySessions.map(s => (
              <div key={s.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm text-slate-900">{s.session_type} · {s.location}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Organiser: <span className="font-semibold text-slate-700">{s.organiser_name || 'Organiser'}</span> ({s.organiser_mobile || '+91 9876543210'})
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>🕒 {s.start_time} - {s.end_time}</span>
                    <span>🚗 Travel Buffer: +{s.travel_buffer_minutes}m</span>
                  </div>
                </div>
                <button
                  onClick={() => Swal.fire('Demo Completed!', 'Marked as completed.', 'success')}
                  className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-emerald-700 transition shadow-sm"
                >
                  Mark Completed
                </button>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No demo workshops booked for today.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
