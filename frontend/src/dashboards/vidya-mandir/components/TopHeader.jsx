import { useState } from 'react';
import { Menu, Bell, LogOut, AlertTriangle, Clock, Plane } from 'lucide-react';
import Badge from '../../shared/ui/Badge.jsx';

const NOTIFICATIONS = [
  { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', title: 'Stock Insufficient', body: 'Entry Cards stock low for Delhi Dispatch' },
  { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Packing Required', body: 'Delhi camp requirement is finalised' },
  { icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50', title: 'PNR Missing', body: 'Surat return ticket has no PNR' },
];

export default function TopHeader({ user, onToggleSidebar, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 gap-4 sticky top-0 z-50 shadow-lg shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white flex items-center gap-2 text-xs font-medium"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
          <span className="hidden sm:inline text-slate-400 font-normal">Toggle Menu</span>
        </button>
      </div>

      <div className="hidden md:flex flex-col items-center text-xs">
        <span className="text-slate-400">Today</span>
        <span className="font-semibold text-slate-200">
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setNotifOpen(o => !o)} className="relative p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h4 className="font-bold text-sm">Operational Alerts</h4>
                <Badge label="3 Action Required" variant="danger" />
              </div>
              <div className="divide-y divide-slate-100">
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 ${n.bg}`}>
                    <n.icon className={`h-4 w-4 ${n.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">{n.title}</p>
                      <p className="text-slate-500 text-[11px]">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">VM</div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name || 'VM Admin'}</p>
            <p className="text-[10px] text-amber-400 leading-none mt-0.5">{user?.role}</p>
          </div>
          <button onClick={onLogout} title="Logout" className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
