import { Plant, SensorReading, Recommendation, NotificationLog, IoTDevice, TelegramConfig, MLPrediction, SimulationScenario } from '../types';

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-1',
    name: 'San Marzano Tomato',
    species: 'Solanum lycopersicum',
    category: 'Vegetable',
    location: 'Hydroponic Research Bed A',
    healthScore: 92,
    status: 'optimal',
    currentStress: 'none',
    imageEmoji: '🍅',
    deviceId: 'esp32-node-01',
    plantedDate: '2026-08-15',
    lastWatered: '15 mins ago (Automated)',
    lastFertilized: '3 days ago',
    notes: 'Primary research subject for low-cost chlorophyll sensor and nitrogen deficiency trial.',
    thresholds: {
      minMoisture: 45,
      maxMoisture: 75,
      minTemp: 18,
      maxTemp: 29,
      minHumidity: 50,
      maxHumidity: 70,
      minLight: 25000,
      maxLight: 65000,
      minPh: 6.0,
      maxPh: 6.8,
    },
  },
  {
    id: 'plant-2',
    name: 'Genovese Basil',
    species: 'Ocimum basilicum',
    category: 'Herb',
    location: 'Indoor Shelf Tier 2',
    healthScore: 78,
    status: 'warning',
    currentStress: 'drought',
    imageEmoji: '🌿',
    deviceId: 'sim-node-02',
    plantedDate: '2026-09-01',
    lastWatered: '22 hours ago',
    lastFertilized: '1 week ago',
    notes: 'Exhibiting slight wilting during peak photoperiod. Monitoring root moisture.',
    thresholds: {
      minMoisture: 40,
      maxMoisture: 70,
      minTemp: 18,
      maxTemp: 28,
      minHumidity: 45,
      maxHumidity: 65,
      minLight: 15000,
      maxLight: 40000,
      minPh: 6.0,
      maxPh: 7.0,
    },
  },
  {
    id: 'plant-3',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    category: 'Indoor',
    location: 'Office Living Lab Corner',
    healthScore: 95,
    status: 'optimal',
    currentStress: 'none',
    imageEmoji: '🪴',
    deviceId: 'sim-node-03',
    plantedDate: '2026-03-10',
    lastWatered: '2 days ago',
    lastFertilized: '2 weeks ago',
    notes: 'Healthy fenestrations on three new leaf nodes. Light and humidity balance optimal.',
    thresholds: {
      minMoisture: 35,
      maxMoisture: 65,
      minTemp: 16,
      maxTemp: 30,
      minHumidity: 55,
      maxHumidity: 80,
      minLight: 5000,
      maxLight: 20000,
      minPh: 5.5,
      maxPh: 7.0,
    },
  },
  {
    id: 'plant-4',
    name: 'Peace Lily',
    species: 'Spathiphyllum wallisii',
    category: 'Flowering',
    location: 'Ambient Shade Bay',
    healthScore: 64,
    status: 'warning',
    currentStress: 'excessive_light',
    imageEmoji: '🪷',
    deviceId: 'sim-node-04',
    plantedDate: '2026-07-20',
    lastWatered: '1 day ago',
    lastFertilized: '3 weeks ago',
    notes: 'Mild leaf tip scorch detected from direct afternoon sunlight exposure.',
    thresholds: {
      minMoisture: 50,
      maxMoisture: 80,
      minTemp: 18,
      maxTemp: 26,
      minHumidity: 50,
      maxHumidity: 85,
      minLight: 1500,
      maxLight: 8000,
      minPh: 5.8,
      maxPh: 6.5,
    },
  },
];

export const INITIAL_DEVICES: IoTDevice[] = [
  {
    id: 'esp32-node-01',
    name: 'ESP32 Research Node A',
    type: 'ESP32_PHYSICAL',
    plantId: 'plant-1',
    plantName: 'San Marzano Tomato',
    status: 'online',
    ipAddress: '192.168.1.142',
    macAddress: 'C8:2E:18:24:A9:7B',
    apiKeyMasked: 'esp_live_••••••••9a2f',
    batteryPercentage: 94,
    firmwareVersion: 'v1.4.2-research',
    lastHeartbeat: '12 seconds ago',
    readingsCount: 8420,
  },
  {
    id: 'sim-node-02',
    name: 'Virtual Sensor Node 02',
    type: 'VIRTUAL_SIMULATOR',
    plantId: 'plant-2',
    plantName: 'Genovese Basil',
    status: 'online',
    apiKeyMasked: 'sim_virt_••••••••18c3',
    firmwareVersion: 'v2.0-sim-core',
    lastHeartbeat: '5 seconds ago',
    readingsCount: 14210,
  },
  {
    id: 'sim-node-03',
    name: 'Virtual Sensor Node 03',
    type: 'VIRTUAL_SIMULATOR',
    plantId: 'plant-3',
    plantName: 'Monstera Deliciosa',
    status: 'online',
    apiKeyMasked: 'sim_virt_••••••••77a1',
    firmwareVersion: 'v2.0-sim-core',
    lastHeartbeat: '7 seconds ago',
    readingsCount: 12940,
  },
  {
    id: 'sim-node-04',
    name: 'Virtual Sensor Node 04',
    type: 'VIRTUAL_SIMULATOR',
    plantId: 'plant-4',
    plantName: 'Peace Lily',
    status: 'online',
    apiKeyMasked: 'sim_virt_••••••••55e8',
    firmwareVersion: 'v2.0-sim-core',
    lastHeartbeat: '3 seconds ago',
    readingsCount: 9110,
  },
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    plantId: 'plant-2',
    plantName: 'Genovese Basil',
    title: 'Irrigation Needed: Soil Moisture Approaching Wilting Threshold',
    category: 'Watering',
    severity: 'medium',
    evidence: 'Soil volumetric moisture has decreased from 52% to 34% over the last 8 hours under 28,500 lux light intensity. Threshold min: 40%.',
    actionRequired: 'Apply 250ml of room-temperature distilled or dechlorinated water at root level. Avoid wetting foliage in direct light.',
    isResolved: false,
    createdAt: '18 minutes ago',
  },
  {
    id: 'rec-2',
    plantId: 'plant-4',
    plantName: 'Peace Lily',
    title: 'Photoprotection: High Light Exposure Exceeding Tolerance',
    category: 'Lighting',
    severity: 'medium',
    evidence: 'Light sensor reading registered 11,400 lux for 90 continuous minutes. Recommended species ceiling is 8,000 lux.',
    actionRequired: 'Relocate plant 1.5 meters deeper into ambient shade or draw semi-sheer blinds to filter direct solar radiation.',
    isResolved: false,
    createdAt: '45 minutes ago',
  },
  {
    id: 'rec-3',
    plantId: 'plant-1',
    plantName: 'San Marzano Tomato',
    title: 'Optimal Growth Trajectory Maintained',
    category: 'General',
    severity: 'low',
    evidence: 'All environmental parameters (Moisture: 58%, Temp: 24.2°C, Humidity: 62%, Light: 48,000 lux) aligned within 95th percentile of target botanical curve.',
    actionRequired: 'No intervention required. Maintain current fertigation schedule and automated photoperiod.',
    isResolved: true,
    createdAt: '4 hours ago',
    resolvedAt: '4 hours ago',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'notif-1',
    plantId: 'plant-2',
    plantName: 'Genovese Basil',
    title: '⚠️ Low Soil Moisture Warning',
    message: 'Moisture dropped to 34% (Safe range: 40-70%). Dehydration stress may develop within 4 hours.',
    severity: 'warning',
    channel: 'both',
    timestamp: '18 mins ago',
    read: false,
  },
  {
    id: 'notif-2',
    plantId: 'plant-4',
    plantName: 'Peace Lily',
    title: '☀️ Excessive Light Intensity',
    message: 'Current light level (11,400 lux) exceeds safe maximum (8,000 lux). Leaf tip burn risk.',
    severity: 'warning',
    channel: 'both',
    timestamp: '45 mins ago',
    read: true,
  },
  {
    id: 'notif-3',
    plantId: 'plant-1',
    plantName: 'San Marzano Tomato',
    title: '🌿 Automated Cycle Check Complete',
    message: 'Environmental telemetry in balance. Estimated SPAD index: 44.8 (Optimal nitrogen status).',
    severity: 'info',
    channel: 'web',
    timestamp: '2 hours ago',
    read: true,
  },
];

export const INITIAL_TELEGRAM_CONFIG: TelegramConfig = {
  botToken: '',
  chatId: '',
  enabled: false,
  alertLevel: 'warning_critical',
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  dailyReportTime: '08:30',
  isConnected: false,
};

export const INITIAL_ML_PREDICTION: MLPrediction = {
  timestamp: new Date().toISOString(),
  plantId: 'plant-1',
  chlorophyllLevel: 'optimal',
  estimatedSpad: 46.2,
  confidence: 0.94,
  suspectedDeficiency: 'None',
  spectralReadings: {
    r660: 0.12,
    nir850: 0.78,
    ndvi: 0.73,
  },
};

// Generate realistic 24-hour historical telemetry
export function generateHistoricalReadings(plant: Plant, scenario: SimulationScenario = 'normal'): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();

  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();

    // Natural circadian cycle:
    // Sunlight peaks around hour 13 (1 PM), zero at night
    const sunFactor = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
    let baseLight = Math.round(sunFactor * (plant.thresholds.maxLight * 0.9) + (Math.random() * 800));
    let baseTemp = 20 + sunFactor * 8 + (Math.random() * 1.5 - 0.75);
    let baseHumidity = 65 - sunFactor * 15 + (Math.random() * 4 - 2);
    let baseMoisture = 60 - (i * 0.6) + (Math.random() * 2);

    // Scenario Modifiers:
    if (scenario === 'drought') {
      baseMoisture = Math.max(15, 45 - (24 - i) * 1.2 + (Math.random() * 2));
      baseTemp += 2.5;
    } else if (scenario === 'overwatering') {
      baseMoisture = Math.min(96, 75 + (24 - i) * 0.8 + (Math.random() * 2));
      baseHumidity += 10;
    } else if (scenario === 'heat') {
      baseTemp += 7.5;
      baseHumidity = Math.max(25, baseHumidity - 18);
    } else if (scenario === 'recovery') {
      baseMoisture = Math.min(62, 28 + (24 - i) * 1.5);
    }

    const isSim = plant.deviceId.startsWith('sim-');
    const r660 = Math.max(0.05, 0.15 - (baseMoisture / 300) + (Math.random() * 0.02));
    const nir850 = Math.min(0.85, 0.70 + (baseMoisture / 400) - (Math.random() * 0.03));
    const ndvi = Number(((nir850 - r660) / (nir850 + r660)).toFixed(3));
    const estimatedSpad = Number((ndvi * 60 + 2).toFixed(1));

    readings.push({
      id: `reading-${i}`,
      plantId: plant.id,
      deviceId: plant.deviceId,
      timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      soilMoisture: Number(baseMoisture.toFixed(1)),
      temperature: Number(baseTemp.toFixed(1)),
      humidity: Number(baseHumidity.toFixed(1)),
      lightIntensity: Math.round(baseLight),
      soilTemperature: Number((baseTemp - 1.8).toFixed(1)),
      soilPh: Number((6.3 + (Math.random() * 0.3 - 0.15)).toFixed(2)),
      isSimulated: isSim,
      chlorophyllIndex: estimatedSpad,
      redReflectance: Number(r660.toFixed(3)),
      nirReflectance: Number(nir850.toFixed(3)),
      ndvi,
    });
  }

  return readings;
}
