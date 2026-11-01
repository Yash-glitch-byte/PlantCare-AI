// ==========================================
// PlantCare AI — TypeScript Domain Types
// ==========================================

export type HealthStatus = 'optimal' | 'warning' | 'critical' | 'dormant';
export type StressType = 'none' | 'drought' | 'overwatering' | 'heat_stress' | 'cold_stress' | 'insufficient_light' | 'excessive_light' | 'ph_imbalance';
export type SimulationScenario = 'normal' | 'drought' | 'overwatering' | 'heat' | 'recovery';

export interface PlantThresholds {
  minMoisture: number; // %
  maxMoisture: number; // %
  minTemp: number;     // °C
  maxTemp: number;     // °C
  minHumidity: number; // %
  maxHumidity: number; // %
  minLight: number;    // lux
  maxLight: number;    // lux
  minPh: number;
  maxPh: number;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  category: 'Vegetable' | 'Indoor' | 'Herb' | 'Flowering' | 'Succulent';
  location: string;
  healthScore: number; // 0-100
  status: HealthStatus;
  currentStress: StressType;
  thresholds: PlantThresholds;
  imageEmoji: string;
  imageUrl?: string;
  deviceId: string;
  plantedDate: string;
  lastWatered: string;
  lastFertilized: string;
  notes: string;
}

export interface SensorReading {
  id: string;
  plantId: string;
  deviceId: string;
  timestamp: string;
  soilMoisture: number;      // %
  temperature: number;       // °C
  humidity: number;          // %
  lightIntensity: number;    // lux
  soilTemperature?: number;  // °C
  soilPh?: number;           // pH scale (0-14)
  isSimulated: boolean;
  // Future Research / Spectral parameters:
  chlorophyllIndex?: number; // 0 - 100 SPAD equivalent
  redReflectance?: number;   // 660nm reflectance
  nirReflectance?: number;   // 850nm reflectance
  ndvi?: number;             // Calculated NDVI (-1 to 1)
}

export interface Recommendation {
  id: string;
  plantId: string;
  plantName: string;
  title: string;
  category: 'Watering' | 'Lighting' | 'Temperature' | 'Humidity' | 'Nutrients' | 'General';
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string;
  actionRequired: string;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface NotificationLog {
  id: string;
  plantId: string;
  plantName: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'recovery';
  channel: 'telegram' | 'web' | 'both';
  timestamp: string;
  read: boolean;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'ESP32_PHYSICAL' | 'VIRTUAL_SIMULATOR';
  plantId: string;
  plantName: string;
  status: 'online' | 'offline' | 'calibrating';
  ipAddress?: string;
  macAddress?: string;
  apiKeyMasked: string;
  batteryPercentage?: number;
  firmwareVersion: string;
  lastHeartbeat: string;
  readingsCount: number;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  alertLevel: 'all' | 'warning_critical' | 'critical_only';
  quietHoursStart: string;
  quietHoursEnd: string;
  dailyReportTime: string;
  isConnected: boolean;
}

export interface MLPrediction {
  timestamp: string;
  plantId: string;
  chlorophyllLevel: 'deficiency_severe' | 'deficiency_mild' | 'optimal' | 'excessive';
  estimatedSpad: number;
  confidence: number; // 0 - 1.0
  suspectedDeficiency: 'None' | 'Nitrogen (N)' | 'Phosphorus (P)' | 'Potassium (K)' | 'Iron (Fe)';
  spectralReadings: {
    r660: number;
    nir850: number;
    ndvi: number;
  };
}
