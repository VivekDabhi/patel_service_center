from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.vehicle import Vehicle
from app.models.user import User
from app.services.notification import notify_service_reminder

scheduler = BackgroundScheduler()

def send_service_reminders():
    db: Session = SessionLocal()
    try:
        threshold = datetime.utcnow() - timedelta(days=90)
        due_vehicles = (
            db.query(Vehicle)
            .filter(Vehicle.last_service_date <= threshold)
            .all()
        )
        for vehicle in due_vehicles:
            owner: User = vehicle.owner
            if owner and owner.is_active and owner.phone:
                notify_service_reminder(owner.name, owner.phone, vehicle.vehicle_number)
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(send_service_reminders, "cron", hour=9, minute=0)  # Daily at 9 AM
    scheduler.start()

def stop_scheduler():
    scheduler.shutdown()
