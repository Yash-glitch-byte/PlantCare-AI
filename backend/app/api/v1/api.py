from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    plants,
    sensors,
    recommendations,
    devices,
    telegram,
    simulation,
    ml_research
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(plants.router, prefix="/plants", tags=["Plants"])
api_router.include_router(sensors.router, prefix="/sensors", tags=["Sensors & Telemetry"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(devices.router, prefix="/devices", tags=["IoT Devices"])
api_router.include_router(telegram.router, prefix="/telegram", tags=["Telegram Bot"])
api_router.include_router(simulation.router, prefix="/simulation", tags=["Sensor Simulator"])
api_router.include_router(ml_research.router, prefix="/ml-research", tags=["ML Research & Optical Sensing"])
