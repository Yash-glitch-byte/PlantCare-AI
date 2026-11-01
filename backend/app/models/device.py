from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from app.core.database import Base

class IoTDevice(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # ESP32_PHYSICAL, VIRTUAL_SIMULATOR
    plant_id = Column(String, nullable=True)
    status = Column(String, default="online") # online, offline, calibrating
    ip_address = Column(String, nullable=True)
    mac_address = Column(String, nullable=True)
    api_key_hash = Column(String, nullable=False)
    battery_percentage = Column(Integer, nullable=True)
    firmware_version = Column(String, default="v1.0.0")
    last_heartbeat = Column(DateTime, default=datetime.utcnow)
    readings_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class DeviceEvent(Base):
    __tablename__ = "device_events"

    id = Column(String, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False, index=True)
    event_type = Column(String, nullable=False) # disconnect, reconnect, low_battery, error
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
