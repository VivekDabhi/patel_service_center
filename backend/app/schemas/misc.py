from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from decimal import Decimal
from app.models.invoice import InvoiceStatus
from app.models.payment import PaymentStatus

# Invoice
class LineItem(BaseModel):
    name: str
    qty: int
    unit_price: Decimal
    total: Decimal

class InvoiceCreate(BaseModel):
    appointment_id: int
    line_items: List[LineItem]
    tax: Decimal = Decimal("0")
    discount: Decimal = Decimal("0")

class InvoiceOut(BaseModel):
    id: int
    appointment_id: int
    invoice_number: str
    line_items: List[Any]
    subtotal: Decimal
    tax: Decimal
    discount: Decimal
    total: Decimal
    status: InvoiceStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Feedback
class FeedbackCreate(BaseModel):
    appointment_id: int
    rating: int  # 1-5
    comment: Optional[str] = None

class FeedbackOut(BaseModel):
    id: int
    customer_id: int
    appointment_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Offer
class OfferCreate(BaseModel):
    title: str
    description: Optional[str] = None
    discount_percent: Optional[Decimal] = None
    discount_amount: Optional[Decimal] = None
    valid_from: datetime
    valid_until: datetime

class OfferOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    discount_percent: Optional[Decimal]
    discount_amount: Optional[Decimal]
    valid_from: datetime
    valid_until: datetime
    is_active: bool

    class Config:
        from_attributes = True

# Payment
class PaymentCreate(BaseModel):
    appointment_id: int
    amount: Decimal

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentOut(BaseModel):
    id: int
    appointment_id: int
    razorpay_order_id: Optional[str]
    razorpay_payment_id: Optional[str]
    amount: Decimal
    status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True
