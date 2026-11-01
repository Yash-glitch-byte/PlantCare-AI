from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.core.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), nullable=False, index=True)
    device_id = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Core environmental measurements
    soil_moisture = Column(Float, nullable=False)     # %
    temperature = Column(Float, nullable=False)       # °C
    humidity = Column(Float, nullable=False)          # %
    light_intensity = Column(Float, nullable=False)   # lux
    
    # Auxiliary substrate metrics
    soil_temperature = Column(Float, nullable=True)   # °C
    soil_ph = Column(Float, nullable=True)            # pH scale
    is_simulated = Column(Boolean, default=True)

    # Spectral / Chlorophyll Research extensions
    chlorophyll_index = Column(Float, nullable=True)  # SPAD equivalent
    red_reflectance = Column(Float, nullable=True)    # 660nm band
    nir_reflectance = Column(Float, nullable=True)    # 850nm band
    ndvi = Column(Float, nullable=True)               # Calculated vegetative index

    # Index for fast time-series queries
    __table_args__ = (
        Index("idx_plant_timestamp", "plant_id", "timestamp"),
    )

    plant = relationship("Plant", back_populates="sensor_readings")
