from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class MLInferenceRequest(BaseModel):
    plant_id: str
    red_reflectance: float = Field(..., ge=0, le=1)
    near_infrared_reflectance: float = Field(..., ge=0, le=1)
    soil_moisture: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None

class MLInferenceResponse(BaseModel):
    plant_id: str
    estimated_spad: float
    chlorophyll_level: str
    suspected_deficiency: str
    confidence: float
    ndvi: float
    analysis_timestamp: datetime = Field(default_factory=datetime.utcnow)
    evidence_statement: str
