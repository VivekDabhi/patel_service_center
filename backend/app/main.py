from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes.auth import router as auth_router
from app.api.routes.customers import router as customers_router
from app.api.routes.vehicles import router as vehicles_router
from app.api.routes.appointments import router as appointments_router
from app.api.routes.invoices import router as invoices_router
from app.api.routes.payments import router as payments_router
from app.api.routes.misc import feedback_router, offers_router, records_router, dashboard_router
from app.services.scheduler import start_scheduler, stop_scheduler
import app.models  # noqa: F401 — ensures all models are registered

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Service Station API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.(vercel\.app|onrender\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in [auth_router, customers_router, vehicles_router, appointments_router,
               invoices_router, payments_router, feedback_router, offers_router,
               records_router, dashboard_router]:
    app.include_router(router)

@app.on_event("startup")
def startup():
    start_scheduler()

@app.on_event("shutdown")
def shutdown():
    stop_scheduler()

@app.get("/health")
def health():
    return {"status": "ok", "business": settings.BUSINESS_NAME}
