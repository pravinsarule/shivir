import {
  LayoutDashboard, Users, Calendar, Clock, CreditCard,
} from 'lucide-react';
import { MOBILE_NAV } from '../config.js';

const ICON_MAP = {
  LayoutDashboard, Users, Calendar, Clock, CreditCard,
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
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition ${activeTab === item.id ? 'text-amber-400 font-bold' : 'text-slate-500'}`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[9px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
