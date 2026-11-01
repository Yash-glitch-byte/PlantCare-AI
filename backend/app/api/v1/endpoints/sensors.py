import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.sensor import SensorReading
from app.models.plant import Plant, PlantThreshold
from app.models.recommendation import Recommendation
from app.schemas.sensor import SensorReadingCreate, SensorReadingResponse, SensorStatsSummary
from app.services.intelligence_engine import IntelligenceEngine
from app.services.telegram_bot import telegram_bot_service

router = APIRouter()

@router.post("/readings", response_model=SensorReadingResponse, status_code=status.HTTP_201_CREATED, summary="Hardware and Simulated Sensor Telemetry Ingestion Endpoint")
async def ingest_sensor_reading(
    reading_in: SensorReadingCreate,
    x_device_token: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Ingests real-time environmental telemetry from ESP32 microcontrollers or the simulation engine.
    - Validates measurements
    - Evaluates plant botanical thresholds
    - Updates plant health score and stress state
    - Triggers Telegram alerts if acute stress is detected (with deduplication)
    """
    # 1. Fetch plant specimen & thresholds
    result = await db.execute(
        select(Plant).where(Plant.id == reading_in.plant_id).options(selectinload(Plant.thresholds))
    )
    plant = result.scalar_one_or_none()
    if not plant:
        raise HTTPException(
            status_code=404, 
            detail=f"Plant specimen '{reading_in.plant_id}' is not registered."
        )

    reading_id = f"read-{uuid.uuid4().hex[:10]}"
    db_reading = SensorReading(
        id=reading_id,
        plant_id=reading_in.plant_id,
        device_id=reading_in.device_id,
        timestamp=reading_in.timestamp or datetime.utcnow(),
        soil_moisture=reading_in.soil_moisture,
        temperature=reading_in.temperature,
        humidity=reading_in.humidity,
        light_intensity=reading_in.light_intensity,
        soil_temperature=reading_in.soil_temperature,
        soil_ph=reading_in.soil_ph,
        is_simulated=reading_in.is_simulated if reading_in.is_simulated is not None else False,
        chlorophyll_index=reading_in.chlorophyll_index,
        red_reflectance=reading_in.red_reflectance,
        nir_reflectance=reading_in.near_infrared_reflectance,
        ndvi=reading_in.ndvi,
    )
    db.add(db_reading)

    # 2. Evaluate with Intelligence Engine
    if plant.thresholds:
        health_score, primary_stress, recs = IntelligenceEngine.evaluate(
            plant=plant, 
            thresholds=plant.thresholds, 
            reading=db_reading
        )
        plant.health_score = health_score
        plant.current_stress = primary_stress
        plant.status = "optimal" if health_score >= 80 else ("warning" if health_score >= 60 else "critical")

        # Persist new actionable recommendations
        for rec in recs:
            db_rec = Recommendation(
                id=f"rec-{uuid.uuid4().hex[:8]}",
                plant_id=plant.id,
                title=rec["title"],
                category=rec["category"],
                severity=rec["severity"],
                evidence=rec["evidence"],
                action_required=rec["action_required"],
                is_resolved=False
            )
            db.add(db_rec)

            # 3. Dispatch automated Telegram alert if stress is significant
            if primary_stress != "none" and rec["severity"] in ["high", "critical"]:
                await telegram_bot_service.dispatch_stress_alert(
                    plant_name=plant.name,
                    plant_id=plant.id,
                    stress_type=primary_stress,
                    evidence=rec["evidence"],
                    action=rec["action_required"]
                )

    await db.commit()
    await db.refresh(db_reading)
    return db_reading

@router.get("/readings/{plant_id}", response_model=List[SensorReadingResponse], summary="Get time-series telemetry for plant")
async def get_plant_readings(
    plant_id: str,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SensorReading)
        .where(SensorReading.plant_id == plant_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(limit)
    )
    readings = result.scalars().all()
    return list(reversed(readings))

@router.get("/stats/{plant_id}", response_model=SensorStatsSummary, summary="Get statistical telemetry breakdown")
async def get_plant_stats(plant_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SensorReading)
        .where(SensorReading.plant_id == plant_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(100)
    )
    readings = result.scalars().all()
    if not readings:
        raise HTTPException(status_code=404, detail="No readings found for specimen")

    moistures = [r.soil_moisture for r in readings]
    temps = [r.temperature for r in readings]
    humidities = [r.humidity for r in readings]

    return {
        "plant_id": plant_id,
        "sample_count": len(readings),
        "avg_soil_moisture": round(sum(moistures) / len(moistures), 1),
        "min_soil_moisture": min(moistures),
        "max_soil_moisture": max(moistures),
        "avg_temperature": round(sum(temps) / len(temps), 1),
        "min_temperature": min(temps),
        "max_temperature": max(temps),
        "avg_humidity": round(sum(humidities) / len(humidities), 1),
        "latest_reading": readings[0],
    }
