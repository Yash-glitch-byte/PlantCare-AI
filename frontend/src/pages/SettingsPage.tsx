import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Moon, 
  Sun, 
  Database, 
  FlaskConical, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  ExternalLink
} from 'lucide-react';
import { GithubIcon } from '../components/GithubIcon';
import { SimulationScenario } from '../types';

export const SettingsPage: React.FC = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    simulationScenario, 
    setSimulationScenario 
  } = useApp();

  const [saved, setSaved] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking'>('connected');
  const [telemetryInterval, setTelemetryInterval] = useState(6);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Platform Settings & System Health</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure telemetry sampling rates, simulation engine modes, visual styling, and database connectors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Visual Appearance & Theme */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            {isDarkMode ? <Moon className="h-4 w-4 text-amber-400" /> : <Sun className="h-4 w-4 text-slate-600" />}
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface Theme & Aesthetics
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Choose between modern botanical light mode or ultra-sleek high-contrast dark mode tailored for agricultural SaaS displays.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => { if (isDarkMode) toggleDarkMode(); }}
              className={`rounded-xl border p-3 text-left transition-all ${
                !isDarkMode
                  ? 'border-botanical-500 bg-botanical-50/70 shadow-sm ring-1 ring-botanical-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <Sun className="h-5 w-5 text-amber-500 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Botanical Light</div>
              <div className="text-[11px] text-slate-500">Natural green & clean slate</div>
            </button>

            <button
              onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
              className={`rounded-xl border p-3 text-left transition-all ${
                isDarkMode
                  ? 'border-botanical-500 bg-slate-800/80 shadow-sm ring-1 ring-botanical-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <Moon className="h-5 w-5 text-indigo-400 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Emerald Dark</div>
              <div className="text-[11px] text-slate-400">Deep slate & glowing accents</div>
            </button>
          </div>
        </div>

        {/* Mathematical Simulation Engine Settings */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FlaskConical className="h-4 w-4 text-botanical-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulation Engine Controls
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The mathematical engine produces organic circadian fluctuations with stochastic noise to facilitate algorithm tuning without physical hardware.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Default Perturbation Scenario
              </label>
              <select
                value={simulationScenario}
                onChange={(e) => setSimulationScenario(e.target.value as SimulationScenario)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold capitalize"
              >
                <option value="normal">Optimal State (Balanced)</option>
                <option value="drought">Drought Stress (&lt; 20% Moisture)</option>
                <option value="overwatering">Overwatering Stress (&gt; 90% Moisture)</option>
                <option value="heat">Thermal Stress (&gt; 35°C Temp)</option>
                <option value="recovery">Recovery Normalization</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Telemetry Generation Frequency
              </label>
              <select
                value={telemetryInterval}
                onChange={(e) => setTelemetryInterval(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
              >
                <option value={3}>High Frequency (Every 3 seconds)</option>
                <option value={6}>Standard Research (Every 6 seconds)</option>
                <option value={15}>Low Power Mode (Every 15 seconds)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database & Backend Connectivity */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-botanical-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Database & Backend Service
              </h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>HEALTHY</span>
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">FastAPI API Server:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">http://localhost:8000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">PostgreSQL / Supabase:</span>
              <span className="text-slate-700 dark:text-slate-300">Asyncpg Connection Pool Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Swagger OpenAPI Docs:</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">/docs</span>
            </div>
          </div>
        </div>

        {/* Research Project Credits & Version */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <GithubIcon className="h-4 w-4 text-botanical-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Open Source Research Repository
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            PlantCare AI is an open research platform maintained by <strong>Yash</strong> (<code>@Yash-glitch-byte</code>) licensed under the MIT License.
          </p>

          <div className="pt-2">
            <a
              href="https://github.com/Yash-glitch-byte/PlantCare-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 py-2.5 text-xs font-bold shadow-md transition-all"
            >
              <GithubIcon className="h-4 w-4" />
              <span>View GitHub Repository</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
