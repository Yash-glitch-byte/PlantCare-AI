import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.plant import Plant, PlantThreshold
from app.schemas.plant import PlantCreate, PlantUpdate, PlantResponse

router = APIRouter()

@router.get("", response_model=List[PlantResponse], summary="List all botanical specimens")
async def list_plants(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Plant).options(selectinload(Plant.thresholds))
    )
    return result.scalars().all()

@router.post("", response_model=PlantResponse, status_code=status.HTTP_201_CREATED, summary="Register new botanical specimen")
async def create_plant(plant_in: PlantCreate, db: AsyncSession = Depends(get_db)):
    plant_id = f"plant-{uuid.uuid4().hex[:8]}"
    db_plant = Plant(
        id=plant_id,
        name=plant_in.name,
        species=plant_in.species,
        category=plant_in.category,
        location=plant_in.location,
        image_emoji=plant_in.image_emoji,
        device_id=plant_in.device_id,
        planted_date=plant_in.planted_date,
        notes=plant_in.notes or "",
        health_score=95,
        status="optimal",
        current_stress="none"
    )
    db.add(db_plant)

    # Initialize thresholds
    th_data = plant_in.thresholds
    db_threshold = PlantThreshold(
        id=f"th-{uuid.uuid4().hex[:8]}",
        plant_id=plant_id,
        min_moisture=th_data.min_moisture if th_data else 40.0,
        max_moisture=th_data.max_moisture if th_data else 75.0,
        min_temp=th_data.min_temp if th_data else 18.0,
        max_temp=th_data.max_temp if th_data else 29.0,
        min_humidity=th_data.min_humidity if th_data else 50.0,
        max_humidity=th_data.max_humidity if th_data else 70.0,
        min_light=th_data.min_light if th_data else 15000.0,
        max_light=th_data.max_light if th_data else 55000.0,
        min_ph=th_data.min_ph if th_data else 6.0,
        max_ph=th_data.max_ph if th_data else 7.0,
    )
    db.add(db_threshold)
    await db.commit()

    # Re-fetch with loaded relationship
    result = await db.execute(
        select(Plant).where(Plant.id == plant_id).options(selectinload(Plant.thresholds))
    )
    return result.scalar_one()

@router.get("/{plant_id}", response_model=PlantResponse, summary="Get specimen by ID")
async def get_plant(plant_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Plant).where(Plant.id == plant_id).options(selectinload(Plant.thresholds))
    )
    plant = result.scalar_one_or_none()
    if not plant:
        raise HTTPException(status_code=404, detail="Botanical specimen not found")
    return plant

@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove botanical specimen")
async def delete_plant(plant_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    plant = result.scalar_one_or_none()
    if not plant:
        raise HTTPException(status_code=404, detail="Botanical specimen not found")
    await db.delete(plant)
    await db.commit()
    return None
