import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BellRing, 
  Check, 
  Trash2, 
  Send, 
  Globe, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { NotificationLog } from '../types';

export const NotificationHistoryPage: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterSeverity !== 'all' && n.severity !== filterSeverity) return false;
    if (filterChannel !== 'all' && n.channel !== filterChannel && n.channel !== 'both') return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Notification & Alert Dispatch History</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Audit trail of event-driven notifications dispatched across Telegram and the web console.
          </p>
        </div>

        {/* Clear & Mark Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            <Check className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Filter Severity:</span>
        {(['all', 'info', 'warning', 'critical'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`rounded-lg px-2.5 py-1 font-semibold uppercase tracking-wider text-[11px] transition-all ${
              filterSeverity === sev
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'glass-card text-slate-600 dark:text-slate-400'
            }`}
          >
            {sev}
          </button>
        ))}

        <span className="text-slate-400 font-semibold ml-4 mr-1">Channel:</span>
        {(['all', 'telegram', 'web'] as const).map((chan) => (
          <button
            key={chan}
            onClick={() => setFilterChannel(chan)}
            className={`rounded-lg px-2.5 py-1 font-semibold capitalize text-[11px] transition-all ${
              filterChannel === chan
                ? 'bg-botanical-600 text-white'
                : 'glass-card text-slate-600 dark:text-slate-400'
            }`}
          >
            {chan}
          </button>
        ))}
      </div>

      {/* Notification Stream Table */}
      <div className="glass-panel overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BellRing className="mx-auto h-10 w-10 opacity-40 mb-2" />
            <p className="text-xs">No notifications recorded matching current filter parameters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-4 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.read
                    ? 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                    : 'bg-botanical-50/40 dark:bg-botanical-950/20 hover:bg-botanical-50/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${
                    item.severity === 'critical' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' :
                    item.severity === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}>
                    {item.severity === 'critical' || item.severity === 'warning' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-botanical-500"></span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                      {item.message}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>🪴 {item.plantName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {item.channel === 'telegram' || item.channel === 'both' ? (
                      <Send className="h-3 w-3 text-sky-500" />
                    ) : (
                      <Globe className="h-3 w-3 text-slate-400" />
                    )}
                    <span className="capitalize">{item.channel}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
