# Lavra.ai ML Service

FastAPI-based Machine Learning service for agricultural predictions.

## 🤖 Models

### 1. Yield Predictor (LSTM)
- **Architecture:** Multi-layer LSTM with dropout
- **Input:** Time series climate data (30 days)
- **Output:** Predicted yield (tons/hectare)
- **Features:** Temperature, precipitation, humidity, solar radiation, GDD, soil moisture

### 2. Price Forecaster (Transformer)
- **Architecture:** Multi-head attention Transformer
- **Input:** Historical prices (60 days)
- **Output:** Price forecast (1-90 days)
- **Features:** Log returns, volatility, market sentiment

### 3. Anomaly Detector (Isolation Forest)
- **Architecture:** Ensemble-based anomaly detection
- **Input:** Time series data (any metric)
- **Output:** Anomaly scores and health score
- **Use cases:** Yield anomalies, climate extremes, soil issues

## 🚀 Quick Start

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

### Run Service

```bash
# Development
uvicorn main:app --reload --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Documentation

Access interactive API docs at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📡 API Endpoints

### Yield Prediction
```bash
POST /api/v1/yield/predict
```

**Request:**
```json
{
  "farm_id": "farm_123",
  "crop_type": "SOJA",
  "area_hectares": 100.0,
  "planting_date": "2026-10-15",
  "climate_data": [
    {
      "temperature": 25.5,
      "precipitation": 12.3,
      "humidity": 75.0
    }
  ]
}
```

**Response:**
```json
{
  "predicted_yield": 3.85,
  "confidence": 0.82,
  "lower_bound": 3.25,
  "upper_bound": 4.45,
  "recommendations": [...]
}
```

### Price Forecasting
```bash
POST /api/v1/prices/forecast
```

**Request:**
```json
{
  "commodity": "SOJA",
  "forecast_horizon": 30,
  "historical_prices": [150.5, 152.3, ...]
}
```

### Anomaly Detection
```bash
POST /api/v1/anomaly/detect
```

**Request:**
```json
{
  "farm_id": "farm_123",
  "data_type": "YIELD",
  "time_series": [
    {
      "timestamp": "2026-01-01T00:00:00Z",
      "value": 3.5
    }
  ],
  "sensitivity": 0.5
}
```

### Model Training
```bash
POST /api/v1/training/train
GET /api/v1/training/{job_id}
```

## 🧪 Model Details

### LSTM Yield Predictor
- **Layers:** 3 LSTM layers (128, 64, 32 units)
- **Dropout:** 0.2
- **Activation:** ReLU (dense layers)
- **Loss:** MSE
- **Metrics:** MAE, MAPE
- **Sequence Length:** 30 days

### Transformer Price Forecaster
- **Encoder Layers:** 4
- **Attention Heads:** 8
- **Model Dimension:** 128
- **FFN Dimension:** 512
- **Dropout:** 0.1
- **Sequence Length:** 60 days

### Isolation Forest Anomaly Detector
- **Estimators:** 100 trees
- **Contamination:** 0.1 (10% expected anomalies)
- **Max Samples:** Auto
- **Features:** Value, change, volatility, rolling statistics

## 📊 Performance Metrics

### Yield Prediction
- **MAE:** < 0.5 t/ha
- **MAPE:** < 15%
- **R²:** > 0.85

### Price Forecasting
- **MAE:** < 2% of price
- **Directional Accuracy:** > 70%
- **Sharpe Ratio:** > 1.5

### Anomaly Detection
- **Precision:** > 80%
- **Recall:** > 75%
- **F1-Score:** > 0.77

## 🔧 Configuration

Edit `.env` file:

```env
# API
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Models
MODELS_DIR=./models
YIELD_MODEL_PATH=./models/yield_predictor.h5
PRICE_MODEL_PATH=./models/price_forecaster.h5
ANOMALY_MODEL_PATH=./models/anomaly_detector.joblib

# Training
BATCH_SIZE=32
EPOCHS=100
LEARNING_RATE=0.001
```

## 🐳 Docker

```bash
# Build image
docker build -t lavra-ml-service .

# Run container
docker run -p 8000:8000 lavra-ml-service
```

## 📝 Development

### Project Structure
```
ml-service/
├── main.py                 # FastAPI app
├── app/
│   ├── core/
│   │   └── config.py       # Settings
│   ├── models/
│   │   ├── yield_predictor.py
│   │   ├── price_forecaster.py
│   │   ├── anomaly_detector.py
│   │   └── model_loader.py
│   ├── routers/
│   │   ├── yield_router.py
│   │   ├── price_router.py
│   │   ├── anomaly_router.py
│   │   └── training_router.py
│   └── schemas/
│       └── schemas.py      # Pydantic models
├── models/                 # Trained models
├── data/                   # Training data
└── requirements.txt
```

### Adding New Models

1. Create model class in `app/models/`
2. Add router in `app/routers/`
3. Register in `main.py`
4. Update `model_loader.py`

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/
```

## 📚 References

- TensorFlow: https://www.tensorflow.org/
- FastAPI: https://fastapi.tiangolo.com/
- Scikit-learn: https://scikit-learn.org/

## 📄 License

MIT License - see LICENSE file
