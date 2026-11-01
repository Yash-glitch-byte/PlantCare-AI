import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Droplet, 
  Thermometer, 
  CloudRain, 
  Sun, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const { 
    plants, 
    selectedPlant, 
    currentReading, 
    historyReadings, 
    recommendations, 
    setActiveSection,
    triggerManualReading,
    simulationScenario
  } = useApp();

  const unresolvedRecs = recommendations.filter((r) => !r.isResolved);
  const avgHealth = Math.round(plants.reduce((acc, p) => acc + p.healthScore, 0) / plants.length);

  return (
    <div className="space-y-6">
      {/* Welcome & Simulation Status Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-botanical-700 via-emerald-600 to-teal-700 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                Live Overview
              </span>
              <span className="rounded-full bg-botanical-900/60 px-2.5 py-0.5 text-xs font-mono text-emerald-200">
                {currentReading.isSimulated ? 'Simulated Telemetry' : 'Physical Hardware'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Greenhouse Telemetry & Health Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Monitoring {plants.length} botanical specimens with real-time sensor fusion, explainable plant intelligence heuristics, and automated Telegram alert dispatching.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerManualReading}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-bold text-white transition-all backdrop-blur-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Poll Sensors</span>
            </button>
            <button
              onClick={() => setActiveSection('monitoring')}
              className="flex items-center gap-2 rounded-xl bg-white text-botanical-800 hover:bg-emerald-50 px-4 py-2 text-xs font-bold shadow-md transition-all"
            >
              <span>Live Console</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Overall Health Score */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Avg Greenhouse Health
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgHealth}%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Stable</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-botanical-600 transition-all duration-500" 
              style={{ width: `${avgHealth}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 2: Active Specimen Count */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monitored Plants
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-botanical-100 dark:bg-botanical-950/60 text-botanical-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plants.length}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Specimens</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {plants.filter(p => p.status === 'optimal').length} optimal · {plants.filter(p => p.status === 'warning').length} under attention
          </p>
        </div>

        {/* KPI 3: Active Actionable Recommendations */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Actions
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{unresolvedRecs.length}</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Needs Care</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {unresolvedRecs.length === 0 ? 'All parameters resolved' : `${unresolvedRecs[0]?.title.slice(0, 32)}...`}
          </p>
        </div>

        {/* KPI 4: IoT Hardware Telemetry Stream */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Telemetry Channel
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">Active</span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">100% OK</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Scenario: <span className="font-semibold capitalize text-botanical-600">{simulationScenario}</span>
          </p>
        </div>
      </div>

      {/* Real-time Environmental Readings Strip */}
      <div className="glass-panel p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{selectedPlant.imageEmoji} Current Telemetry: {selectedPlant.name}</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({selectedPlant.location})
              </span>
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Updated {currentReading.timestamp}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* Soil Moisture */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Soil Moisture</span>
              <Droplet className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {currentReading.soilMoisture}%
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Target:</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {selectedPlant.thresholds.minMoisture} - {selectedPlant.thresholds.maxMoisture}%
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Ambient Temp</span>
              <Thermometer className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {currentReading.temperature}°C
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Target:</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {selectedPlant.thresholds.minTemp} - {selectedPlant.thresholds.maxTemp}°C
              </span>
            </div>
          </div>

          {/* Humidity */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Rel. Humidity</span>
              <CloudRain className="h-4 w-4 text-teal-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {currentReading.humidity}%
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Target:</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {selectedPlant.thresholds.minHumidity} - {selectedPlant.thresholds.maxHumidity}%
              </span>
            </div>
          </div>

          {/* Light Intensity */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Light Intensity</span>
              <Sun className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {currentReading.lightIntensity.toLocaleString()} <span className="text-xs font-normal text-slate-400">lux</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Target:</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {selectedPlant.thresholds.minLight.toLocaleString()} - {selectedPlant.thresholds.maxLight.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Soil pH */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Soil pH Level</span>
              <FlaskConical className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {currentReading.soilPh}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Target:</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {selectedPlant.thresholds.minPh} - {selectedPlant.thresholds.maxPh}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Trends Chart & Urgent Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 24-Hour Telemetry Trend (2 Cols) */}
        <div className="glass-panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                24-Hour Soil Moisture & Temperature Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time circadian telemetry history for {selectedPlant.name}
              </p>
            </div>
            <button
              onClick={() => setActiveSection('analytics')}
              className="text-xs font-semibold text-botanical-600 dark:text-botanical-400 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyReadings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    borderColor: '#334155', 
                    fontSize: '12px',
                    color: '#f8fafc' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  name="Moisture (%)" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#moistureGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temp (°C)" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#tempGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Care Recommendations (1 Col) */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Actionable Care Advice
            </h3>
            <span className="rounded-full bg-botanical-100 dark:bg-botanical-900/40 px-2 py-0.5 text-xs font-semibold text-botanical-700 dark:text-botanical-300">
              {unresolvedRecs.length} Pending
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {unresolvedRecs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">All Parameters In Balance</p>
                <p className="text-[11px] text-slate-500">No immediate care interventions needed.</p>
              </div>
            ) : (
              unresolvedRecs.map((rec) => (
                <div 
                  key={rec.id} 
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 transition-all hover:border-botanical-400"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.plantName}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      rec.severity === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                      rec.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}>
                      {rec.category}
                    </span>
                  </div>
                  <h4 className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {rec.title}
                  </h4>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {rec.actionRequired}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setActiveSection('recommendations')}
            className="mt-4 w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Review All Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};
