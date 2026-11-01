from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.plant import Plant
from app.services.simulator import simulator_service

router = APIRouter()

class ScenarioUpdateRequest(BaseModel):
    scenario: str # normal, drought, overwatering, heat, recovery
    plant_id: str

@router.post("/tick", summary="Generate a simulated telemetry reading")
async def simulation_tick(req: ScenarioUpdateRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plant).where(Plant.id == req.plant_id))
    plant = result.scalar_one_or_none()
    if not plant:
        raise HTTPException(status_code=404, detail="Specimen not found")

    reading = simulator_service.generate_reading(
        plant_id=plant.id,
        device_id=plant.device_id or "sim-node-01",
        scenario=req.scenario
    )
    return reading
