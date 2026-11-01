from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Watering, Lighting, Temperature, Nutrients, General
    severity = Column(String, default="medium") # low, medium, high, critical
    evidence = Column(Text, nullable=False)
    action_required = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    plant = relationship("Plant", back_populates="recommendations")
