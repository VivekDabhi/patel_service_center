import json
from twilio.rest import Client
from app.core.config import settings

# Twilio sandbox appointment template SID
BOOKING_TEMPLATE_SID = "HXb5b62575e6e4ff6129ad7c8efe1f983e"

_client = None

def get_client():
    global _client
    if not _client and settings.TWILIO_ACCOUNT_SID:
        _client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    return _client

def send_whatsapp(to: str, message: str):
    client = get_client()
    if not client:
        return
    try:
        client.messages.create(
            body=message,
            from_=settings.TWILIO_WHATSAPP_NUMBER,
            to=f"whatsapp:{to}"
        )
    except Exception as e:
        print(f"WhatsApp send error: {e}")

def send_whatsapp_template(to: str, variables: dict):
    """Send using Twilio content template (for sandbox approval)."""
    client = get_client()
    if not client:
        return
    try:
        client.messages.create(
            from_=settings.TWILIO_WHATSAPP_NUMBER,
            content_sid=BOOKING_TEMPLATE_SID,
            content_variables=json.dumps(variables),
            to=f"whatsapp:{to}"
        )
    except Exception as e:
        print(f"WhatsApp template send error: {e}")

def send_sms(to: str, message: str):
    client = get_client()
    if not client:
        return
    try:
        client.messages.create(body=message, from_=settings.TWILIO_PHONE_NUMBER, to=to)
    except Exception as e:
        print(f"SMS send error: {e}")

def notify_booking_confirmed(customer_name: str, phone: str, scheduled_date: str, service_type: str):
    # Use the approved sandbox template: variable 1 = date, variable 2 = time
    parts = scheduled_date.split(" ")
    date_part = parts[0] if len(parts) > 0 else scheduled_date
    time_part = parts[1] + " " + parts[2] if len(parts) >= 3 else ""
    send_whatsapp_template(phone, {"1": date_part, "2": time_part.strip()})

def notify_status_update(customer_name: str, phone: str, vehicle_number: str, status: str):
    msg = (
        f"Hello {customer_name}! Your vehicle {vehicle_number} service status has been updated to: "
        f"*{status.replace('_', ' ').upper()}*. "
        f"- {settings.BUSINESS_NAME}"
    )
    send_whatsapp(phone, msg)

def notify_service_reminder(customer_name: str, phone: str, vehicle_number: str):
    msg = (
        f"Hello {customer_name}! Your vehicle {vehicle_number} is due for its 3-month service. "
        f"Book now: {settings.FRONTEND_URL}/book "
        f"- {settings.BUSINESS_NAME}"
    )
    send_whatsapp(phone, msg)

def notify_offer(phone: str, offer_title: str, description: str):
    msg = f"Special Offer from {settings.BUSINESS_NAME}!\n{offer_title}\n{description}\nBook now: {settings.FRONTEND_URL}/book"
    send_whatsapp(phone, msg)
