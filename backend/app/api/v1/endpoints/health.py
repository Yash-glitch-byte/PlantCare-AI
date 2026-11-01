from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db
from app.core.config import settings

router = APIRouter()

@router.get("/health", summary="Health Check and Telemetry Engine Status")
async def health_check(db: AsyncSession = Depends(get_db)):
    db_ok = False
    try:
        result = await db.execute(text("SELECT 1"))
        db_ok = bool(result.scalar() == 1)
    except Exception:
        db_ok = False

    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database_connected": db_ok,
        "telegram_configured": bool(settings.TELEGRAM_BOT_TOKEN and settings.TELEGRAM_DEFAULT_CHAT_ID),
        "simulation_active": settings.SIMULATION_ENABLED,
    }
