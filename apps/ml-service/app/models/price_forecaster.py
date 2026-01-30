import numpy as np
import tensorflow as tf
from tensorflow import keras
from typing import Dict, List, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class PriceForecaster:
    """Transformer-based price forecasting model"""
    
    def __init__(self):
        self.model: Optional[keras.Model] = None
        self.sequence_length = 60  # 60 days lookback
        self.num_heads = 8
        self.num_layers = 4
        self.d_model = 128
        
    def build_model(self, input_shape: Tuple[int, int]) -> keras.Model:
        """Build Transformer architecture"""
        inputs = keras.Input(shape=input_shape)
        
        # Positional encoding
        x = self._positional_encoding(inputs)
        
        # Transformer encoder blocks
        for _ in range(self.num_layers):
            x = self._transformer_encoder(x, self.num_heads, self.d_model)
        
        # Global average pooling
        x = keras.layers.GlobalAveragePooling1D()(x)
        
        # Dense layers
        x = keras.layers.Dense(128, activation='relu')(x)
        x = keras.layers.Dropout(0.2)(x)
        x = keras.layers.Dense(64, activation='relu')(x)
        x = keras.layers.Dropout(0.2)(x)
        
        # Output layer (predicting next price)
        outputs = keras.layers.Dense(1, activation='linear')(x)
        
        model = keras.Model(inputs=inputs, outputs=outputs)
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae', 'mape']
        )
        
        return model
    
    def _positional_encoding(self, x):
        """Add positional encoding to input"""
        position = tf.range(start=0, limit=self.sequence_length, delta=1)
        position = tf.cast(position, tf.float32)
        position = tf.expand_dims(position, 1)
        
        div_term = tf.exp(
            tf.range(0, self.d_model, 2, dtype=tf.float32) * 
            -(np.log(10000.0) / self.d_model)
        )
        
        pos_encoding = tf.concat([
            tf.sin(position * div_term),
            tf.cos(position * div_term)
        ], axis=-1)
        
        pos_encoding = tf.expand_dims(pos_encoding, 0)
        
        return x + pos_encoding[:, :tf.shape(x)[1], :]
    
    def _transformer_encoder(self, x, num_heads: int, d_model: int):
        """Single transformer encoder block"""
        # Multi-head attention
        attn_output = keras.layers.MultiHeadAttention(
            num_heads=num_heads,
            key_dim=d_model // num_heads
        )(x, x)
        attn_output = keras.layers.Dropout(0.1)(attn_output)
        
        # Add & Norm
        x = keras.layers.LayerNormalization(epsilon=1e-6)(x + attn_output)
        
        # Feed forward
        ffn_output = keras.layers.Dense(d_model * 4, activation='relu')(x)
        ffn_output = keras.layers.Dense(d_model)(ffn_output)
        ffn_output = keras.layers.Dropout(0.1)(ffn_output)
        
        # Add & Norm
        x = keras.layers.LayerNormalization(epsilon=1e-6)(x + ffn_output)
        
        return x
    
    def preprocess_data(
        self,
        historical_prices: List[float],
        external_factors: Optional[Dict] = None
    ) -> np.ndarray:
        """Preprocess price data"""
        # Take last sequence_length prices
        prices = np.array(historical_prices[-self.sequence_length:])
        
        # Pad if necessary
        if len(prices) < self.sequence_length:
            padding = np.repeat(prices[0], self.sequence_length - len(prices))
            prices = np.concatenate([padding, prices])
        
        # Calculate returns (log returns)
        returns = np.diff(np.log(prices + 1e-8))
        returns = np.insert(returns, 0, 0)
        
        # Normalize
        returns = (returns - returns.mean()) / (returns.std() + 1e-8)
        
        # Reshape for model
        return returns.reshape(1, self.sequence_length, 1)
    
    def forecast(
        self,
        commodity: str,
        historical_prices: List[float],
        forecast_horizon: int,
        external_factors: Optional[Dict] = None
    ) -> Dict:
        """Forecast future prices"""
        if self.model is None:
            raise ValueError("Model not loaded")
        
        # Preprocess
        X = self.preprocess_data(historical_prices, external_factors)
        
        # Multi-step forecasting
        forecasted_prices = []
        current_sequence = X[0]
        
        for step in range(forecast_horizon):
            # Predict next price change
            next_return = self.model.predict(
                current_sequence.reshape(1, self.sequence_length, 1),
                verbose=0
            )[0][0]
            
            # Convert return to price
            last_price = historical_prices[-1] if step == 0 else forecasted_prices[-1]['price']
            next_price = last_price * np.exp(next_return)
            
            # Calculate confidence (decreases with horizon)
            confidence = self._calculate_confidence(step, forecast_horizon)
            
            forecasted_prices.append({
                'day': step + 1,
                'price': float(next_price),
                'confidence': confidence
            })
            
            # Update sequence
            current_sequence = np.roll(current_sequence, -1, axis=0)
            current_sequence[-1] = next_return
        
        # Calculate trend
        trend = self._determine_trend(forecasted_prices)
        
        # Calculate volatility
        price_changes = [fp['price'] for fp in forecasted_prices]
        volatility = float(np.std(price_changes) / np.mean(price_changes))
        
        # Overall confidence
        overall_confidence = np.mean([fp['confidence'] for fp in forecasted_prices])
        
        # Recommendations
        recommendations = self._generate_recommendations(
            commodity,
            trend,
            volatility,
            forecasted_prices
        )
        
        return {
            'forecasted_prices': forecasted_prices,
            'trend': trend,
            'volatility': volatility,
            'confidence': float(overall_confidence),
            'recommendations': recommendations
        }
    
    def _calculate_confidence(self, step: int, horizon: int) -> float:
        """Calculate confidence for each forecast step"""
        # Confidence decreases exponentially with forecast horizon
        decay_rate = 0.02
        confidence = 0.9 * np.exp(-decay_rate * step)
        return float(max(0.3, min(0.95, confidence)))
    
    def _determine_trend(self, forecasted_prices: List[Dict]) -> str:
        """Determine overall price trend"""
        first_price = forecasted_prices[0]['price']
        last_price = forecasted_prices[-1]['price']
        
        change_pct = (last_price - first_price) / first_price
        
        if change_pct > 0.05:
            return 'BULLISH'
        elif change_pct < -0.05:
            return 'BEARISH'
        else:
            return 'NEUTRAL'
    
    def _generate_recommendations(
        self,
        commodity: str,
        trend: str,
        volatility: float,
        forecasted_prices: List[Dict]
    ) -> List[str]:
        """Generate trading recommendations"""
        recommendations = []
        
        # Trend-based
        if trend == 'BULLISH':
            recommendations.append(
                f"Tendência de alta para {commodity}. Considere postergar vendas ou hedge parcial."
            )
        elif trend == 'BEARISH':
            recommendations.append(
                f"Tendência de baixa para {commodity}. Recomenda-se hedge ou venda antecipada."
            )
        else:
            recommendations.append(
                f"Mercado lateral para {commodity}. Manter estratégia de venda programada."
            )
        
        # Volatility-based
        if volatility > 0.15:
            recommendations.append(
                "Alta volatilidade detectada. Considere estratégias de collar ou options para proteção."
            )
        elif volatility < 0.05:
            recommendations.append(
                "Baixa volatilidade. Momento favorável para fixação de preços."
            )
        
        # Specific opportunities
        max_price = max(forecasted_prices, key=lambda x: x['price'])
        if max_price['day'] <= 30:
            recommendations.append(
                f"Pico de preço previsto no dia {max_price['day']}. Avaliar venda neste período."
            )
        
        return recommendations
    
    def load_model(self, model_path: str):
        """Load trained model"""
        try:
            self.model = keras.models.load_model(model_path)
            logger.info(f"✅ Price model loaded from {model_path}")
        except Exception as e:
            logger.warning(f"⚠️ Could not load price model: {e}")
            # Build new model for development
            self.model = self.build_model((self.sequence_length, 1))
            logger.info("✅ Built new price model (untrained)")
    
    def save_model(self, model_path: str):
        """Save trained model"""
        if self.model:
            self.model.save(model_path)
            logger.info(f"💾 Price model saved to {model_path}")
    
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
            patience=15,
            restore_best_weights=True
        )
        
        reduce_lr = keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=7,
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
