import math
import random
from datetime import datetime
from typing import Dict, Any

class SensorSimulator:
    """
    Mathematical organic telemetry generator for PlantCare AI.
    Generates realistic circadian fluctuations and stochastic environmental noise.
    """

    @staticmethod
    def generate_reading(
        plant_id: str,
        device_id: str,
        scenario: str = "normal",
        min_moisture: float = 40.0,
        max_moisture: float = 75.0,
        min_temp: float = 18.0,
        max_temp: float = 29.0
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        hour = now.hour

        # Circadian daylight factor (0 at night, 1 at solar noon)
        sun_factor = max(0.0, math.sin(((hour - 6) / 12) * math.pi))

        base_light = int(sun_factor * 45000 + random.randint(100, 800))
        base_temp = 20.0 + sun_factor * 7.5 + (random.random() * 1.0 - 0.5)
        base_humidity = 65.0 - sun_factor * 15.0 + (random.random() * 2.0 - 1.0)
        base_moisture = 58.0 + (random.random() * 2.0 - 1.0)

        # Scenario Perturbations:
        if scenario == "drought":
            base_moisture = max(12.0, min_moisture - random.uniform(8.0, 18.0))
            base_temp += 3.0
            base_humidity = max(25.0, base_humidity - 15.0)
        elif scenario == "overwatering":
            base_moisture = min(98.0, max_moisture + random.uniform(8.0, 16.0))
            base_humidity += 12.0
        elif scenario == "heat":
            base_temp = max_temp + random.uniform(4.0, 9.0)
            base_humidity = max(20.0, base_humidity - 20.0)
        elif scenario == "recovery":
            base_moisture = 55.0 + (random.random() * 2.0)
            base_temp = 23.5

        # Optical & Chlorophyll research spectral properties
        r660 = max(0.06, min(0.35, 0.14 - (base_moisture / 400.0) + (random.random() * 0.01)))
        nir850 = max(0.40, min(0.88, 0.72 + (base_moisture / 500.0) - (random.random() * 0.02)))
        ndvi = (nir850 - r660) / (nir850 + r660)
        estimated_spad = round(ndvi * 58.0 + 3.0, 1)

        return {
            "device_id": device_id,
            "plant_id": plant_id,
            "timestamp": now,
            "soil_moisture": round(base_moisture, 1),
            "temperature": round(base_temp, 1),
            "humidity": round(base_humidity, 1),
            "light_intensity": base_light,
            "soil_temperature": round(base_temp - 1.6, 1),
            "soil_ph": round(6.4 + (random.random() * 0.2 - 0.1), 2),
            "is_simulated": True,
            "chlorophyll_index": estimated_spad,
            "red_reflectance": round(r660, 3),
            "near_infrared_reflectance": round(nir850, 3),
            "ndvi": round(ndvi, 3),
        }

simulator_service = SensorSimulator()
