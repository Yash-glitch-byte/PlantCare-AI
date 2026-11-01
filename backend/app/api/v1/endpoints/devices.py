import uuid
import secrets
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.device import IoTDevice
from app.schemas.device import DeviceCreate, DeviceResponse, DeviceProvisionResponse

router = APIRouter()

@router.get("", response_model=List[DeviceResponse], summary="List all registered hardware and virtual nodes")
async def list_devices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(IoTDevice).order_by(IoTDevice.created_at.desc()))
    return result.scalars().all()

@router.post("", response_model=DeviceProvisionResponse, status_code=status.HTTP_201_CREATED, summary="Provision new ESP32 hardware or simulation node")
async def provision_device(device_in: DeviceCreate, db: AsyncSession = Depends(get_db)):
    device_id = f"esp32-{uuid.uuid4().hex[:8]}" if device_in.type == "ESP32_PHYSICAL" else f"sim-{uuid.uuid4().hex[:8]}"
    raw_api_key = f"esp_live_{secrets.token_urlsafe(24)}"

    db_device = IoTDevice(
        id=device_id,
        name=device_in.name,
        type=device_in.type,
        plant_id=device_in.plant_id,
        status="online",
        api_key_hash=raw_api_key[:12] + "...",
        firmware_version=device_in.firmware_version,
        battery_percentage=98 if device_in.type == "ESP32_PHYSICAL" else None,
        last_heartbeat=datetime.utcnow(),
        readings_count=0
    )
    db.add(db_device)
    await db.commit()
    await db.refresh(db_device)

    return {
        "id": db_device.id,
        "name": db_device.name,
        "type": db_device.type,
        "plant_id": db_device.plant_id,
        "status": db_device.status,
        "ip_address": db_device.ip_address,
        "mac_address": db_device.mac_address,
        "battery_percentage": db_device.battery_percentage,
        "firmware_version": db_device.firmware_version,
        "last_heartbeat": db_device.last_heartbeat,
        "readings_count": db_device.readings_count,
        "created_at": db_device.created_at,
        "raw_api_key": raw_api_key,
    }

@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Decommission device node")
async def decommission_device(device_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(IoTDevice).where(IoTDevice.id == device_id))
    dev = result.scalar_one_or_none()
    if not dev:
        raise HTTPException(status_code=404, detail="Device not found")
    await db.delete(dev)
    await db.commit()
    return None
