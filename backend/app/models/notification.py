from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from app.core.database import Base

class NotificationLog(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, nullable=False, index=True)
    plant_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String, default="warning") # info, warning, critical, recovery
    channel = Column(String, default="both") # telegram, web, both
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
