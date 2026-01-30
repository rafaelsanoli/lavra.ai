import numpy as np
import tensorflow as tf
from tensorflow import keras
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class YieldPredictor:
    """LSTM-based yield prediction model"""
    
    def __init__(self):
        self.model: Optional[keras.Model] = None
        self.sequence_length = 30
        self.feature_names = [
            'temperature', 'precipitation', 'humidity', 
            'solar_radiation', 'gdd', 'soil_moisture'
        ]
        
    def build_model(self, input_shape: Tuple[int, int]) -> keras.Model:
        """Build LSTM architecture"""
        model = keras.Sequential([
            # LSTM layers
            keras.layers.LSTM(
                128, 
                return_sequences=True, 
                input_shape=input_shape
            ),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(64, return_sequences=True),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(32),
            keras.layers.Dropout(0.2),
            
            # Dense layers
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='linear')  # Yield output
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae', 'mape']
        )
        
        return model
    
    def preprocess_data(
        self, 
        climate_data: List[Dict],
        historical_yields: Optional[List[float]] = None
    ) -> np.ndarray:
        """Preprocess input data into sequences"""
        # Extract features
        features = []
        for data_point in climate_data[-self.sequence_length:]:
            feature_vector = [
                data_point.get('temperature', 25.0),
                data_point.get('precipitation', 5.0),
                data_point.get('humidity', 70.0),
                data_point.get('solar_radiation', 500.0),
                data_point.get('gdd', 10.0),
                data_point.get('soil_moisture', 0.3)
            ]
            features.append(feature_vector)
        
        # Pad if necessary
        while len(features) < self.sequence_length:
            features.insert(0, features[0] if features else [0] * len(self.feature_names))
        
        features = np.array(features[-self.sequence_length:])
        
        # Normalize (simple min-max)
        features = (features - features.min(axis=0)) / (features.max(axis=0) - features.min(axis=0) + 1e-8)
        
        return features.reshape(1, self.sequence_length, len(self.feature_names))
    
    def predict(
        self,
        climate_data: List[Dict],
        crop_type: str,
        area_hectares: float,
        historical_yields: Optional[List[float]] = None
    ) -> Dict:
        """Make yield prediction"""
        if self.model is None:
            raise ValueError("Model not loaded")
        
        # Preprocess
        X = self.preprocess_data(climate_data, historical_yields)
        
        # Predict
        prediction = self.model.predict(X, verbose=0)[0][0]
        
        # Calculate confidence based on data quality
        confidence = self._calculate_confidence(climate_data, historical_yields)
        
        # Calculate bounds (95% confidence interval)
        std_dev = prediction * 0.15  # 15% standard deviation
        lower_bound = max(0, prediction - 1.96 * std_dev)
        upper_bound = prediction + 1.96 * std_dev
        
        # Factor importance (mock - would use SHAP in production)
        factors = {
            'climate': 0.35,
            'soil': 0.25,
            'crop_management': 0.20,
            'historical_performance': 0.15,
            'season': 0.05
        }
        
        # Recommendations
        recommendations = self._generate_recommendations(
            prediction, 
            crop_type, 
            climate_data
        )
        
        return {
            'predicted_yield': float(prediction),
            'confidence': confidence,
            'lower_bound': float(lower_bound),
            'upper_bound': float(upper_bound),
            'factors': factors,
            'recommendations': recommendations
        }
    
    def _calculate_confidence(
        self, 
        climate_data: List[Dict],
        historical_yields: Optional[List[float]]
    ) -> float:
        """Calculate prediction confidence"""
        confidence = 0.5  # base
        
        # More data = higher confidence
        if len(climate_data) >= self.sequence_length:
            confidence += 0.2
        
        # Historical data available
        if historical_yields and len(historical_yields) > 0:
            confidence += 0.15
        
        # Data completeness
        complete_records = sum(
            1 for d in climate_data 
            if all(k in d for k in ['temperature', 'precipitation'])
        )
        completeness = complete_records / len(climate_data) if climate_data else 0
        confidence += completeness * 0.15
        
        return min(0.95, confidence)
    
    def _generate_recommendations(
        self,
        predicted_yield: float,
        crop_type: str,
        climate_data: List[Dict]
    ) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Yield-based
        if predicted_yield < 2.5:  # Low yield
            recommendations.append(
                "Produtividade abaixo da média. Considere ajustar manejo nutricional."
            )
        elif predicted_yield > 4.0:  # High yield
            recommendations.append(
                "Previsão de alta produtividade. Planejar logística de colheita."
            )
        
        # Climate-based
        recent_precip = np.mean([d.get('precipitation', 0) for d in climate_data[-7:]])
        if recent_precip < 10:
            recommendations.append(
                "Baixa precipitação recente. Monitorar necessidade de irrigação."
            )
        
        # Crop-specific
        if crop_type == 'SOJA':
            recommendations.append(
                "Soja: Atenção especial ao estágio R5-R6 para maximizar enchimento de grãos."
            )
        elif crop_type == 'MILHO':
            recommendations.append(
                "Milho: Garantir disponibilidade hídrica no período crítico (VT-R1)."
            )
        
        return recommendations
    
    def load_model(self, model_path: str):
        """Load trained model"""
        try:
            self.model = keras.models.load_model(model_path)
            logger.info(f"✅ Yield model loaded from {model_path}")
        except Exception as e:
            logger.warning(f"⚠️ Could not load yield model: {e}")
            # Build new model for development
            self.model = self.build_model((self.sequence_length, len(self.feature_names)))
            logger.info("✅ Built new yield model (untrained)")
    
    def save_model(self, model_path: str):
        """Save trained model"""
        if self.model:
            self.model.save(model_path)
            logger.info(f"💾 Yield model saved to {model_path}")
    
    def train(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_val: np.ndarray,
        y_val: np.ndarray,
        epochs: int = 100,
        batch_size: int = 32
    ) -> Dict:
        """Train the model"""
        if self.model is None:
            self.model = self.build_model(X_train.shape[1:])
        
        # Callbacks
        early_stopping = keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
        
        reduce_lr = keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-6
        )
        
        # Train
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=[early_stopping, reduce_lr],
            verbose=1
        )
        
        # Evaluate
        val_loss, val_mae, val_mape = self.model.evaluate(X_val, y_val, verbose=0)
        
        return {
            'val_loss': float(val_loss),
            'val_mae': float(val_mae),
            'val_mape': float(val_mape),
            'epochs_trained': len(history.history['loss'])
        }
