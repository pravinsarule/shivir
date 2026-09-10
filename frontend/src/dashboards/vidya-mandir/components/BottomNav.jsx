import {
  LayoutDashboard, PackageCheck, Boxes, Plane, BarChart3,
} from 'lucide-react';
import { MOBILE_NAV } from '../constants.js';

const ICON_MAP = {
  LayoutDashboard, PackageCheck, Boxes, Plane, BarChart3,
};

export default function BottomNav({ activeTab, onNavigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40 flex items-center justify-around py-2">
      {MOBILE_NAV.map(item => {
        const Icon = ICON_MAP[item.icon];
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${activeTab === item.id ? 'text-amber-400' : 'text-slate-500'}`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
