from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from app.core.database import Base

class TelegramUser(Base):
    __tablename__ = "telegram_users"

    id = Column(String, primary_key=True, index=True)
    chat_id = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    alert_level = Column(String, default="warning_critical")
    quiet_hours_start = Column(String, default="22:00")
    quiet_hours_end = Column(String, default="07:00")
    last_alert_sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
