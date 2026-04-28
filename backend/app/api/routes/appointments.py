from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user, require_admin
from app.models.appointment import Appointment
from app.models.vehicle import Vehicle
from app.models.user import User
from app.schemas.appointment import AppointmentCreate, AppointmentStatusUpdate, AppointmentOut
from app.services.notification import notify_booking_confirmed, notify_status_update

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.post("/", response_model=AppointmentOut)
def book_appointment(data: AppointmentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == data.vehicle_id, Vehicle.owner_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    appointment = Appointment(**data.model_dump(), customer_id=current_user.id)
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    notify_booking_confirmed(
        current_user.name, current_user.phone,
        appointment.scheduled_date.strftime("%d %b %Y %I:%M %p"),
        ", ".join(s.replace("_", " ").title() for s in data.service_types)
    )
    return appointment

@router.get("/", response_model=List[AppointmentOut])
def my_appointments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Appointment).filter(Appointment.customer_id == current_user.id).order_by(Appointment.scheduled_date.desc()).all()

@router.get("/all", response_model=List[AppointmentOut], dependencies=[Depends(require_admin)])
def all_appointments(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(Appointment.scheduled_date.desc()).offset(skip).limit(limit).all()

@router.get("/{appointment_id}", response_model=AppointmentOut)
def get_appointment(appointment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if current_user.role != "admin" and appt.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return appt

@router.patch("/{appointment_id}/status", response_model=AppointmentOut, dependencies=[Depends(require_admin)])
def update_status(appointment_id: int, data: AppointmentStatusUpdate, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = data.status
    appt.updated_at = datetime.utcnow()
    if data.status.value == "completed":
        vehicle = db.query(Vehicle).filter(Vehicle.id == appt.vehicle_id).first()
        if vehicle:
            vehicle.last_service_date = datetime.utcnow()
    db.commit()
    db.refresh(appt)
    customer = db.query(User).filter(User.id == appt.customer_id).first()
    vehicle = db.query(Vehicle).filter(Vehicle.id == appt.vehicle_id).first()
    if customer and vehicle:
        notify_status_update(customer.name, customer.phone, vehicle.vehicle_number, data.status.value)
    return appt

@router.delete("/{appointment_id}", dependencies=[Depends(get_current_user)])
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if current_user.role != "admin" and appt.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    appt.status = "cancelled"
    db.commit()
    return {"message": "Appointment cancelled"}
