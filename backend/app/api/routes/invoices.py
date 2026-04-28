from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_admin
from app.models.invoice import Invoice
from app.models.appointment import Appointment
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.misc import InvoiceCreate, InvoiceOut
from app.services.invoice_generator import generate_invoice_pdf
from app.core.config import settings
from decimal import Decimal
from datetime import datetime

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])

def _next_invoice_number(db: Session) -> str:
    count = db.query(Invoice).count()
    return f"INV-{datetime.utcnow().year}-{count + 1:04d}"

@router.post("/", response_model=InvoiceOut, dependencies=[Depends(require_admin)])
def create_invoice(data: InvoiceCreate, db: Session = Depends(get_db)):
    subtotal = sum(Decimal(str(item.total)) for item in data.line_items)
    total = subtotal + data.tax - data.discount
    invoice = Invoice(
        appointment_id=data.appointment_id,
        invoice_number=_next_invoice_number(db),
        line_items=[item.model_dump() for item in data.line_items],
        subtotal=subtotal,
        tax=data.tax,
        discount=data.discount,
        total=total
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice(invoice_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    appt = db.query(Appointment).filter(Appointment.id == invoice.appointment_id).first()
    if current_user.role != "admin" and appt.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return invoice

@router.get("/{invoice_id}/pdf")
def download_invoice_pdf(invoice_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    appt = db.query(Appointment).filter(Appointment.id == invoice.appointment_id).first()
    if current_user.role != "admin" and appt.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    customer = db.query(User).filter(User.id == appt.customer_id).first()
    vehicle = db.query(Vehicle).filter(Vehicle.id == appt.vehicle_id).first()
    pdf_bytes = generate_invoice_pdf({
        "business_name": settings.BUSINESS_NAME,
        "business_address": settings.BUSINESS_ADDRESS,
        "business_phone": settings.BUSINESS_PHONE,
        "invoice_number": invoice.invoice_number,
        "invoice_date": invoice.created_at.strftime("%d %b %Y"),
        "customer_name": customer.name,
        "customer_phone": customer.phone,
        "vehicle_number": vehicle.vehicle_number,
        "vehicle_model": vehicle.model,
        "line_items": invoice.line_items,
        "subtotal": float(invoice.subtotal),
        "tax": float(invoice.tax),
        "discount": float(invoice.discount),
        "total": float(invoice.total),
    })
    return Response(content=pdf_bytes, media_type="application/pdf",
                    headers={"Content-Disposition": f"attachment; filename={invoice.invoice_number}.pdf"})
