from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ServiceRecord(Base):
    __tablename__ = "service_records"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    service_description = Column(Text, nullable=False)
    parts_replaced = Column(Text, nullable=True)
    technician_name = Column(String(100), nullable=True)
    service_date = Column(DateTime(timezone=True), server_default=func.now())
    next_service_due = Column(DateTime(timezone=True), nullable=True)
    total_cost = Column(Numeric(10, 2), nullable=True)
    odometer_reading = Column(Integer, nullable=True)

    vehicle = relationship("Vehicle", back_populates="service_records")
    appointment = relationship("Appointment", back_populates="service_record")
