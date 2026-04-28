import razorpay
import hmac
import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.payment import Payment, PaymentStatus
from app.schemas.misc import PaymentCreate, PaymentVerify, PaymentOut
from app.models.user import User

router = APIRouter(prefix="/api/payments", tags=["Payments"])

def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/create-order", response_model=dict)
def create_order(data: PaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = get_razorpay_client()
    order = client.order.create({
        "amount": int(data.amount * 100),  # paise
        "currency": "INR",
        "receipt": f"appt_{data.appointment_id}"
    })
    payment = Payment(
        appointment_id=data.appointment_id,
        razorpay_order_id=order["id"],
        amount=data.amount
    )
    db.add(payment)
    db.commit()
    return {"order_id": order["id"], "amount": order["amount"], "currency": "INR", "key": settings.RAZORPAY_KEY_ID}

@router.post("/verify", response_model=PaymentOut)
def verify_payment(data: PaymentVerify, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    payment = db.query(Payment).filter(Payment.razorpay_order_id == data.razorpay_order_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{data.razorpay_order_id}|{data.razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()
    if expected != data.razorpay_signature:
        payment.status = PaymentStatus.failed
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")
    payment.razorpay_payment_id = data.razorpay_payment_id
    payment.status = PaymentStatus.success
    db.commit()
    db.refresh(payment)
    return payment
