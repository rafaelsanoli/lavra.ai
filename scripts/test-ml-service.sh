#!/bin/bash

# Script para testar o ML Service localmente

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ML_URL="http://localhost:8000"

echo "🤖 Testando ML Service"
echo "======================"
echo ""

# Verificar se o serviço está rodando
echo "📡 Verificando se o ML Service está rodando..."
if ! curl -s "$ML_URL/health" > /dev/null; then
    echo -e "${RED}❌ ML Service não está rodando em $ML_URL${NC}"
    echo "Inicie com: docker-compose up ml-service"
    echo "Ou localmente: cd apps/ml-service && uvicorn main:app --reload"
    exit 1
fi

echo -e "${GREEN}✅ ML Service está online${NC}"
echo ""

# Health check
echo "🏥 Health Check:"
curl -s "$ML_URL/health" | jq .
echo ""

# Models info
echo "📊 Models Info:"
curl -s "$ML_URL/models/info" | jq .
echo ""

# Teste 1: Yield Prediction
echo "🌾 Teste 1: Previsão de Produtividade (Yield)"
echo "----------------------------------------------"

YIELD_PAYLOAD='{
  "farm_id": "farm_test_001",
  "crop_type": "SOJA",
  "area_hectares": 100.0,
  "planting_date": "2026-10-15",
  "climate_data": [
    {"temperature": 25.5, "precipitation": 12.3, "humidity": 75.0, "solar_radiation": 18.5},
    {"temperature": 26.2, "precipitation": 8.7, "humidity": 72.0, "solar_radiation": 19.2},
    {"temperature": 24.8, "precipitation": 15.1, "humidity": 78.0, "solar_radiation": 17.8},
    {"temperature": 25.9, "precipitation": 10.2, "humidity": 74.0, "solar_radiation": 18.9},
    {"temperature": 26.5, "precipitation": 6.5, "humidity": 70.0, "solar_radiation": 19.8},
    {"temperature": 25.1, "precipitation": 11.8, "humidity": 76.0, "solar_radiation": 18.2},
    {"temperature": 24.5, "precipitation": 14.2, "humidity": 79.0, "solar_radiation": 17.5}
  ],
  "historical_yields": [3.2, 3.5, 3.8, 3.6]
}'

YIELD_RESPONSE=$(curl -s -X POST "$ML_URL/api/v1/yield/predict" \
  -H "Content-Type: application/json" \
  -d "$YIELD_PAYLOAD")

echo "$YIELD_RESPONSE" | jq .

PREDICTED_YIELD=$(echo "$YIELD_RESPONSE" | jq -r '.predicted_yield')
CONFIDENCE=$(echo "$YIELD_RESPONSE" | jq -r '.confidence')

echo ""
echo -e "${GREEN}✅ Yield previsto: ${PREDICTED_YIELD} t/ha (confidence: ${CONFIDENCE})${NC}"
echo ""

# Teste 2: Price Forecast
echo "💰 Teste 2: Previsão de Preços"
echo "-------------------------------"

PRICE_PAYLOAD='{
  "commodity": "SOJA",
  "forecast_horizon": 30,
  "historical_prices": [
    150.5, 152.3, 151.8, 153.2, 154.1, 152.9, 155.3,
    156.2, 154.8, 157.1, 158.5, 157.3, 159.2, 160.1,
    158.9, 161.5, 162.3, 160.8, 163.4, 164.2, 162.7,
    165.1, 166.5, 164.9, 167.3, 168.1, 166.8, 169.2,
    170.5, 168.9, 171.3, 172.8, 171.2, 173.5, 174.9,
    173.3, 175.8, 176.5, 175.1, 177.6, 178.9, 177.2,
    179.5, 180.3, 178.8, 181.2, 182.5, 181.0, 183.4,
    184.7, 183.1, 185.5, 186.8, 185.2, 187.6, 188.9,
    187.3, 189.7, 190.5, 189.0, 191.4
  ]
}'

PRICE_RESPONSE=$(curl -s -X POST "$ML_URL/api/v1/prices/forecast" \
  -H "Content-Type: application/json" \
  -d "$PRICE_PAYLOAD")

echo "$PRICE_RESPONSE" | jq .

TREND=$(echo "$PRICE_RESPONSE" | jq -r '.trend')
VOLATILITY=$(echo "$PRICE_RESPONSE" | jq -r '.volatility')

echo ""
echo -e "${GREEN}✅ Tendência: ${TREND}, Volatilidade: ${VOLATILITY}${NC}"
echo ""

# Teste 3: Anomaly Detection
echo "🔍 Teste 3: Detecção de Anomalias"
echo "----------------------------------"

ANOMALY_PAYLOAD='{
  "farm_id": "farm_test_001",
  "data_type": "YIELD",
  "time_series": [
    {"timestamp": "2026-01-01T00:00:00Z", "value": 3.5},
    {"timestamp": "2026-01-02T00:00:00Z", "value": 3.6},
    {"timestamp": "2026-01-03T00:00:00Z", "value": 3.4},
    {"timestamp": "2026-01-04T00:00:00Z", "value": 3.7},
    {"timestamp": "2026-01-05T00:00:00Z", "value": 3.5},
    {"timestamp": "2026-01-06T00:00:00Z", "value": 3.6},
    {"timestamp": "2026-01-07T00:00:00Z", "value": 1.2},
    {"timestamp": "2026-01-08T00:00:00Z", "value": 3.5},
    {"timestamp": "2026-01-09T00:00:00Z", "value": 3.7},
    {"timestamp": "2026-01-10T00:00:00Z", "value": 3.4},
    {"timestamp": "2026-01-11T00:00:00Z", "value": 3.6},
    {"timestamp": "2026-01-12T00:00:00Z", "value": 5.8}
  ],
  "sensitivity": 0.5
}'

ANOMALY_RESPONSE=$(curl -s -X POST "$ML_URL/api/v1/anomaly/detect" \
  -H "Content-Type: application/json" \
  -d "$ANOMALY_PAYLOAD")

echo "$ANOMALY_RESPONSE" | jq .

ANOMALIES_COUNT=$(echo "$ANOMALY_RESPONSE" | jq -r '.anomalies_detected')
HEALTH_SCORE=$(echo "$ANOMALY_RESPONSE" | jq -r '.overall_health_score')

echo ""
echo -e "${GREEN}✅ Anomalias detectadas: ${ANOMALIES_COUNT}, Health Score: ${HEALTH_SCORE}${NC}"
echo ""

echo "🎉 Todos os testes concluídos!"
echo ""
echo "📚 Documentação completa: http://localhost:8000/docs"
