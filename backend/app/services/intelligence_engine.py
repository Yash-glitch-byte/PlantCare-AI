from typing import List, Tuple, Optional
from datetime import datetime
from app.models.plant import Plant, PlantThreshold
from app.models.sensor import SensorReading
from app.models.recommendation import Recommendation

class IntelligenceEngine:
    """
    Transparent, deterministic botanical intelligence heuristic engine.
    Compares real-time environmental telemetry against species thresholds.
    """

    @staticmethod
    def evaluate(plant: Plant, thresholds: PlantThreshold, reading: SensorReading) -> Tuple[int, str, List[dict]]:
        """
        Evaluates a sensor reading against plant thresholds.
        Returns:
            - health_score: int (0 - 100)
            - current_stress: str (none, drought, overwatering, heat_stress, etc.)
            - new_recommendations: list of dicts with actionable advice
        """
        penalties = 0
        stress_flags = []
        recommendations = []

        # 1. Soil Volumetric Moisture Evaluation
        if reading.soil_moisture < thresholds.min_moisture:
            deficit = thresholds.min_moisture - reading.soil_moisture
            penalties += min(40, int(deficit * 1.5))
            stress_flags.append("drought")
            recommendations.append({
                "title": f"Irrigation Required for {plant.name}",
                "category": "Watering",
                "severity": "critical" if deficit > 15 else "medium",
                "evidence": f"Soil volumetric moisture measured at {reading.soil_moisture}%, which is {deficit:.1f}% below minimum safe threshold ({thresholds.min_moisture}%).",
                "action_required": f"Apply moderate root irrigation of 250-400ml dechlorinated water. Re-evaluate moisture level in 45 minutes."
            })
        elif reading.soil_moisture > thresholds.max_moisture:
            excess = reading.soil_moisture - thresholds.max_moisture
            penalties += min(35, int(excess * 1.2))
            stress_flags.append("overwatering")
            recommendations.append({
                "title": f"Over-Saturation Warning for {plant.name}",
                "category": "Watering",
                "severity": "high" if excess > 15 else "medium",
                "evidence": f"Substrate moisture level reached {reading.soil_moisture}%, exceeding the upper drainage threshold ({thresholds.max_moisture}%).",
                "action_required": "Halt irrigation immediately. Inspect pot drainage holes to ensure no standing water in the runoff saucer."
            })

        # 2. Temperature Evaluation
        if reading.temperature > thresholds.max_temp:
            heat_excess = reading.temperature - thresholds.max_temp
            penalties += min(30, int(heat_excess * 3))
            stress_flags.append("heat_stress")
            recommendations.append({
                "title": f"Thermal Stress Detected for {plant.name}",
                "category": "Temperature",
                "severity": "high" if heat_excess > 5 else "medium",
                "evidence": f"Ambient air temperature measured at {reading.temperature}°C, exceeding optimal species maximum ({thresholds.max_temp}°C).",
                "action_required": "Activate greenhouse ventilation, increase shading, or mist surrounding air to lower ambient canopy temperature."
            })
        elif reading.temperature < thresholds.min_temp:
            chill_deficit = thresholds.min_temp - reading.temperature
            penalties += min(30, int(chill_deficit * 3))
            stress_flags.append("cold_stress")
            recommendations.append({
                "title": f"Low Temperature Alert for {plant.name}",
                "category": "Temperature",
                "severity": "medium",
                "evidence": f"Ambient air temperature dropped to {reading.temperature}°C, below the physiological threshold ({thresholds.min_temp}°C).",
                "action_required": "Provide secondary heating or shelter the specimen from cold downdrafts."
            })

        # 3. Relative Humidity Evaluation
        if reading.humidity < thresholds.min_humidity:
            penalties += 10
            recommendations.append({
                "title": f"Low Humidity Desiccation Risk for {plant.name}",
                "category": "Humidity",
                "severity": "low",
                "evidence": f"Air relative humidity at {reading.humidity}% (optimal minimum: {thresholds.min_humidity}%).",
                "action_required": "Increase ambient misting or group plants together to establish a localized humid microclimate."
            })

        # 4. Light Intensity Evaluation
        if reading.light_intensity > thresholds.max_light:
            penalties += 15
            stress_flags.append("excessive_light")
            recommendations.append({
                "title": f"Light Intensity Exceeds Photoperiod Ceiling for {plant.name}",
                "category": "Lighting",
                "severity": "medium",
                "evidence": f"Measured light level at {reading.light_intensity} lux exceeds maximum safe capacity ({thresholds.max_light} lux).",
                "action_required": "Introduce diffuse shading or reposition plant away from direct unscattered rays."
            })

        # Calculate final composite health score
        health_score = max(10, min(100, 100 - penalties))
        primary_stress = stress_flags[0] if stress_flags else "none"

        return health_score, primary_stress, recommendations
