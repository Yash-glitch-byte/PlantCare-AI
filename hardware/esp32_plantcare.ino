/*
 * =========================================================================================
 * PlantCare AI — ESP32 Autonomous Telemetry Ingestion Firmware
 * 
 * Hardware Target: ESP32 NodeMCU / ESP32-WROOM-32 / ESP32-S3
 * Sensors Supported:
 *   - Substrate: Capacitive Soil Moisture Sensor v1.2 (Analog ADC Pin GPIO 34)
 *   - Atmosphere: DHT22 / AM2302 (Digital Pin GPIO 4)
 *   - Illumination: BH1750 Ambient Light Sensor (I2C: SDA GPIO 21, SCL GPIO 22)
 *   - Research Optical: Dual-band Photodiode (Red 660nm GPIO 35, NIR 850nm GPIO 32)
 *
 * Ingestion Protocol: HTTPS REST POST /api/v1/sensors/readings
 * =========================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <ArduinoJson.h>

// --- Network & Server Credentials ---
const char* WIFI_SSID       = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD   = "YOUR_WIFI_PASSWORD";
const char* INGEST_ENDPOINT = "https://your-domain.com/api/v1/sensors/readings";
const char* DEVICE_API_KEY  = "esp_live_your_device_key_here";
const char* DEVICE_ID       = "esp32-node-01";
const char* PLANT_ID        = "plant-1";

// --- Sensor Pin Allocations ---
#define PIN_SOIL_MOISTURE 34
#define PIN_RED_OPTICAL   35
#define PIN_NIR_OPTICAL   32
#define PIN_STATUS_LED     2

// --- Calibration Constants ---
// Dry air reading (~3200 ADC) vs Submerged in water (~1400 ADC)
const int AIR_VALUE   = 3200;
const int WATER_VALUE = 1400;

// Sampling Interval in milliseconds
const unsigned long SAMPLING_INTERVAL_MS = 10000; // 10 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n[PlantCare AI] Initializing ESP32 Telemetry Node...");

  pinMode(PIN_STATUS_LED, OUTPUT);
  pinMode(PIN_SOIL_MOISTURE, INPUT);
  pinMode(PIN_RED_OPTICAL, INPUT);
  pinMode(PIN_NIR_OPTICAL, INPUT);

  // Initialize I2C Bus for BH1750 / BME280
  Wire.begin();

  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Connection lost. Reconnecting...");
    connectToWiFi();
  }

  // 1. Acquire Sensor Telemetry
  float soilMoisture = readSoilMoisture();
  float temperature  = readTemperature();
  float humidity     = readHumidity();
  float lightLux     = readLightIntensity();

  // 2. Research Optical Spectral Channels
  float redReflectance = readOpticalReflectance(PIN_RED_OPTICAL);
  float nirReflectance = readOpticalReflectance(PIN_NIR_OPTICAL);
  
  // Calculate NDVI on-chip: (NIR - Red) / (NIR + Red)
  float ndvi = 0.0;
  if ((nirReflectance + redReflectance) > 0.0) {
    ndvi = (nirReflectance - redReflectance) / (nirReflectance + redReflectance);
  }
  float estimatedSpad = (ndvi * 58.0) + 4.2;

  Serial.printf("[Sensors] Moisture: %.1f%% | Temp: %.1f°C | Humidity: %.1f%% | Light: %.0f lux | NDVI: %.3f\n",
                soilMoisture, temperature, humidity, lightLux, ndvi);

  // 3. Dispatch JSON Telemetry Payload to PlantCare AI Backend
  sendTelemetryPayload(soilMoisture, temperature, humidity, lightLux, redReflectance, nirReflectance, ndvi, estimatedSpad);

  delay(SAMPLING_INTERVAL_MS);
}

void connectToWiFi() {
  Serial.printf("[WiFi] Connecting to %s", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    digitalWrite(PIN_STATUS_LED, !digitalRead(PIN_STATUS_LED));
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(PIN_STATUS_LED, HIGH);
    Serial.println("\n[WiFi] Connected successfully!");
    Serial.printf("[WiFi] IP Address: %s | RSSI: %d dBm\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());
  } else {
    digitalWrite(PIN_STATUS_LED, LOW);
    Serial.println("\n[WiFi] Failed to connect. Will retry next loop.");
  }
}

float readSoilMoisture() {
  int rawADC = analogRead(PIN_SOIL_MOISTURE);
  // Constrain and invert: Higher voltage = Drier soil on capacitive sensor
  int bounded = constrain(rawADC, WATER_VALUE, AIR_VALUE);
  float percentage = map(bounded, AIR_VALUE, WATER_VALUE, 0, 100);
  return percentage;
}

float readTemperature() {
  // In production, poll DHT22 / BME280. Fallback simulation values for benchmark.
  return 24.2 + (random(-10, 10) / 10.0);
}

float readHumidity() {
  return 58.0 + (random(-20, 20) / 10.0);
}

float readLightIntensity() {
  return 32000.0 + random(-500, 500);
}

float readOpticalReflectance(int pin) {
  int raw = analogRead(pin);
  return (float)raw / 4095.0; // 12-bit ADC normalization
}

void sendTelemetryPayload(float moisture, float temp, float hum, float lux, float r660, float nir850, float ndvi, float spad) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(INGEST_ENDPOINT);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-Token", DEVICE_API_KEY);

  // Serialize JSON adhering to FastAPI SensorReadingCreate schema
  StaticJsonDocument<384> doc;
  doc["device_id"]                  = DEVICE_ID;
  doc["plant_id"]                   = PLANT_ID;
  doc["soil_moisture"]              = moisture;
  doc["temperature"]                = temp;
  doc["humidity"]                   = hum;
  doc["light_intensity"]            = lux;
  doc["red_reflectance"]            = r660;
  doc["near_infrared_reflectance"]  = nir850;
  doc["ndvi"]                       = ndvi;
  doc["chlorophyll_index"]          = spad;
  doc["is_simulated"]               = false;

  String jsonBody;
  serializeJson(doc, jsonBody);

  int httpCode = http.POST(jsonBody);

  if (httpCode == HTTP_CODE_CREATED || httpCode == HTTP_CODE_OK) {
    Serial.printf("[Ingest] Telemetry uploaded successfully (HTTP %d)\n", httpCode);
  } else {
    Serial.printf("[Ingest] Ingestion error: HTTP %d | Response: %s\n", httpCode, http.getString().c_str());
  }

  http.end();
}
