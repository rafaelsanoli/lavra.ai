from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import logging

from app.schemas.schemas import (
    YieldPredictionRequest,
    YieldPredictionResponse,
)
from app.models.model_loader import ModelLoader

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get model loader
def get_model_loader():
    from main import model_loader
    return model_loader

@router.post("/predict", response_model=YieldPredictionResponse)
async def predict_yield(
    request: YieldPredictionRequest,
    model_loader: ModelLoader = Depends(get_model_loader)
):
    """
    Predict crop yield based on climate, soil, and historical data.
    
    Uses LSTM model trained on historical yield data with climate features.
    """
    try:
        if not model_loader.yield_model or not model_loader.yield_model.model:
            raise HTTPException(status_code=503, detail="Yield model not loaded")
        
        logger.info(f"Predicting yield for farm {request.farm_id}, crop {request.crop_type}")
        
        # Make prediction
        result = model_loader.yield_model.predict(
            climate_data=request.climate_data or [],
            crop_type=request.crop_type,
            area_hectares=request.area_hectares,
            historical_yields=request.historical_yields
        )
        
        # Build response
        response = YieldPredictionResponse(
            farm_id=request.farm_id,
            crop_type=request.crop_type,
            predicted_yield=result['predicted_yield'],
            confidence=result['confidence'],
            lower_bound=result['lower_bound'],
            upper_bound=result['upper_bound'],
            factors=result['factors'],
            recommendations=result['recommendations'],
            predicted_at=datetime.now()
        )
        
        logger.info(f"✅ Yield prediction completed: {result['predicted_yield']:.2f} t/ha")
        
        return response
        
    except Exception as e:
        logger.error(f"❌ Yield prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/info")
async def get_yield_model_info(
    model_loader: ModelLoader = Depends(get_model_loader)
):
    """Get information about the yield prediction model"""
    if not model_loader.yield_model:
        raise HTTPException(status_code=503, detail="Yield model not loaded")
    
    return {
        "model_type": "LSTM",
        "sequence_length": model_loader.yield_model.sequence_length,
        "features": model_loader.yield_model.feature_names,
        "loaded": model_loader.yield_model.model is not None,
    }
