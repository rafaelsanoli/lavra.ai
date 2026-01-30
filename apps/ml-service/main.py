from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.routers import yield_router, price_router, anomaly_router, training_router
from app.core.config import settings
from app.models.model_loader import ModelLoader

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model loader
model_loader = ModelLoader()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events"""
    # Startup
    logger.info("🤖 Starting ML Service...")
    try:
        await model_loader.load_all_models()
        logger.info("✅ All models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load models: {e}")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down ML Service...")
    model_loader.unload_all_models()

# Create FastAPI app
app = FastAPI(
    title="Lavra.ai ML Service",
    description="Machine Learning API for agricultural predictions and anomaly detection",
    version="0.17.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(yield_router.router, prefix="/api/v1/yield", tags=["Yield Prediction"])
app.include_router(price_router.router, prefix="/api/v1/prices", tags=["Price Forecasting"])
app.include_router(anomaly_router.router, prefix="/api/v1/anomaly", tags=["Anomaly Detection"])
app.include_router(training_router.router, prefix="/api/v1/training", tags=["Model Training"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Lavra.ai ML Service",
        "version": "0.17.0",
        "status": "operational",
        "models": model_loader.get_loaded_models(),
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    models_status = model_loader.get_models_status()
    
    all_loaded = all(status["loaded"] for status in models_status.values())
    
    return {
        "status": "healthy" if all_loaded else "degraded",
        "models": models_status,
    }

@app.get("/models/info")
async def models_info():
    """Get information about loaded models"""
    return model_loader.get_models_info()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
