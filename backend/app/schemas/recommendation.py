from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class RecommendationBase(BaseModel):
    plant_id: str
    title: str
    category: str
    severity: str = "medium"
    evidence: str
    action_required: str

class RecommendationCreate(RecommendationBase):
    pass

class RecommendationResponse(RecommendationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_resolved: bool
    created_at: datetime
    resolved_at: Optional[datetime] = None
