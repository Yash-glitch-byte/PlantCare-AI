import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Droplet, 
  Sun, 
  Thermometer, 
  Sparkles,
  Filter
} from 'lucide-react';
import { Recommendation } from '../types';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, resolveRecommendation } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = recommendations.filter((r) => {
    if (filterStatus === 'pending' && r.isResolved) return false;
    if (filterStatus === 'resolved' && !r.isResolved) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Watering: Droplet,
    Lighting: Sun,
    Temperature: Thermometer,
    General: Sparkles,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Actionable Care Recommendations</span>
            <span className="rounded-full bg-botanical-100 dark:bg-botanical-950/60 px-2 py-0.5 text-xs font-semibold text-botanical-700 dark:text-botanical-300">
              {recommendations.filter(r => !r.isResolved).length} Pending
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Scientifically validated interventions derived from real-time environmental telemetry vs botanical thresholds.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterStatus === 'all'
                  ? 'bg-botanical-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              All ({recommendations.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterStatus === 'pending'
                  ? 'bg-botanical-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                filterStatus === 'resolved'
                  ? 'bg-botanical-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-slate-200">
              No matching recommendations found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              All environmental telemetry is operating within safe physiological limits.
            </p>
          </div>
        ) : (
          filtered.map((rec) => {
            const Icon = categoryIcons[rec.category] || Sparkles;
            return (
              <div
                key={rec.id}
                className={`glass-card p-5 transition-all duration-200 border-l-4 ${
                  rec.isResolved
                    ? 'border-l-emerald-400 opacity-75'
                    : rec.severity === 'critical'
                    ? 'border-l-rose-500'
                    : rec.severity === 'medium'
                    ? 'border-l-amber-500'
                    : 'border-l-blue-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Icon className="h-3.5 w-3.5 text-botanical-600 dark:text-botanical-400" />
                        <span>{rec.category}</span>
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        🪴 {rec.plantName}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        rec.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : rec.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}>
                        {rec.severity} priority
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {rec.createdAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rec.title}
                    </h3>

                    {/* Scientific Evidence */}
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-3 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Diagnostic Evidence: </span>
                      <span className="text-slate-600 dark:text-slate-400">{rec.evidence}</span>
                    </div>

                    {/* Action Step */}
                    <div className="rounded-xl border border-botanical-200/60 dark:border-botanical-900/40 bg-botanical-50/40 dark:bg-botanical-950/20 p-3 text-xs">
                      <span className="font-bold text-botanical-800 dark:text-botanical-300">Prescribed Intervention: </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{rec.actionRequired}</span>
                    </div>
                  </div>

                  {/* Resolve Button */}
                  <div className="flex-shrink-0 self-end sm:self-center">
                    {rec.isResolved ? (
                      <span className="flex items-center gap-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Resolved ({rec.resolvedAt})</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => resolveRecommendation(rec.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-botanical-600 hover:bg-botanical-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-botanical-600/20 transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
