from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, require_admin
from app.models.feedback import Feedback
from app.models.offer import Offer
from app.models.service_record import ServiceRecord
from app.models.appointment import Appointment, AppointmentStatus
from app.models.user import User
from app.schemas.misc import FeedbackCreate, FeedbackOut, OfferCreate, OfferOut
from app.services.notification import notify_offer
from datetime import datetime

# ── Feedback ──────────────────────────────────────────────────────────────────
feedback_router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

@feedback_router.post("/", response_model=FeedbackOut)
def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not 1 <= data.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    fb = Feedback(**data.model_dump(), customer_id=current_user.id)
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb

@feedback_router.get("/", response_model=List[FeedbackOut], dependencies=[Depends(require_admin)])
def list_feedback(db: Session = Depends(get_db)):
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()

# ── Offers ────────────────────────────────────────────────────────────────────
offers_router = APIRouter(prefix="/api/offers", tags=["Offers"])

@offers_router.get("/", response_model=List[OfferOut])
def list_active_offers(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    return db.query(Offer).filter(Offer.is_active == True, Offer.valid_until >= now).all()

@offers_router.post("/", response_model=OfferOut, dependencies=[Depends(require_admin)])
def create_offer(data: OfferCreate, db: Session = Depends(get_db)):
    offer = Offer(**data.model_dump())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer

@offers_router.post("/{offer_id}/notify", dependencies=[Depends(require_admin)])
def broadcast_offer(offer_id: int, db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    customers = db.query(User).filter(User.role == "customer", User.is_active == True).all()
    for customer in customers:
        if customer.phone:
            notify_offer(customer.phone, offer.title, offer.description or "")
    return {"message": f"Offer sent to {len(customers)} customers"}

# ── Service Records ───────────────────────────────────────────────────────────
records_router = APIRouter(prefix="/api/service-records", tags=["Service Records"])

@records_router.get("/vehicle/{vehicle_id}")
def vehicle_service_history(vehicle_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.vehicle import Vehicle
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if current_user.role != "admin" and vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).order_by(ServiceRecord.service_date.desc()).all()

# ── Admin Dashboard ───────────────────────────────────────────────────────────
dashboard_router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@dashboard_router.get("/stats", dependencies=[Depends(require_admin)])
def dashboard_stats(db: Session = Depends(get_db)):
    total_customers = db.query(User).filter(User.role == "customer").count()
    total_appointments = db.query(Appointment).count()
    pending = db.query(Appointment).filter(Appointment.status == AppointmentStatus.pending).count()
    in_progress = db.query(Appointment).filter(Appointment.status == AppointmentStatus.in_progress).count()
    completed_today = db.query(Appointment).filter(
        Appointment.status == AppointmentStatus.completed,
        func.date(Appointment.updated_at) == datetime.utcnow().date()
    ).count()
    avg_rating = db.query(func.avg(Feedback.rating)).scalar()
    return {
        "total_customers": total_customers,
        "total_appointments": total_appointments,
        "pending_appointments": pending,
        "in_progress": in_progress,
        "completed_today": completed_today,
        "average_rating": round(float(avg_rating), 1) if avg_rating else 0,
    }
