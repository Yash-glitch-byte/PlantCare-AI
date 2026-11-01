import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sprout, Check } from 'lucide-react';
import { Plant } from '../types';

interface AddPlantModalProps {
  onClose: () => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({ onClose }) => {
  const { addPlant, devices } = useApp();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [category, setCategory] = useState<Plant['category']>('Vegetable');
  const [location, setLocation] = useState('Greenhouse Bay 1');
  const [imageEmoji, setImageEmoji] = useState('🌱');
  const [deviceId, setDeviceId] = useState(devices[0]?.id || 'esp32-node-01');
  const [notes, setNotes] = useState('');

  // Thresholds
  const [minMoisture, setMinMoisture] = useState(40);
  const [maxMoisture, setMaxMoisture] = useState(75);
  const [minTemp, setMinTemp] = useState(18);
  const [maxTemp, setMaxTemp] = useState(30);
  const [minHumidity, setMinHumidity] = useState(50);
  const [maxHumidity, setMaxHumidity] = useState(70);
  const [minLight, setMinLight] = useState(15000);
  const [maxLight, setMaxLight] = useState(50000);

  const emojiOptions = ['🌱', '🍅', '🌿', '🪴', '🪷', '🍓', '🌶️', '🌵', '🌽', '🌻'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPlant({
      name: name.trim(),
      species: species.trim() || 'Botanical sp.',
      category,
      location,
      imageEmoji,
      deviceId,
      plantedDate: new Date().toISOString().split('T')[0],
      lastWatered: 'Just registered',
      lastFertilized: 'None yet',
      notes: notes.trim() || 'Newly cataloged botanical specimen.',
      thresholds: {
        minMoisture,
        maxMoisture,
        minTemp,
        maxTemp,
        minHumidity,
        maxHumidity,
        minLight,
        maxLight,
        minPh: 6.0,
        maxPh: 7.0,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-botanical-100 dark:bg-botanical-950/60 text-botanical-600">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Register Botanical Specimen</h2>
              <p className="text-xs text-slate-500">Configure species parameters and sensor link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name & Species */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Plant Common Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Roma Tomato"
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Scientific Species Name</label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Solanum lycopersicum"
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Emoji & Device Link */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Plant['category'])}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
              >
                <option value="Vegetable">Vegetable / Crop</option>
                <option value="Indoor">Indoor Foliage</option>
                <option value="Herb">Herb</option>
                <option value="Flowering">Flowering</option>
                <option value="Succulent">Succulent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Telemetry Node</label>
              <select
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.type === 'ESP32_PHYSICAL' ? 'Hardware' : 'Virtual'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Icon Emoji</label>
              <div className="mt-1 flex items-center gap-1 overflow-x-auto py-1">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setImageEmoji(emoji)}
                    className={`rounded-lg p-1.5 text-base transition-all ${
                      imageEmoji === emoji ? 'bg-botanical-100 dark:bg-botanical-900 border border-botanical-500 scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Envelopes */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Botanical Safety Thresholds
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="block text-[11px] text-slate-500">Min Moisture (%)</label>
                <input
                  type="number"
                  value={minMoisture}
                  onChange={(e) => setMinMoisture(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500">Max Moisture (%)</label>
                <input
                  type="number"
                  value={maxMoisture}
                  onChange={(e) => setMaxMoisture(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500">Min Temp (°C)</label>
                <input
                  type="number"
                  value={minTemp}
                  onChange={(e) => setMinTemp(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500">Max Temp (°C)</label>
                <input
                  type="number"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-botanical-600 hover:bg-botanical-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-botanical-600/20"
            >
              Register Specimen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
