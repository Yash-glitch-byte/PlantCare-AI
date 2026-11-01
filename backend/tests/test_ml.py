import pytest
from app.services.ml_engine import MLEngine

def test_vegetation_indices_calculation():
    # Dense healthy canopy: High NIR (0.75), low Red (0.12)
    indices = MLEngine.compute_vegetation_indices(red=0.12, nir=0.75)
    
    assert "ndvi" in indices
    assert "estimated_spad" in indices
    # NDVI = (0.75 - 0.12) / (0.75 + 0.12) = 0.63 / 0.87 = ~0.724
    assert 0.70 <= indices["ndvi"] <= 0.75
    assert indices["estimated_spad"] >= 40.0

def test_nutrient_status_inference_optimal():
    result = MLEngine.evaluate_nutrient_status(red=0.10, nir=0.80)
    assert result["chlorophyll_level"] == "optimal"
    assert result["suspected_deficiency"] == "None"
    assert result["confidence"] >= 0.90

def test_nutrient_status_inference_chlorosis():
    # Chlorotic leaf: Low NIR (0.35), high Red reflectance (0.30)
    result = MLEngine.evaluate_nutrient_status(red=0.30, nir=0.35)
    assert result["chlorophyll_level"] == "deficiency_severe"
    assert "Nitrogen" in result["suspected_deficiency"]
