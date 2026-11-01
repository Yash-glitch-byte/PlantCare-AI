from fastapi import APIRouter
from app.schemas.ml import MLInferenceRequest, MLInferenceResponse
from app.services.ml_engine import ml_engine

router = APIRouter()

@router.post("/infer", response_model=MLInferenceResponse, summary="Optical Chlorophyll & Nutrient Deficiency Sensor Fusion Inference")
async def infer_nutrient_status(req: MLInferenceRequest):
    """
    Research inference endpoint for optical chlorophyll sensing trial.
    Computes vegetation indices (NDVI) and estimates SPAD / nutrient deficiency signature.
    """
    analysis = ml_engine.evaluate_nutrient_status(
        red=req.red_reflectance,
        nir=req.near_infrared_reflectance,
        soil_moisture=req.soil_moisture,
        soil_ph=None
    )

    return {
        "plant_id": req.plant_id,
        "estimated_spad": analysis["estimated_spad"],
        "chlorophyll_level": analysis["chlorophyll_level"],
        "suspected_deficiency": analysis["suspected_deficiency"],
        "confidence": analysis["confidence"],
        "ndvi": analysis["ndvi"],
        "analysis_timestamp": analysis["analysis_timestamp"],
        "evidence_statement": analysis["evidence_statement"],
    }
