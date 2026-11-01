from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationResponse

router = APIRouter()

@router.get("", response_model=List[RecommendationResponse], summary="List actionable recommendations")
async def list_recommendations(
    unresolved_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    query = select(Recommendation).order_by(Recommendation.created_at.desc())
    if unresolved_only:
        query = query.where(Recommendation.is_resolved == False)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/{rec_id}/resolve", response_model=RecommendationResponse, summary="Mark recommendation as resolved")
async def resolve_recommendation(rec_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recommendation).where(Recommendation.id == rec_id))
    rec = result.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    rec.is_resolved = True
    rec.resolved_at = datetime.utcnow()
    await db.commit()
    await db.refresh(rec)
    return rec
