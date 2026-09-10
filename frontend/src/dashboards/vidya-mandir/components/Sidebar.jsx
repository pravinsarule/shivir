import {
  LayoutDashboard, PackageCheck, Boxes, ArrowRightLeft, RotateCcw,
  Plane, CircleDollarSign, Building2, Receipt, Wallet, Users, Calendar,
  Archive, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { NAV } from '../constants.js';

const ICON_MAP = {
  LayoutDashboard, PackageCheck, Boxes, ArrowRightLeft, RotateCcw,
  Plane, CircleDollarSign, Building2, Receipt, Wallet, Users,
  Calendar, Archive, BarChart3, Settings,
};

export default function Sidebar({
  collapsed, activeTab, onNavigate, user, onLogout, onExpand, onCollapse,
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-3.5 border-b border-slate-800 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button onClick={onExpand} title="Expand Sidebar" className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-sm leading-tight truncate">Vidya Mandir</p>
                <p className="text-[10px] text-amber-400 font-semibold tracking-wider">HEAD OFFICE</p>
              </div>
            </div>
            <button onClick={onCollapse} title="Collapse Sidebar" className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV.map((item, i) => {
          if (item.section) {
            return collapsed ? (
              <div key={i} className="pt-3 pb-1 flex justify-center">
                <div className="h-px w-6 bg-slate-700" />
              </div>
            ) : (
              <p key={i} className="pt-4 pb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {item.section}
              </p>
            );
          }
          const Icon = ICON_MAP[item.icon];
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-lg transition-all duration-150 text-sm font-medium
                ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                ${isActive ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`border-t border-slate-800 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <button onClick={onLogout} title="Logout" className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition">
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">VM</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'VM Admin'}</p>
              <p className="text-[10px] text-amber-400 truncate">{user?.role}</p>
            </div>
            <button onClick={onLogout} title="Logout" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition shrink-0">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
