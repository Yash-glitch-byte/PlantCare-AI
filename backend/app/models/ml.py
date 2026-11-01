from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from app.core.database import Base

class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), nullable=False, index=True)
    device_id = Column(String, nullable=True)
    estimated_spad = Column(Float, nullable=False)
    chlorophyll_level = Column(String, nullable=False) # deficiency_severe, deficiency_mild, optimal, excessive
    suspected_deficiency = Column(String, default="None") # None, Nitrogen (N), Phosphorus (P), Potassium (K), Iron (Fe)
    confidence = Column(Float, nullable=False) # 0.0 - 1.0
    ndvi = Column(Float, nullable=False)
    red_reflectance = Column(Float, nullable=False)
    nir_reflectance = Column(Float, nullable=False)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
