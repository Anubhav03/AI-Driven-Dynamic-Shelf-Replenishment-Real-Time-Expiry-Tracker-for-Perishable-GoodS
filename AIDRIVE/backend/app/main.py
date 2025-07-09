from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import products, expiry, alerts, forecast

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(expiry.router, prefix="/api/v1/expiry", tags=["expiry"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(forecast.router, prefix="/api/v1/forecast", tags=["forecast"])

# --- Auto-create DB tables on startup ---
from app.db.base import Base
from app.db.database import engine
Base.metadata.create_all(bind=engine)
