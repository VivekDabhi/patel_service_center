# 🔧 New Ranip Two-Wheeler Service Station

Full-stack web application for managing a two-wheeler service station in New Ranip, Ahmedabad.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Python · FastAPI · SQLAlchemy · Alembic |
| Database   | PostgreSQL                              |
| Web        | React.js · Bootstrap 5 · Recharts       |
| Notifications | Twilio (WhatsApp + SMS)              |
| Payments   | Razorpay                                |
| PDF        | WeasyPrint + Jinja2                     |
| Scheduler  | APScheduler (3-month reminders)         |

---

## Features

### Customer
- Register / Login (phone + password)
- Add & manage vehicles (bike, scooter, Activa)
- Book service appointments online
- Request pickup & drop service
- Track real-time service status
- View full service history per vehicle
- Download digital invoices (PDF)
- Rate & review completed services
- View active offers & discounts

### Admin
- Dashboard with stats & charts
- Manage all appointments + update status
- Status change triggers WhatsApp notification to customer
- Customer list management
- Create offers & broadcast to all customers via WhatsApp
- Generate & download PDF invoices
- Automatic 3-month service reminders (runs daily at 9 AM)

---

## Project Structure

```
service-station/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # FastAPI route handlers
│   │   ├── core/             # Config, DB, Security
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Notifications, Scheduler, PDF
│   │   ├── templates/        # Invoice HTML template
│   │   └── main.py
│   ├── alembic/              # DB migrations
│   ├── requirements.txt
│   └── .env
└── web/
    ├── src/
    │   ├── pages/            # React page components
    │   ├── components/       # Navbar, ProtectedRoute
    │   ├── context/          # Auth context
    │   └── api.js            # Axios client
    └── .env
```

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or Docker)

### 1. Database
```bash
# Using Docker (easiest)
docker-compose up db -d

# Or create manually in pgAdmin:
# Database name: service_station
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Edit .env with your DB credentials and Twilio/Razorpay keys

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### 3. Web Frontend
```bash
cd web
npm install
npm start
# App available at http://localhost:3000
```

### 4. Full Stack with Docker
```bash
docker-compose up --build
```

---

## Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sandbox number |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

---

## Creating the First Admin User

After running migrations, use the Swagger UI at `http://localhost:8000/docs`:

1. `POST /api/auth/register` — create a user
2. Manually update the role in pgAdmin:
   ```sql
   UPDATE users SET role = 'admin' WHERE phone = '+91XXXXXXXXXX';
   ```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Customer registration |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET/POST | `/api/vehicles/` | List / add vehicles |
| GET/POST | `/api/appointments/` | List / book appointments |
| PATCH | `/api/appointments/{id}/status` | Update status (admin) |
| GET | `/api/service-records/vehicle/{id}` | Service history |
| POST | `/api/invoices/` | Create invoice (admin) |
| GET | `/api/invoices/{id}/pdf` | Download PDF invoice |
| POST | `/api/payments/create-order` | Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| GET/POST | `/api/offers/` | List / create offers |
| POST | `/api/offers/{id}/notify` | Broadcast offer via WhatsApp |
| POST | `/api/feedback/` | Submit rating |
| GET | `/api/dashboard/stats` | Admin dashboard stats |
=======
# patel_service_center
