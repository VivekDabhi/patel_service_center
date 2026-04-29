from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.appointment import AppointmentStatus, ServiceType

class AppointmentCreate(BaseModel):
    vehicle_id: int
    service_types: List[ServiceType]
    scheduled_date: datetime
    notes: Optional[str] = None
    pickup_required: bool = False
    pickup_address: Optional[str] = None
    drop_required: bool = False
    drop_address: Optional[str] = None

    @field_validator('service_types')
    @classmethod
    def must_have_at_least_one(cls, v):
        if not v:
            raise ValueError('Select at least one service type')
        return v

class GuestAppointmentCreate(BaseModel):
    guest_name: str
    guest_phone: str
    guest_vehicle_number: str
    guest_vehicle_model: str
    service_types: List[ServiceType]
    scheduled_date: datetime
    notes: Optional[str] = None
    pickup_required: bool = False
    pickup_address: Optional[str] = None
    drop_required: bool = False
    drop_address: Optional[str] = None

    @field_validator('service_types')
    @classmethod
    def must_have_at_least_one(cls, v):
        if not v:
            raise ValueError('Select at least one service type')
        return v

class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus

class AppointmentOut(BaseModel):
    id: int
    customer_id: Optional[int]
    vehicle_id: Optional[int]
    guest_name: Optional[str]
    guest_phone: Optional[str]
    guest_vehicle_number: Optional[str]
    guest_vehicle_model: Optional[str]
    service_types: List[str]
    scheduled_date: datetime
    status: AppointmentStatus
    notes: Optional[str]
    pickup_required: bool
    pickup_address: Optional[str]
    drop_required: bool
    drop_address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
