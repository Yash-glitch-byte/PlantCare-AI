import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Plus, 
  Droplet, 
  Sun, 
  Calendar, 
  MapPin, 
  Cpu, 
  Trash2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Plant } from '../types';
import { AddPlantModal } from '../components/AddPlantModal';

export const MyPlantsPage: React.FC = () => {
  const { plants, selectedPlantId, setSelectedPlantId, deletePlant, setActiveSection } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Botanical Specimen Registry</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-700 dark:bg-botanical-950/60 dark:text-botanical-300">
              {plants.length} Active Plants
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage individual species profiles, localized environmental safety envelopes, and telemetry bindings.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-botanical-600 hover:bg-botanical-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-botanical-600/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Plant</span>
        </button>
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => {
          const isSelected = selectedPlantId === plant.id;
          return (
            <div
              key={plant.id}
              className={`glass-card p-5 relative overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'border-2 border-botanical-500 shadow-md ring-1 ring-botanical-500/20 dark:border-botanical-400'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-botanical-50 dark:bg-botanical-950/50 text-2xl shadow-inner">
                    {plant.imageEmoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {plant.name}
                    </h3>
                    <p className="text-xs italic text-slate-400 font-serif">
                      {plant.species}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    plant.status === 'optimal'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}
                >
                  {plant.status}
                </span>
              </div>

              {/* Badges / Location */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {plant.location}
                </span>
                <span className="flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                  <Cpu className="h-3 w-3 text-slate-400" />
                  {plant.deviceId}
                </span>
                <span className="rounded-md bg-botanical-50 dark:bg-botanical-950/40 px-2 py-0.5 text-botanical-700 dark:text-botanical-300 text-[11px] font-semibold">
                  {plant.category}
                </span>
              </div>

              {/* Health Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Health Index</span>
                  <span className="text-slate-900 dark:text-white font-bold">{plant.healthScore}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-botanical-600"
                    style={{ width: `${plant.healthScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Care Activity Snippets */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px]">
                <div>
                  <span className="text-slate-400">Last Watered:</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{plant.lastWatered}</p>
                </div>
                <div>
                  <span className="text-slate-400">Fertilized:</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">{plant.lastFertilized}</p>
                </div>
              </div>

              {/* Notes */}
              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {plant.notes}
              </p>

              {/* Actions Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  onClick={() => deletePlant(plant.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                  title="Remove specimen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedPlantId(plant.id);
                    setActiveSection('monitoring');
                  }}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-botanical-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-botanical-50 hover:text-botanical-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span>{isSelected ? 'Live Monitoring' : 'Select Specimen'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Plant Modal */}
      {isAddModalOpen && (
        <AddPlantModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
