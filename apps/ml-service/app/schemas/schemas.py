from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ============ Yield Prediction ============

class YieldPredictionRequest(BaseModel):
    """Request for yield prediction"""
    farm_id: str
    crop_type: str = Field(..., description="SOJA, MILHO, CAFE, etc")
    area_hectares: float = Field(..., gt=0)
    planting_date: str = Field(..., description="YYYY-MM-DD")
    climate_data: Optional[List[Dict[str, float]]] = None
    soil_data: Optional[Dict[str, Any]] = None
    historical_yields: Optional[List[float]] = None

class YieldPredictionResponse(BaseModel):
    """Response for yield prediction"""
    farm_id: str
    crop_type: str
    predicted_yield: float = Field(..., description="tons per hectare")
    confidence: float = Field(..., ge=0, le=1)
    lower_bound: float
    upper_bound: float
    factors: Dict[str, float]
    recommendations: List[str]
    predicted_at: datetime

# ============ Price Forecasting ============

class PriceForecastRequest(BaseModel):
    """Request for price forecasting"""
    commodity: str = Field(..., description="SOJA, MILHO, CAFE, etc")
    forecast_horizon: int = Field(..., ge=1, le=90, description="days")
    historical_prices: Optional[List[float]] = None
    external_factors: Optional[Dict[str, Any]] = None

class PriceForecastResponse(BaseModel):
    """Response for price forecasting"""
    commodity: str
    forecast_horizon: int
    forecasted_prices: List[Dict[str, Any]]
    trend: str = Field(..., description="BULLISH, BEARISH, NEUTRAL")
    volatility: float
    confidence: float
    recommendations: List[str]
    forecasted_at: datetime

# ============ Anomaly Detection ============

class AnomalyDetectionRequest(BaseModel):
    """Request for anomaly detection"""
    farm_id: str
    data_type: str = Field(..., description="YIELD, CLIMATE, SOIL, HEALTH")
    time_series: List[Dict[str, Any]]
    sensitivity: float = Field(default=0.5, ge=0, le=1)

class Anomaly(BaseModel):
    """Detected anomaly"""
    timestamp: datetime
    value: float
    anomaly_score: float
    severity: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    explanation: str
    recommendations: List[str]

class AnomalyDetectionResponse(BaseModel):
    """Response for anomaly detection"""
    farm_id: str
    data_type: str
    anomalies_detected: int
    anomalies: List[Anomaly]
    overall_health_score: float
    detected_at: datetime

# ============ Model Training ============

class TrainingRequest(BaseModel):
    """Request to train/retrain a model"""
    model_type: str = Field(..., description="YIELD, PRICE, ANOMALY")
    training_data_path: str
    validation_split: float = Field(default=0.2, ge=0.1, le=0.3)
    hyperparameters: Optional[Dict[str, Any]] = None
    save_path: Optional[str] = None

class TrainingStatus(BaseModel):
    """Training job status"""
    job_id: str
    model_type: str
    status: str = Field(..., description="PENDING, TRAINING, COMPLETED, FAILED")
    progress: float = Field(..., ge=0, le=1)
    current_epoch: Optional[int] = None
    total_epochs: Optional[int] = None
    metrics: Optional[Dict[str, float]] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class TrainingResponse(BaseModel):
    """Response for training request"""
    job_id: str
    model_type: str
    status: str
    message: str
    estimated_duration: Optional[int] = Field(None, description="seconds")

# ============ Model Info ============

class ModelInfo(BaseModel):
    """Information about a model"""
    model_type: str
    version: str
    loaded: bool
    last_trained: Optional[datetime] = None
    metrics: Optional[Dict[str, float]] = None
    parameters: Optional[Dict[str, Any]] = None
