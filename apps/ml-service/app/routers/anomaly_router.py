from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import logging

from app.schemas.schemas import (
    AnomalyDetectionRequest,
    AnomalyDetectionResponse,
    Anomaly,
)
from app.models.model_loader import ModelLoader

logger = logging.getLogger(__name__)

router = APIRouter()

def get_model_loader():
    from main import model_loader
    return model_loader

@router.post("/detect", response_model=AnomalyDetectionResponse)
async def detect_anomalies(
    request: AnomalyDetectionRequest,
    model_loader: ModelLoader = Depends(get_model_loader)
):
    """
    Detect anomalies in time series data using Isolation Forest.
    
    Identifies unusual patterns in yield, climate, soil, or health data.
    """
    try:
        if not model_loader.anomaly_model or not model_loader.anomaly_model.model:
            raise HTTPException(status_code=503, detail="Anomaly model not loaded")
        
        logger.info(
            f"Detecting anomalies for farm {request.farm_id}, "
            f"data type {request.data_type}"
        )
        
        # Validate time series
        if not request.time_series or len(request.time_series) < 10:
            raise HTTPException(
                status_code=400,
                detail="At least 10 data points required for anomaly detection"
            )
        
        # Detect anomalies
        result = model_loader.anomaly_model.detect(
            farm_id=request.farm_id,
            data_type=request.data_type,
            time_series=request.time_series,
            sensitivity=request.sensitivity
        )
        
        # Convert anomalies to schema
        anomalies = [
            Anomaly(
                timestamp=datetime.fromisoformat(a['timestamp'].replace('Z', '+00:00')),
                value=a['value'],
                anomaly_score=a['anomaly_score'],
                severity=a['severity'],
                explanation=a['explanation'],
                recommendations=a['recommendations']
            )
            for a in result['anomalies']
        ]
        
        # Build response
        response = AnomalyDetectionResponse(
            farm_id=request.farm_id,
            data_type=request.data_type,
            anomalies_detected=result['anomalies_detected'],
            anomalies=anomalies,
            overall_health_score=result['overall_health_score'],
            detected_at=datetime.now()
        )
        
        logger.info(
            f"✅ Anomaly detection completed: {result['anomalies_detected']} anomalies found, "
            f"health score {result['overall_health_score']:.2f}"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"❌ Anomaly detection failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/info")
async def get_anomaly_model_info(
    model_loader: ModelLoader = Depends(get_model_loader)
):
    """Get information about the anomaly detection model"""
    if not model_loader.anomaly_model:
        raise HTTPException(status_code=503, detail="Anomaly model not loaded")
    
    return {
        "model_type": "Isolation Forest",
        "contamination": model_loader.anomaly_model.contamination,
        "loaded": model_loader.anomaly_model.model is not None,
    }
