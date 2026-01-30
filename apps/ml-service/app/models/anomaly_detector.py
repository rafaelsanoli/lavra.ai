import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Optional
import joblib
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AnomalyDetector:
    """Isolation Forest-based anomaly detection"""
    
    def __init__(self):
        self.model: Optional[IsolationForest] = None
        self.scaler = StandardScaler()
        self.contamination = 0.1  # Expected anomaly rate
        
    def build_model(self) -> IsolationForest:
        """Build Isolation Forest model"""
        model = IsolationForest(
            n_estimators=100,
            contamination=self.contamination,
            max_samples='auto',
            random_state=42,
            n_jobs=-1
        )
        return model
    
    def preprocess_data(self, time_series: List[Dict]) -> np.ndarray:
        """Preprocess time series data"""
        # Extract features
        features = []
        for i, point in enumerate(time_series):
            feature_vector = [
                point.get('value', 0),
                point.get('change', 0),
                point.get('volatility', 0),
                i,  # Time index
            ]
            
            # Add rolling statistics if enough data
            if i >= 7:
                recent_values = [time_series[j].get('value', 0) for j in range(max(0, i-7), i)]
                feature_vector.extend([
                    np.mean(recent_values),
                    np.std(recent_values),
                    np.max(recent_values),
                    np.min(recent_values),
                ])
            else:
                feature_vector.extend([0, 0, 0, 0])
        
            features.append(feature_vector)
        
        return np.array(features)
    
    def detect(
        self,
        farm_id: str,
        data_type: str,
        time_series: List[Dict],
        sensitivity: float = 0.5
    ) -> Dict:
        """Detect anomalies in time series"""
        if self.model is None:
            raise ValueError("Model not loaded")
        
        # Preprocess
        X = self.preprocess_data(time_series)
        
        # Scale
        X_scaled = self.scaler.fit_transform(X)
        
        # Predict anomalies
        predictions = self.model.predict(X_scaled)
        anomaly_scores = self.model.score_samples(X_scaled)
        
        # Normalize scores to 0-1
        anomaly_scores = (anomaly_scores - anomaly_scores.min()) / \
                        (anomaly_scores.max() - anomaly_scores.min() + 1e-8)
        
        # Adjust threshold based on sensitivity
        threshold = 0.5 - (sensitivity - 0.5) * 0.3
        
        # Extract anomalies
        anomalies = []
        for i, (pred, score) in enumerate(zip(predictions, anomaly_scores)):
            if pred == -1 or score < threshold:
                severity = self._classify_severity(score, sensitivity)
                
                anomaly = {
                    'timestamp': time_series[i].get('timestamp', datetime.now().isoformat()),
                    'value': float(time_series[i].get('value', 0)),
                    'anomaly_score': float(1 - score),  # Invert so higher = more anomalous
                    'severity': severity,
                    'explanation': self._explain_anomaly(
                        i, time_series, score, data_type
                    ),
                    'recommendations': self._generate_anomaly_recommendations(
                        severity, data_type
                    )
                }
                anomalies.append(anomaly)
        
        # Calculate overall health score
        health_score = self._calculate_health_score(anomalies, len(time_series))
        
        return {
            'anomalies_detected': len(anomalies),
            'anomalies': anomalies,
            'overall_health_score': health_score
        }
    
    def _classify_severity(self, score: float, sensitivity: float) -> str:
        """Classify anomaly severity"""
        # Adjust thresholds based on sensitivity
        critical_threshold = 0.2 + (1 - sensitivity) * 0.1
        high_threshold = 0.35 + (1 - sensitivity) * 0.1
        medium_threshold = 0.5
        
        if score < critical_threshold:
            return 'CRITICAL'
        elif score < high_threshold:
            return 'HIGH'
        elif score < medium_threshold:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _explain_anomaly(
        self,
        index: int,
        time_series: List[Dict],
        score: float,
        data_type: str
    ) -> str:
        """Generate explanation for detected anomaly"""
        value = time_series[index].get('value', 0)
        
        # Calculate deviation from recent average
        if index >= 7:
            recent_values = [time_series[i].get('value', 0) for i in range(max(0, index-7), index)]
            avg = np.mean(recent_values)
            deviation = ((value - avg) / avg * 100) if avg != 0 else 0
            
            direction = "acima" if value > avg else "abaixo"
            
            return f"Valor {abs(deviation):.1f}% {direction} da média recente. " \
                   f"Score de anomalia: {(1-score):.2f}."
        else:
            return f"Valor incomum detectado no período inicial. Score: {(1-score):.2f}."
    
    def _generate_anomaly_recommendations(
        self,
        severity: str,
        data_type: str
    ) -> List[str]:
        """Generate recommendations for detected anomalies"""
        recommendations = []
        
        # Severity-based
        if severity == 'CRITICAL':
            recommendations.append("Anomalia crítica detectada. Investigar imediatamente.")
            recommendations.append("Acionar equipe técnica para inspeção em campo.")
        elif severity == 'HIGH':
            recommendations.append("Anomalia significativa. Verificar em até 24 horas.")
        elif severity == 'MEDIUM':
            recommendations.append("Monitorar evolução. Verificar em até 72 horas.")
        
        # Data type-based
        if data_type == 'YIELD':
            recommendations.append("Verificar práticas de manejo e condições de solo.")
        elif data_type == 'CLIMATE':
            recommendations.append("Correlacionar com eventos climáticos extremos.")
        elif data_type == 'SOIL':
            recommendations.append("Realizar análise de solo detalhada.")
        elif data_type == 'HEALTH':
            recommendations.append("Inspecionar presença de pragas ou doenças.")
        
        return recommendations
    
    def _calculate_health_score(
        self,
        anomalies: List[Dict],
        total_points: int
    ) -> float:
        """Calculate overall health score"""
        if total_points == 0:
            return 1.0
        
        # Base score
        anomaly_rate = len(anomalies) / total_points
        base_score = 1.0 - anomaly_rate
        
        # Penalize based on severity
        severity_weights = {
            'CRITICAL': 0.15,
            'HIGH': 0.10,
            'MEDIUM': 0.05,
            'LOW': 0.02
        }
        
        severity_penalty = sum(
            severity_weights.get(a['severity'], 0.02)
            for a in anomalies
        )
        
        health_score = base_score - severity_penalty
        
        return float(max(0.0, min(1.0, health_score)))
    
    def load_model(self, model_path: str):
        """Load trained model"""
        try:
            saved_data = joblib.load(model_path)
            self.model = saved_data['model']
            self.scaler = saved_data['scaler']
            logger.info(f"✅ Anomaly model loaded from {model_path}")
        except Exception as e:
            logger.warning(f"⚠️ Could not load anomaly model: {e}")
            # Build new model for development
            self.model = self.build_model()
            logger.info("✅ Built new anomaly model (untrained)")
    
    def save_model(self, model_path: str):
        """Save trained model"""
        if self.model:
            saved_data = {
                'model': self.model,
                'scaler': self.scaler
            }
            joblib.dump(saved_data, model_path)
            logger.info(f"💾 Anomaly model saved to {model_path}")
    
    def train(
        self,
        X_train: np.ndarray,
        contamination: Optional[float] = None
    ) -> Dict:
        """Train the model"""
        if contamination:
            self.contamination = contamination
        
        self.model = self.build_model()
        
        # Fit scaler
        X_scaled = self.scaler.fit_transform(X_train)
        
        # Train
        self.model.fit(X_scaled)
        
        # Evaluate on training data
        predictions = self.model.predict(X_scaled)
        anomaly_count = np.sum(predictions == -1)
        anomaly_rate = anomaly_count / len(predictions)
        
        return {
            'samples_trained': len(X_train),
            'detected_anomalies': int(anomaly_count),
            'anomaly_rate': float(anomaly_rate),
            'contamination': self.contamination
        }
