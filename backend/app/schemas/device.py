from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class DeviceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field("ESP32_PHYSICAL")
    plant_id: Optional[str] = None
    firmware_version: str = Field("v1.0.0")

class DeviceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    type: str
    plant_id: Optional[str]
    status: str
    ip_address: Optional[str]
    mac_address: Optional[str]
    battery_percentage: Optional[int]
    firmware_version: str
    last_heartbeat: datetime
    readings_count: int
    created_at: datetime

class DeviceProvisionResponse(DeviceResponse):
    raw_api_key: str
