import { Clock, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../shared/ui/PageHeader.jsx';
import Card from '../../shared/ui/Card.jsx';
import Badge from '../../shared/ui/Badge.jsx';
import { formatTime } from '../hooks/useParamMitraDashboard.js';

export default function DemoTab({
  bookingStep,
  setBookingStep,
  bookingForm,
  setBookingForm,
  contacts,
  holdSecondsLeft,
  onCheckAvailability,
  onConfirmBooking,
  onReturnDashboard,
}) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Book Demo Workshop"
        subtitle="15-Minute Soft Hold & Resource Engine"
        action={<Badge label="FREE DEMO (No Charge)" variant="success" />}
      />

      {bookingStep === 1 && (
        <Card className="p-6 max-w-lg mx-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organiser Contact *</label>
            <select
              value={bookingForm.contact_id}
              onChange={e => setBookingForm({ ...bookingForm, contact_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 outline-none"
            >
              <option value="">-- Choose Contact --</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date *</label>
              <input
                type="date"
                value={bookingForm.session_date}
                onChange={e => setBookingForm({ ...bookingForm, session_date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Crowd *</label>
              <input
                type="number"
                value={bookingForm.expected_crowd}
                onChange={e => setBookingForm({ ...bookingForm, expected_crowd: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 outline-none"
              />
            </div>
          </div>

          <button
            onClick={onCheckAvailability}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs shadow-sm transition"
          >
            Check Availability &amp; Hold
          </button>
        </Card>
      )}

      {bookingStep === 3 && (
        <Card className="p-6 max-w-lg mx-auto text-center space-y-4 border-amber-300">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">15-Minute Soft Hold Active</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 font-mono text-3xl font-bold text-amber-700">
            {formatTime(holdSecondsLeft)}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBookingStep(1)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">Cancel Hold</button>
            <button onClick={onConfirmBooking} className="flex-1 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-sm">Confirm Booking</button>
          </div>
        </Card>
      )}

      {bookingStep === 4 && (
        <Card className="p-6 max-w-md mx-auto text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">Demo Workshop Confirmed!</h3>
          <button onClick={onReturnDashboard} className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">Return to Dashboard</button>
        </Card>
      )}
    </div>
  );
}
