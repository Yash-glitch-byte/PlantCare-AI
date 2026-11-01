import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Cpu, 
  Plus, 
  Wifi, 
  Battery, 
  Key, 
  Trash2, 
  Code2, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { AddDeviceModal } from '../components/AddDeviceModal';

export const DeviceManagementPage: React.FC = () => {
  const { devices, deleteDevice } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleArduinoCode = `// ========================================================
// PlantCare AI — ESP32 Telemetry Ingestion Firmware
// Compatible with ESP32-WROOM-32 / ESP32-S3
// ========================================================
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverEndpoint = "https://your-domain.com/api/v1/sensors/readings";
const char* deviceApiKey = "esp_live_your_device_key_here";
const char* deviceId = "esp32-node-01";
const char* plantId = "plant-1";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected. IP: " + WiFi.localIP().toString());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverEndpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Device-Token", deviceApiKey);

    // Read analog and I2C sensors
    float soilMoisture = map(analogRead(34), 4095, 1500, 0, 100);
    float temperature = 24.5; // From DHT22/BME280
    float humidity = 58.0;
    int lightIntensity = 32000; // From BH1750 (lux)

    // Build JSON Payload matching FastAPI Pydantic schema
    StaticJsonDocument<256> doc;
    doc["device_id"] = deviceId;
    doc["plant_id"] = plantId;
    doc["soil_moisture"] = soilMoisture;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["light_intensity"] = lightIntensity;

    String requestBody;
    serializeJson(doc, requestBody);
    int httpResponseCode = http.POST(requestBody);

    Serial.printf("Telemetry Ingested: HTTP %d\\n", httpResponseCode);
    http.end();
  }
  delay(10000); // Sample every 10 seconds
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleArduinoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>IoT Hardware & Device Nodes</span>
            <span className="rounded-full bg-botanical-100 dark:bg-botanical-950/60 px-2 py-0.5 text-xs font-semibold text-botanical-700 dark:text-botanical-300">
              {devices.length} Nodes Registered
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Authenticate and bind physical ESP32 microcontrollers and virtual simulation units.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-botanical-600 hover:bg-botanical-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-botanical-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Provision Device Node</span>
        </button>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {devices.map((device) => {
          const isHardware = device.type === 'ESP32_PHYSICAL';
          return (
            <div key={device.id} className="glass-card p-5 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isHardware 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  }`}>
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {device.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      ID: {device.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="uppercase">{device.status}</span>
                  </span>
                  <button
                    onClick={() => deleteDevice(device.id)}
                    className="rounded-lg p-1 text-slate-400 hover:text-rose-600"
                    title="Remove Node"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <div>
                  <span className="text-[11px] text-slate-400">Bound Specimen:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">🪴 {device.plantName}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Node Type:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {isHardware ? 'ESP32 Hardware' : 'Software Simulator'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Firmware Build:</span>
                  <p className="font-mono text-slate-700 dark:text-slate-300">{device.firmwareVersion}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Heartbeat:</span>
                  <p className="text-slate-700 dark:text-slate-300">{device.lastHeartbeat}</p>
                </div>
              </div>

              {isHardware && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/40 p-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Wifi className="h-4 w-4 text-emerald-500" />
                    <span className="font-mono text-[11px]">{device.ipAddress}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Battery className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-[11px]">{device.batteryPercentage}%</span>
                  </div>
                </div>
              )}

              {/* Masked API Key */}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 p-2 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Key className="h-3.5 w-3.5" /> Token:
                </span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {device.apiKeyMasked}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Production Firmware & Ingestion Blueprint */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-botanical-600" />
              <span>ESP32 Arduino C++ Telemetry Firmware Blueprint</span>
            </h2>
            <p className="text-xs text-slate-500">
              Direct HTTPS JSON ingestion endpoint: <code className="font-mono font-bold text-botanical-600">POST /api/v1/sensors/readings</code>
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-1.5 text-xs font-bold shadow-sm"
          >
            {copiedCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Arduino Sketch'}</span>
          </button>
        </div>

        <div className="relative rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-72">
          <pre>{sampleArduinoCode}</pre>
        </div>
      </div>

      {isAddModalOpen && (
        <AddDeviceModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};
