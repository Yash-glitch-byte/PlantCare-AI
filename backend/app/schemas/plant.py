from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class PlantThresholdBase(BaseModel):
    min_moisture: float = Field(40.0, ge=0, le=100)
    max_moisture: float = Field(75.0, ge=0, le=100)
    min_temp: float = Field(18.0, ge=-10, le=60)
    max_temp: float = Field(29.0, ge=-10, le=60)
    min_humidity: float = Field(50.0, ge=0, le=100)
    max_humidity: float = Field(70.0, ge=0, le=100)
    min_light: float = Field(15000.0, ge=0)
    max_light: float = Field(55000.0, ge=0)
    min_ph: float = Field(6.0, ge=0, le=14)
    max_ph: float = Field(7.0, ge=0, le=14)

class PlantThresholdCreate(PlantThresholdBase):
    pass

class PlantThresholdResponse(PlantThresholdBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    plant_id: str
    updated_at: datetime

class PlantBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    species: str = Field(..., min_length=1, max_length=100)
    category: str = Field("Vegetable")
    location: str = Field("Greenhouse")
    image_emoji: str = Field("🌱")
    device_id: Optional[str] = None
    planted_date: Optional[str] = None
    notes: Optional[str] = ""

class PlantCreate(PlantBase):
    thresholds: Optional[PlantThresholdBase] = None

class PlantUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    health_score: Optional[int] = None
    status: Optional[str] = None
    current_stress: Optional[str] = None
    image_emoji: Optional[str] = None
    device_id: Optional[str] = None
    last_watered: Optional[str] = None
    last_fertilized: Optional[str] = None
    notes: Optional[str] = None

class PlantResponse(PlantBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    health_score: int
    status: str
    current_stress: str
    last_watered: Optional[str]
    last_fertilized: Optional[str]
    thresholds: Optional[PlantThresholdResponse] = None
    created_at: datetime
    updated_at: datetime
