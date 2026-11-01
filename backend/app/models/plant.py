from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Plant(Base):
    __tablename__ = "plants"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    species = Column(String, nullable=False)
    category = Column(String, nullable=False) # Vegetable, Indoor, Herb, Flowering, Succulent
    location = Column(String, default="Greenhouse")
    health_score = Column(Integer, default=100)
    status = Column(String, default="optimal") # optimal, warning, critical, dormant
    current_stress = Column(String, default="none")
    image_emoji = Column(String, default="🌱")
    device_id = Column(String, nullable=True)
    planted_date = Column(String, nullable=True)
    last_watered = Column(String, nullable=True)
    last_fertilized = Column(String, nullable=True)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    thresholds = relationship("PlantThreshold", back_populates="plant", uselist=False, cascade="all, delete-orphan")
    sensor_readings = relationship("SensorReading", back_populates="plant", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="plant", cascade="all, delete-orphan")

class PlantThreshold(Base):
    __tablename__ = "plant_thresholds"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), unique=True, nullable=False)
    min_moisture = Column(Float, default=40.0)
    max_moisture = Column(Float, default=75.0)
    min_temp = Column(Float, default=18.0)
    max_temp = Column(Float, default=29.0)
    min_humidity = Column(Float, default=50.0)
    max_humidity = Column(Float, default=70.0)
    min_light = Column(Float, default=15000.0)
    max_light = Column(Float, default=55000.0)
    min_ph = Column(Float, default=6.0)
    max_ph = Column(Float, default=7.0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    plant = relationship("Plant", back_populates="thresholds")

class CareActivity(Base):
    __tablename__ = "care_activities"

    id = Column(String, primary_key=True, index=True)
    plant_id = Column(String, ForeignKey("plants.id"), nullable=False, index=True)
    activity_type = Column(String, nullable=False) # watering, fertilizing, pruning, repotting
    notes = Column(Text, default="")
    performed_at = Column(DateTime, default=datetime.utcnow)
