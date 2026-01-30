import os
from typing import Dict, Optional
import logging

from app.models.yield_predictor import YieldPredictor
from app.models.price_forecaster import PriceForecaster
from app.models.anomaly_detector import AnomalyDetector
from app.core.config import settings

logger = logging.getLogger(__name__)

class ModelLoader:
    """Centralized model loader and manager"""
    
    def __init__(self):
        self.yield_model: Optional[YieldPredictor] = None
        self.price_model: Optional[PriceForecaster] = None
        self.anomaly_model: Optional[AnomalyDetector] = None
        
    async def load_all_models(self):
        """Load all ML models"""
        # Create models directory if not exists
        os.makedirs(settings.MODELS_DIR, exist_ok=True)
        
        # Load Yield Predictor
        logger.info("Loading Yield Predictor...")
        self.yield_model = YieldPredictor()
        self.yield_model.load_model(settings.YIELD_MODEL_PATH)
        
        # Load Price Forecaster
        logger.info("Loading Price Forecaster...")
        self.price_model = PriceForecaster()
        self.price_model.load_model(settings.PRICE_MODEL_PATH)
        
        # Load Anomaly Detector
        logger.info("Loading Anomaly Detector...")
        self.anomaly_model = AnomalyDetector()
        self.anomaly_model.load_model(settings.ANOMALY_MODEL_PATH)
        
        logger.info("✅ All models loaded")
    
    def unload_all_models(self):
        """Unload all models to free memory"""
        self.yield_model = None
        self.price_model = None
        self.anomaly_model = None
        logger.info("🗑️ All models unloaded")
    
    def get_loaded_models(self) -> list:
        """Get list of loaded models"""
        loaded = []
        if self.yield_model and self.yield_model.model:
            loaded.append("yield_predictor")
        if self.price_model and self.price_model.model:
            loaded.append("price_forecaster")
        if self.anomaly_model and self.anomaly_model.model:
            loaded.append("anomaly_detector")
        return loaded
    
    def get_models_status(self) -> Dict:
        """Get status of all models"""
        return {
            "yield_predictor": {
                "loaded": self.yield_model is not None and self.yield_model.model is not None,
                "type": "LSTM",
            },
            "price_forecaster": {
                "loaded": self.price_model is not None and self.price_model.model is not None,
                "type": "Transformer",
            },
            "anomaly_detector": {
                "loaded": self.anomaly_model is not None and self.anomaly_model.model is not None,
                "type": "Isolation Forest",
            },
        }
    
    def get_models_info(self) -> Dict:
        """Get detailed information about models"""
        info = {}
        
        if self.yield_model:
            info["yield_predictor"] = {
                "type": "LSTM",
                "sequence_length": self.yield_model.sequence_length,
                "features": self.yield_model.feature_names,
                "loaded": self.yield_model.model is not None,
            }
        
        if self.price_model:
            info["price_forecaster"] = {
                "type": "Transformer",
                "sequence_length": self.price_model.sequence_length,
                "num_heads": self.price_model.num_heads,
                "num_layers": self.price_model.num_layers,
                "loaded": self.price_model.model is not None,
            }
        
        if self.anomaly_model:
            info["anomaly_detector"] = {
                "type": "Isolation Forest",
                "contamination": self.anomaly_model.contamination,
                "loaded": self.anomaly_model.model is not None,
            }
        
        return info
