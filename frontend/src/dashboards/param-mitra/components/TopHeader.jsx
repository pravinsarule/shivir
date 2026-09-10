import Swal from 'sweetalert2';
import { LayoutDashboard, Bell, LogOut } from 'lucide-react';

export default function TopHeader({ user, onToggleSidebar, onLogout }) {
  return (
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 gap-4 sticky top-0 z-50 shadow-lg shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white flex items-center gap-2 text-xs font-medium"
          title="Toggle Sidebar"
        >
          <LayoutDashboard className="h-5 w-5" />
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
        <button
          onClick={() => Swal.fire('Alerts', 'No new alerts', 'info')}
          className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">PM</div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name || 'Param Mitra'}</p>
            <p className="text-[10px] text-amber-400 leading-none mt-0.5">{user?.role || 'Field Operative'}</p>
          </div>
          <button onClick={onLogout} title="Logout" className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
