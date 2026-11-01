import pytest
from app.models.plant import Plant, PlantThreshold
from app.models.sensor import SensorReading
from app.services.intelligence_engine import IntelligenceEngine

def test_intelligence_optimal_conditions():
    plant = Plant(id="test-1", name="Tomato", species="Solanum lycopersicum", category="Vegetable")
    thresholds = PlantThreshold(
        id="th-1",
        plant_id="test-1",
        min_moisture=40.0,
        max_moisture=75.0,
        min_temp=18.0,
        max_temp=29.0,
        min_humidity=50.0,
        max_humidity=70.0,
        min_light=15000.0,
        max_light=55000.0
    )
    reading = SensorReading(
        id="r-1",
        plant_id="test-1",
        device_id="dev-1",
        soil_moisture=58.0,
        temperature=24.0,
        humidity=60.0,
        light_intensity=32000.0
    )

    health_score, primary_stress, recs = IntelligenceEngine.evaluate(plant, thresholds, reading)

    assert health_score >= 90
    assert primary_stress == "none"
    assert len(recs) == 0

def test_intelligence_drought_stress_detection():
    plant = Plant(id="test-2", name="Basil", species="Ocimum basilicum", category="Herb")
    thresholds = PlantThreshold(
        id="th-2",
        plant_id="test-2",
        min_moisture=40.0,
        max_moisture=70.0,
        min_temp=18.0,
        max_temp=28.0,
        min_humidity=45.0,
        max_humidity=65.0,
        min_light=15000.0,
        max_light=40000.0
    )
    # Severely deficient moisture: 22%
    reading = SensorReading(
        id="r-2",
        plant_id="test-2",
        device_id="dev-2",
        soil_moisture=22.0,
        temperature=25.0,
        humidity=55.0,
        light_intensity=25000.0
    )

    health_score, primary_stress, recs = IntelligenceEngine.evaluate(plant, thresholds, reading)

    assert primary_stress == "drought"
    assert health_score < 80
    assert any("Irrigation Required" in r["title"] for r in recs)

def test_intelligence_heat_stress_detection():
    plant = Plant(id="test-3", name="Peace Lily", species="Spathiphyllum wallisii", category="Flowering")
    thresholds = PlantThreshold(
        id="th-3",
        plant_id="test-3",
        min_moisture=50.0,
        max_moisture=80.0,
        min_temp=18.0,
        max_temp=26.0,
        min_humidity=50.0,
        max_humidity=85.0,
        min_light=1500.0,
        max_light=8000.0
    )
    # High temperature: 34°C
    reading = SensorReading(
        id="r-3",
        plant_id="test-3",
        device_id="dev-3",
        soil_moisture=60.0,
        temperature=34.0,
        humidity=55.0,
        light_intensity=4000.0
    )

    health_score, primary_stress, recs = IntelligenceEngine.evaluate(plant, thresholds, reading)

    assert primary_stress == "heat_stress"
    assert any("Thermal Stress" in r["title"] for r in recs)
