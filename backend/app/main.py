from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db, async_session_maker
from app.api.v1.api import api_router
from app.models.plant import Plant, PlantThreshold
from sqlalchemy.future import select

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    await init_db()

    # Seed default research plants if database is empty
    async with async_session_maker() as session:
        result = await session.execute(select(Plant))
        if not result.scalars().first():
            tomato = Plant(
                id="plant-1",
                name="San Marzano Tomato",
                species="Solanum lycopersicum",
                category="Vegetable",
                location="Hydroponic Research Bed A",
                health_score=92,
                status="optimal",
                current_stress="none",
                image_emoji="🍅",
                device_id="esp32-node-01",
                planted_date="2026-08-15",
                last_watered="15 mins ago",
                last_fertilized="3 days ago",
                notes="Primary research subject for low-cost chlorophyll sensor and nitrogen deficiency trial."
            )
            tomato_th = PlantThreshold(
                id="th-1",
                plant_id="plant-1",
                min_moisture=45.0,
                max_moisture=75.0,
                min_temp=18.0,
                max_temp=29.0,
                min_humidity=50.0,
                max_humidity=70.0,
                min_light=25000.0,
                max_light=65000.0,
                min_ph=6.0,
                max_ph=6.8
            )
            basil = Plant(
                id="plant-2",
                name="Genovese Basil",
                species="Ocimum basilicum",
                category="Herb",
                location="Indoor Shelf Tier 2",
                health_score=78,
                status="warning",
                current_stress="drought",
                image_emoji="🌿",
                device_id="sim-node-02",
                planted_date="2026-09-01",
                last_watered="22 hours ago",
                last_fertilized="1 week ago",
                notes="Exhibiting slight wilting during peak photoperiod."
            )
            basil_th = PlantThreshold(
                id="th-2",
                plant_id="plant-2",
                min_moisture=40.0,
                max_moisture=70.0,
                min_temp=18.0,
                max_temp=28.0,
                min_humidity=45.0,
                max_humidity=65.0,
                min_light=15000.0,
                max_light=40000.0,
                min_ph=6.0,
                max_ph=7.0
            )
            session.add_all([tomato, tomato_th, basil, basil_th])
            await session.commit()

    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent IoT Plant Telemetry Monitoring, Botanical Intelligence, and Telegram Alerting Platform.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "api_v1": settings.API_V1_STR,
    }
