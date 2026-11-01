import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Cpu, Key } from 'lucide-react';
import { IoTDevice } from '../types';

interface AddDeviceModalProps {
  onClose: () => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ onClose }) => {
  const { addDevice, plants } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<IoTDevice['type']>('ESP32_PHYSICAL');
  const [plantId, setPlantId] = useState(plants[0]?.id || 'plant-1');
  const [firmwareVersion, setFirmwareVersion] = useState('v1.0.0-arduino');

  const selectedPlant = plants.find((p) => p.id === plantId) || plants[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const maskedKey = `esp_live_${Math.random().toString(36).substring(2, 10)}`;

    addDevice({
      name: name.trim(),
      type,
      plantId,
      plantName: selectedPlant.name,
      status: 'online',
      ipAddress: type === 'ESP32_PHYSICAL' ? '192.168.1.185' : undefined,
      macAddress: type === 'ESP32_PHYSICAL' ? 'E8:68:E7:32:B1:04' : undefined,
      apiKeyMasked: maskedKey,
      batteryPercentage: type === 'ESP32_PHYSICAL' ? 98 : undefined,
      firmwareVersion,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-botanical-100 dark:bg-botanical-950/60 text-botanical-600">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Provision Telemetry Node</h2>
              <p className="text-xs text-slate-500">Register ESP32 physical or simulated sensor unit</p>
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Device Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ESP32 Greenhouse Node B"
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Node Architecture</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IoTDevice['type'])}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
            >
              <option value="ESP32_PHYSICAL">ESP32 Physical Microcontroller (WiFi / REST)</option>
              <option value="VIRTUAL_SIMULATOR">Virtual Simulation Engine Node</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Assign to Plant Specimen</label>
            <select
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.imageEmoji} {p.name} ({p.species})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Firmware Build Identifier</label>
            <input
              type="text"
              value={firmwareVersion}
              onChange={(e) => setFirmwareVersion(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-botanical-500 focus:outline-none"
            />
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
              Provision Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
