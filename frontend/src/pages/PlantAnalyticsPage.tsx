import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Droplet, 
  Thermometer, 
  CloudRain, 
  Sun,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const PlantAnalyticsPage: React.FC = () => {
  const { selectedPlant, historyReadings } = useApp();
  const [activeMetric, setActiveMetric] = useState<'all' | 'moisture' | 'temperature' | 'humidity' | 'light'>('all');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  // Compute summary stats
  const moistures = historyReadings.map((r) => r.soilMoisture);
  const temps = historyReadings.map((r) => r.temperature);
  const humidities = historyReadings.map((r) => r.humidity);

  const avgMoisture = (moistures.reduce((a, b) => a + b, 0) / moistures.length).toFixed(1);
  const minMoisture = Math.min(...moistures).toFixed(1);
  const maxMoisture = Math.max(...moistures).toFixed(1);

  const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
  const minTemp = Math.min(...temps).toFixed(1);
  const maxTemp = Math.max(...temps).toFixed(1);

  const avgHum = (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Historical Environmental Telemetry
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Statistical distribution and longitudinal trend curves for {selectedPlant.name}
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
          {(['1h', '6h', '24h', '7d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                timeRange === range
                  ? 'bg-botanical-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveMetric('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeMetric === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'glass-card text-slate-600 dark:text-slate-400'
          }`}
        >
          All Parameters
        </button>
        <button
          onClick={() => setActiveMetric('moisture')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeMetric === 'moisture'
              ? 'bg-blue-600 text-white'
              : 'glass-card text-blue-600 dark:text-blue-400'
          }`}
        >
          <Droplet className="h-3.5 w-3.5" />
          <span>Soil Moisture (%)</span>
        </button>
        <button
          onClick={() => setActiveMetric('temperature')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeMetric === 'temperature'
              ? 'bg-rose-600 text-white'
              : 'glass-card text-rose-600 dark:text-rose-400'
          }`}
        >
          <Thermometer className="h-3.5 w-3.5" />
          <span>Temperature (°C)</span>
        </button>
        <button
          onClick={() => setActiveMetric('humidity')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeMetric === 'humidity'
              ? 'bg-teal-600 text-white'
              : 'glass-card text-teal-600 dark:text-teal-400'
          }`}
        >
          <CloudRain className="h-3.5 w-3.5" />
          <span>Humidity (%)</span>
        </button>
        <button
          onClick={() => setActiveMetric('light')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeMetric === 'light'
              ? 'bg-amber-600 text-white'
              : 'glass-card text-amber-600 dark:text-amber-400'
          }`}
        >
          <Sun className="h-3.5 w-3.5" />
          <span>Light Intensity (lux)</span>
        </button>
      </div>

      {/* Main Longitudinal Trend Chart */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Spectral Environmental Curves ({timeRange})
            </h3>
            <p className="text-xs text-slate-400">Continuous 25-frame rolling horizon</p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Target Envelope: {selectedPlant.thresholds.minMoisture}-{selectedPlant.thresholds.maxMoisture}% Moisture
          </span>
        </div>

        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyReadings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  borderColor: '#334155',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {(activeMetric === 'all' || activeMetric === 'moisture') && (
                <Line
                  type="monotone"
                  dataKey="soilMoisture"
                  name="Soil Moisture (%)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                />
              )}
              {(activeMetric === 'all' || activeMetric === 'temperature') && (
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°C)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                />
              )}
              {(activeMetric === 'all' || activeMetric === 'humidity') && (
                <Line
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%)"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {(activeMetric === 'all' || activeMetric === 'light') && (
                <Line
                  type="monotone"
                  dataKey="chlorophyllIndex"
                  name="SPAD Chlorophyll Index"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistical Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Moisture Summary */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Soil Moisture Distribution</span>
            <Droplet className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
              <span className="text-[10px] text-slate-400">Min</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{minMoisture}%</p>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-2">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Mean</span>
              <p className="font-bold text-blue-700 dark:text-blue-300">{avgMoisture}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
              <span className="text-[10px] text-slate-400">Max</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{maxMoisture}%</p>
            </div>
          </div>
        </div>

        {/* Temperature Summary */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Temperature Stability</span>
            <Thermometer className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
              <span className="text-[10px] text-slate-400">Min</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{minTemp}°C</p>
            </div>
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 p-2">
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">Mean</span>
              <p className="font-bold text-rose-700 dark:text-rose-300">{avgTemp}°C</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
              <span className="text-[10px] text-slate-400">Max</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{maxTemp}°C</p>
            </div>
          </div>
        </div>

        {/* Humidity Summary */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Relative Humidity Profile</span>
            <CloudRain className="h-4 w-4 text-teal-500" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
              <span className="text-[10px] text-slate-400">Min</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{Math.min(...humidities).toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-teal-50 dark:bg-teal-950/40 p-2">
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Mean</span>
              <p className="font-bold text-teal-700 dark:text-teal-300">{avgHum}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2">
              <span className="text-[10px] text-slate-400">Max</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{Math.max(...humidities).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
