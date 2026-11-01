from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class TelegramWebhookUpdate(BaseModel):
    update_id: int
    message: Optional[dict] = None

class TelegramUserCreate(BaseModel):
    chat_id: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    alert_level: str = "warning_critical"

class TelegramUserResponse(TelegramUserCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_active: bool
    last_alert_sent_at: Optional[datetime]
    created_at: datetime

class TelegramBroadcastRequest(BaseModel):
    message: str
    plant_id: Optional[str] = None
    severity: str = "warning"
