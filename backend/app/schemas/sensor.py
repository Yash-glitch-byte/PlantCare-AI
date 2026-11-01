from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class SensorReadingCreate(BaseModel):
    device_id: str = Field(..., description="Unique hardware or virtual node ID")
    plant_id: str = Field(..., description="ID of monitored plant specimen")
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # Core environmental measurements
    soil_moisture: float = Field(..., ge=0, le=100, description="Volumetric water content percentage")
    temperature: float = Field(..., ge=-40, le=80, description="Ambient air temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    light_intensity: float = Field(..., ge=0, description="Ambient illumination in lux")
    
    # Substrate & Optical Research Extensions
    soil_temperature: Optional[float] = Field(None, description="Substrate core temperature in Celsius")
    soil_ph: Optional[float] = Field(None, ge=0, le=14, description="Substrate acidity level (0-14)")
    is_simulated: Optional[bool] = Field(False, description="Flag indicating simulated vs hardware ingest")
    
    # Future Optical / Chlorophyll Spectral Sensing Fields
    chlorophyll_index: Optional[float] = Field(None, description="Derived SPAD chlorophyll index equivalent")
    red_reflectance: Optional[float] = Field(None, ge=0, le=1, description="660nm Red reflectance ratio")
    near_infrared_reflectance: Optional[float] = Field(None, ge=0, le=1, description="850nm NIR reflectance ratio")
    ndvi: Optional[float] = Field(None, ge=-1, le=1, description="Normalized Difference Vegetation Index")

class SensorReadingResponse(SensorReadingCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str

class SensorStatsSummary(BaseModel):
    plant_id: str
    sample_count: int
    avg_soil_moisture: float
    min_soil_moisture: float
    max_soil_moisture: float
    avg_temperature: float
    min_temperature: float
    max_temperature: float
    avg_humidity: float
    latest_reading: Optional[SensorReadingResponse] = None
