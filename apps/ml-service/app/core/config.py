from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://lavra.ai",
    ]
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5433/lavra"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Model Paths
    MODELS_DIR: str = "./models"
    YIELD_MODEL_PATH: str = "./models/yield_predictor.h5"
    PRICE_MODEL_PATH: str = "./models/price_forecaster.h5"
    ANOMALY_MODEL_PATH: str = "./models/anomaly_detector.joblib"
    
    # Training Settings
    TRAINING_DATA_DIR: str = "./data"
    BATCH_SIZE: int = 32
    EPOCHS: int = 100
    LEARNING_RATE: float = 0.001
    
    # Model Hyperparameters
    LSTM_UNITS: int = 128
    LSTM_DROPOUT: float = 0.2
    TRANSFORMER_HEADS: int = 8
    TRANSFORMER_LAYERS: int = 4
    
    # Inference Settings
    MAX_PREDICTION_HORIZON: int = 90  # days
    CONFIDENCE_THRESHOLD: float = 0.7
    
    # Feature Engineering
    SEQUENCE_LENGTH: int = 30  # days for time series
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
