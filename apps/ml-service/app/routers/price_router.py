from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import logging

from app.schemas.schemas import (
    PriceForecastRequest,
    PriceForecastResponse,
)
from app.models.model_loader import ModelLoader

logger = logging.getLogger(__name__)

router = APIRouter()

def get_model_loader():
    from main import model_loader
    return model_loader

@router.post("/forecast", response_model=PriceForecastResponse)
async def forecast_prices(
    request: PriceForecastRequest,
    model_loader: ModelLoader = Depends(get_model_loader)
):
    """
    Forecast commodity prices using Transformer model.
    
    Predicts future prices based on historical price data and market factors.
    """
    try:
        if not model_loader.price_model or not model_loader.price_model.model:
            raise HTTPException(status_code=503, detail="Price model not loaded")
        
        logger.info(
            f"Forecasting {request.commodity} prices for {request.forecast_horizon} days"
        )
        
        # Validate historical prices
        if not request.historical_prices or len(request.historical_prices) < 7:
            raise HTTPException(
                status_code=400,
                detail="At least 7 days of historical prices required"
            )
        
        # Make forecast
        result = model_loader.price_model.forecast(
            commodity=request.commodity,
            historical_prices=request.historical_prices,
            forecast_horizon=request.forecast_horizon,
            external_factors=request.external_factors
        )
        
        # Build response
        response = PriceForecastResponse(
            commodity=request.commodity,
            forecast_horizon=request.forecast_horizon,
            forecasted_prices=result['forecasted_prices'],
            trend=result['trend'],
            volatility=result['volatility'],
            confidence=result['confidence'],
            recommendations=result['recommendations'],
            forecasted_at=datetime.now()
        )
        
        logger.info(
            f"✅ Price forecast completed: {result['trend']} trend, "
            f"{result['volatility']:.2%} volatility"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"❌ Price forecast failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/info")
async def get_price_model_info(
    model_loader: ModelLoader = Depends(get_model_loader)
):
    """Get information about the price forecasting model"""
    if not model_loader.price_model:
        raise HTTPException(status_code=503, detail="Price model not loaded")
    
    return {
        "model_type": "Transformer",
        "sequence_length": model_loader.price_model.sequence_length,
        "num_heads": model_loader.price_model.num_heads,
        "num_layers": model_loader.price_model.num_layers,
        "d_model": model_loader.price_model.d_model,
        "loaded": model_loader.price_model.model is not None,
    }
