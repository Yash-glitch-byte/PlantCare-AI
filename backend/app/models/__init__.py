from app.models.plant import Plant, PlantThreshold, CareActivity
from app.models.sensor import SensorReading
from app.models.device import IoTDevice, DeviceEvent
from app.models.recommendation import Recommendation
from app.models.notification import NotificationLog
from app.models.telegram import TelegramUser
from app.models.ml import MLPrediction

__all__ = [
    "Plant",
    "PlantThreshold",
    "CareActivity",
    "SensorReading",
    "IoTDevice",
    "DeviceEvent",
    "Recommendation",
    "NotificationLog",
    "TelegramUser",
    "MLPrediction",
]
