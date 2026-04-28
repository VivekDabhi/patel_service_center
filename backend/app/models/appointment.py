from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    in_progress = "in_progress"
    completed = "completed"
    ready_for_pickup = "ready_for_pickup"
    cancelled = "cancelled"

class ServiceType(str, enum.Enum):
    general_service = "general_service"
    oil_change = "oil_change"
    tyre_change = "tyre_change"
    brake_service = "brake_service"
    battery_replacement = "battery_replacement"
    full_service = "full_service"
    repair = "repair"
    full_engine_overhaul = "full_engine_overhaul"
    other = "other"

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    service_types = Column(JSON, nullable=False)  # list of ServiceType values
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.pending)
    notes = Column(Text, nullable=True)
    pickup_required = Column(Boolean, default=False)
    pickup_address = Column(Text, nullable=True)
    drop_required = Column(Boolean, default=False)
    drop_address = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("User", back_populates="appointments")
    vehicle = relationship("Vehicle", back_populates="appointments")
    service_record = relationship("ServiceRecord", back_populates="appointment", uselist=False)
    invoice = relationship("Invoice", back_populates="appointment", uselist=False)
    payment = relationship("Payment", back_populates="appointment", uselist=False)
