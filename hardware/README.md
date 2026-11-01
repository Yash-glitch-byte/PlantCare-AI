# PlantCare AI — Hardware & ESP32 Integration Guide 📡

This directory contains the firmware, schematic references, and pinout documentation for connecting physical microcontrollers to the PlantCare AI platform.

---

## 🛠️ Hardware Bill of Materials (BOM)

| Component | Purpose | Interface | Recommended Part |
|---|---|---|---|
| **Microcontroller** | Central processor & WiFi stack | 2.4 GHz 802.11 b/g/n | ESP32-WROOM-32 or ESP32-S3 |
| **Soil Moisture** | Volumetric substrate moisture | Analog (0 - 3.3V) | Capacitive Moisture Sensor v1.2 |
| **Temperature & Humidity** | Canopy atmospheric monitoring | Digital 1-Wire / I2C | DHT22 / AM2302 or BME280 |
| **Ambient Light** | Photoperiod illumination | I2C | BH1750 Digital Lux Sensor |
| **Research Optical Sensor** | Dual-band reflectance (Red 660nm & NIR 850nm) | ADC / Spectral I2C | AS7262 or Photodiode Pair |
| **Power Supply** | Node power | Micro-USB / 3.7V LiPo | 5V 1A adapter or 18650 shield |

---

## 🔌 Pinout & Wiring Table

```
+------------------------------------------------------------+
| Component Pin       | ESP32 Pin      | Function            |
+---------------------+----------------+---------------------+
| Soil Moisture AOUT  | GPIO 34 (ADC1) | Substrate moisture  |
| Soil Moisture VCC   | 3.3V           | Regulated power     |
| Soil Moisture GND   | GND            | Ground              |
+---------------------+----------------+---------------------+
| DHT22 DATA          | GPIO 4         | Air Temp & Humidity |
| DHT22 VCC           | 3.3V           | Power               |
| DHT22 GND           | GND            | Ground              |
+---------------------+----------------+---------------------+
| BH1750 SDA          | GPIO 21        | I2C Data            |
| BH1750 SCL          | GPIO 22        | I2C Clock           |
| BH1750 VCC          | 3.3V           | Power               |
| BH1750 GND          | GND            | Ground              |
+---------------------+----------------+---------------------+
| Red Optical Photodiode | GPIO 35 (ADC1) | 660nm Reflectance  |
| NIR Optical Photodiode | GPIO 32 (ADC1) | 850nm Reflectance  |
+---------------------+----------------+---------------------+
| Status LED          | GPIO 2         | WiFi & Health blink |
+---------------------+----------------+---------------------+
```

> **IMPORTANT ADC NOTICE:** On ESP32, use **ADC1 pins** (GPIO 32 - 39) for analog readings when WiFi is active. ADC2 channels conflict with the ESP32 Wi-Fi hardware peripheral.

---

## ⚡ Flashing Instructions

### Via Arduino IDE
1. Install **Arduino IDE** (>= 2.0).
2. Open **File -> Preferences** and add the ESP32 board package URL:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Go to **Tools -> Board -> Boards Manager** and install `esp32 by Espressif Systems`.
4. Install required libraries via **Sketch -> Include Library -> Manage Libraries**:
   - `ArduinoJson` (v6 or v7)
5. Open `hardware/esp32_plantcare.ino`.
6. Update your WiFi SSID, Password, and Endpoint URL.
7. Select Board: **ESP32 Dev Module** and correct COM port.
8. Click **Upload**.

---

## 🔒 Security & Authentication
Each ESP32 node must authenticate using its provisioned API token:
- Header: `X-Device-Token: esp_live_••••••••`
- You can generate new device credentials directly inside the **Device Management** section of the PlantCare AI web dashboard.
