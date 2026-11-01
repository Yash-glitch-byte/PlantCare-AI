import React from 'react';
import { useApp, NavSection } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Sprout, 
  Activity, 
  BarChart3, 
  BrainCircuit, 
  Lightbulb, 
  BellRing, 
  Send, 
  Cpu, 
  Settings,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, recommendations, notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingRecs = recommendations.filter((r) => !r.isResolved).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'plants', label: 'My Plants', icon: Sprout },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity, badge: 'Live' },
    { id: 'analytics', label: 'Plant Analytics', icon: BarChart3 },
    { id: 'intelligence', label: 'Plant Intelligence', icon: BrainCircuit },
    { 
      id: 'recommendations', 
      label: 'Recommendations', 
      icon: Lightbulb, 
      badge: pendingRecs > 0 ? `${pendingRecs}` : undefined 
    },
    { 
      id: 'notifications', 
      label: 'Notification History', 
      icon: BellRing, 
      badge: unreadCount > 0 ? `${unreadCount}` : undefined 
    },
    { id: 'telegram', label: 'Telegram Integration', icon: Send },
    { id: 'devices', label: 'Device Management', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hidden md:flex flex-col justify-between p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-botanical-600 text-white shadow-sm shadow-botanical-600/30 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-botanical-600 dark:group-hover:text-botanical-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold leading-none ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.id === 'monitoring'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Research Badge card */}
      <div className="rounded-xl border border-botanical-200/60 bg-gradient-to-br from-botanical-50 to-emerald-100/50 p-3.5 dark:border-botanical-900/40 dark:from-botanical-950/30 dark:to-slate-900">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-botanical-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-botanical-900 dark:text-botanical-200">
            IoT Research Pilot
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
          Optical sensing & ML sensor fusion module for early nutrient deficiency detection active.
        </p>
      </div>
    </aside>
  );
};
