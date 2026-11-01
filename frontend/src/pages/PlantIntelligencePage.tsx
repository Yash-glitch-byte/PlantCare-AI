import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BrainCircuit, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  FlaskConical, 
  Microscope,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const PlantIntelligencePage: React.FC = () => {
  const { selectedPlant, currentReading, mlPrediction, simulationScenario } = useApp();

  // Evaluate stress conditions with transparent deterministic heuristics
  const isMoistureLow = currentReading.soilMoisture < selectedPlant.thresholds.minMoisture;
  const isMoistureHigh = currentReading.soilMoisture > selectedPlant.thresholds.maxMoisture;
  const isTempLow = currentReading.temperature < selectedPlant.thresholds.minTemp;
  const isTempHigh = currentReading.temperature > selectedPlant.thresholds.maxTemp;
  const isLightHigh = currentReading.lightIntensity > selectedPlant.thresholds.maxLight;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Plant Intelligence & Diagnostic Engine</span>
          <span className="rounded-full bg-botanical-100 dark:bg-botanical-950/60 px-2 py-0.5 text-xs font-semibold text-botanical-700 dark:text-botanical-300">
            Heuristic Rule-Engine v1.0
          </span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Transparent multi-variable telemetry evaluation, botanical stress mapping, and research-grade optical chlorophyll ML pipeline.
        </p>
      </div>

      {/* Research Integrity & Transparency Banner */}
      <div className="rounded-2xl border border-botanical-200 dark:border-botanical-900/60 bg-gradient-to-r from-botanical-50/70 to-emerald-50/40 dark:from-botanical-950/40 dark:to-slate-900 p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-botanical-600 text-white shadow-md shadow-botanical-600/30">
            <Microscope className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-botanical-800 dark:text-botanical-300">
                Ongoing Engineering Research Initiative
              </h3>
              <span className="rounded-full bg-botanical-200/60 dark:bg-botanical-800/60 px-2 py-0.5 text-[10px] font-mono text-botanical-900 dark:text-botanical-100">
                Phase 7 Architecture
              </span>
            </div>
            <p className="text-xs font-serif italic text-slate-700 dark:text-slate-300">
              "Design and Development of a Low-Cost IoT-Enabled Chlorophyll Sensing System with Sensor Fusion and Machine Learning for Early Detection of Nutrient Deficiency in Crops."
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              <strong>Scientific Principle:</strong> Conventional environmental readings (moisture, air temperature, humidity) indicate physiological hydration and transpiration stress, but cannot alone definitively determine nutrient deficiencies (N, P, K). Our research module integrates dual-band optical reflectance (660nm Red & 850nm NIR) to derive vegetative indices before passing fused vectors to trained ML classifiers.
            </p>
          </div>
        </div>
      </div>

      {/* Live Heuristic Stress Diagnosis Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Active Specimen Diagnostic State */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Deterministic Stress Heuristics
              </h3>
              <p className="text-xs text-slate-400">Specimen: {selectedPlant.name} ({selectedPlant.species})</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              isMoistureLow || isMoistureHigh || isTempHigh || isLightHigh
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
            }`}>
              {isMoistureLow || isMoistureHigh || isTempHigh || isLightHigh ? 'Stress Flagged' : 'No Acute Stress'}
            </span>
          </div>

          {/* Condition 1: Moisture Evaluation */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Substrate Hydration Balance
              </span>
              <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                {currentReading.soilMoisture}% (Safe: {selectedPlant.thresholds.minMoisture}-{selectedPlant.thresholds.maxMoisture}%)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {isMoistureLow ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  ⚠️ Dehydration risk detected. Soil moisture is below the safe threshold of {selectedPlant.thresholds.minMoisture}%. Capillary draw is dropping.
                </span>
              ) : isMoistureHigh ? (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  ⚠️ Over-saturation risk detected. Moisture above {selectedPlant.thresholds.maxMoisture}% limits root aeration and oxygen exchange.
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">
                  ✓ Volumetric water content is within the physiological optimum for {selectedPlant.name}.
                </span>
              )}
            </p>
          </div>

          {/* Condition 2: Thermal Stress */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Thermal & Transpiration Load
              </span>
              <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                {currentReading.temperature}°C (Target: {selectedPlant.thresholds.minTemp}-{selectedPlant.thresholds.maxTemp}°C)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {isTempHigh ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  ⚠️ Heat stress alert: Ambient temperature exceeds {selectedPlant.thresholds.maxTemp}°C. Transpiration rate elevated.
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">
                  ✓ Thermal conditions support optimal enzyme kinetics for photosynthesis.
                </span>
              )}
            </p>
          </div>

          {/* Condition 3: Photoperiod Intensity */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Photosynthetic Photon Flux (Lux)
              </span>
              <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                {currentReading.lightIntensity} lux
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {isLightHigh ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  ⚠️ Light saturation ceiling exceeded ({selectedPlant.thresholds.maxLight} lux). Potential photoinhibition.
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">
                  ✓ Light level sufficient for carbon fixation without excess photosystem damage.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Optical Chlorophyll Sensing & ML Architecture Preview */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Spectral Sensing & ML Fusion Layer
              </h3>
              <p className="text-xs text-slate-400">Optical Chlorophyll & Vegetation Index Analytics</p>
            </div>
            <span className="rounded-full bg-botanical-100 dark:bg-botanical-950/60 px-2.5 py-0.5 text-[10px] font-bold text-botanical-700 dark:text-botanical-300">
              Confidence: {(mlPrediction.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <span className="text-[10px] text-slate-400">Red Reflectance (660nm)</span>
              <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currentReading.redReflectance || 0.12}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Chlorophyll absorbs red</p>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <span className="text-[10px] text-slate-400">NIR Reflectance (850nm)</span>
              <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currentReading.nirReflectance || 0.78}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Leaf mesophyll scattering</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Normalized Difference Vegetation Index (NDVI)</span>
              <span className="font-mono font-bold text-botanical-600 dark:text-botanical-400 text-sm">
                {currentReading.ndvi || 0.73}
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-botanical-600"
                style={{ width: `${Math.max(10, Math.min(100, ((currentReading.ndvi || 0.7) + 1) * 50))}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>Low Canopy Vigour (-1.0)</span>
              <span>Dense Canopy Vigour (+1.0)</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Early Nutrient Deficiency Classifier Status
            </span>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Suspected Primary Deficiency:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {mlPrediction.suspectedDeficiency}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">Calculated SPAD Chlorophyll:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentReading.chlorophyllIndex} (Healthy range: 40-55)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
