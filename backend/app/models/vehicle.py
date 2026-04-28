from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class VehicleType(str, enum.Enum):
    bike = "bike"
    scooter = "scooter"
    activa = "activa"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_number = Column(String(20), unique=True, nullable=False, index=True)
    model = Column(String(100), nullable=False)
    vehicle_type = Column(Enum(VehicleType), nullable=False)
    brand = Column(String(50), nullable=True)
    year = Column(Integer, nullable=True)
    last_service_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="vehicles")
    appointments = relationship("Appointment", back_populates="vehicle")
    service_records = relationship("ServiceRecord", back_populates="vehicle")
