import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  Bell, 
  Leaf, 
  Cpu, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { SimulationScenario } from '../types';

export const Navbar: React.FC = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    plants, 
    selectedPlantId, 
    setSelectedPlantId,
    simulationScenario,
    setSimulationScenario,
    notifications,
    setActiveSection,
    currentReading
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const scenarioLabels: Record<SimulationScenario, { label: string; color: string }> = {
    normal: { label: 'Optimal Growth', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    drought: { label: 'Drought Stress', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    overwatering: { label: 'Overwatering', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    heat: { label: 'Heat Stress', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
    recovery: { label: 'Recovery Cycle', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-botanical-600 to-emerald-400 text-white shadow-md shadow-botanical-500/20">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">PlantCare AI</span>
              <span className="rounded-full bg-botanical-100 dark:bg-botanical-900/40 px-2 py-0.5 text-xs font-semibold text-botanical-700 dark:text-botanical-300">
                v1.0-alpha
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Intelligent IoT Telemetry & Care Platform
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-3">
          {/* Active Plant Selector */}
          <div className="relative">
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm focus:border-botanical-500 focus:outline-none"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.imageEmoji} {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Simulation Scenario Pill */}
          <div className="hidden items-center gap-1.5 md:flex">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <FlaskConical className="h-3.5 w-3.5 text-botanical-600" /> Mode:
            </span>
            <select
              value={simulationScenario}
              onChange={(e) => setSimulationScenario(e.target.value as SimulationScenario)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider focus:outline-none ${scenarioLabels[simulationScenario].color}`}
            >
              <option value="normal">🌿 Normal / Optimal</option>
              <option value="drought">🏜️ Drought Stress</option>
              <option value="overwatering">💧 Overwatering</option>
              <option value="heat">🔥 Heat Stress</option>
              <option value="recovery">🌱 Recovery Cycle</option>
            </select>
          </div>

          {/* Hardware / Sim Source Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
              {currentReading.isSimulated ? 'SIMULATOR LIVE' : 'ESP32 INGEST'}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Recent Notifications</h4>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveSection('notifications');
                    }}
                    className="text-[11px] font-semibold text-botanical-600 hover:underline dark:text-botanical-400"
                  >
                    View All ({notifications.length})
                  </button>
                </div>
                <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-lg p-2 text-xs transition-colors ${
                        n.read ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400' : 'bg-botanical-50/60 dark:bg-botanical-950/40 text-slate-900 dark:text-slate-200 border-l-2 border-botanical-500'
                      }`}
                    >
                      <div className="font-semibold">{n.title}</div>
                      <div className="mt-0.5 text-[11px] leading-snug">{n.message}</div>
                      <div className="mt-1 text-[10px] text-slate-400">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/Yash-glitch-byte/PlantCare-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Open Public GitHub Repository"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
