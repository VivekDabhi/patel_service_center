from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.vehicle import VehicleType

class VehicleCreate(BaseModel):
    vehicle_number: str
    model: str
    vehicle_type: VehicleType
    brand: Optional[str] = None
    year: Optional[int] = None

class VehicleUpdate(BaseModel):
    model: Optional[str] = None
    brand: Optional[str] = None
    year: Optional[int] = None

class VehicleOut(BaseModel):
    id: int
    owner_id: int
    vehicle_number: str
    model: str
    vehicle_type: VehicleType
    brand: Optional[str]
    year: Optional[int]
    last_service_date: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
