#!/bin/bash

# Script para testar todos os serviços

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 Testando Lavra.ai - Todos os Serviços"
echo "=========================================="
echo ""

# Função para verificar se serviço está rodando
check_service() {
    local name=$1
    local url=$2
    
    echo -n "Verificando $name... "
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ OFFLINE${NC}"
        return 1
    fi
}

# Verificar cada serviço
echo "📡 Verificando conectividade dos serviços:"
echo ""

check_service "NestJS API" "http://localhost:3000/health"
check_service "ML Service" "http://localhost:8000/health"
check_service "PgAdmin" "http://localhost:5050"
check_service "Redis Commander" "http://localhost:8081"

echo ""
echo "🧪 Executando testes..."
echo ""

# Teste NestJS API
echo "⚡ Testando NestJS API (GraphQL)..."
echo "-----------------------------------"

GRAPHQL_QUERY='{
  "query": "{ __typename }"
}'

API_RESPONSE=$(curl -s -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d "$GRAPHQL_QUERY")

if echo "$API_RESPONSE" | grep -q "__typename"; then
    echo -e "${GREEN}✅ GraphQL endpoint respondendo${NC}"
else
    echo -e "${RED}❌ GraphQL não está respondendo corretamente${NC}"
fi

echo ""

# Teste ML Service
echo "🤖 Testando ML Service..."
echo "-------------------------"

# Health check
ML_HEALTH=$(curl -s http://localhost:8000/health)
echo "Health: $ML_HEALTH"

# Models info
ML_MODELS=$(curl -s http://localhost:8000/models/info)
echo "Models: $ML_MODELS"

# Teste rápido de yield prediction
echo ""
echo "Testando Yield Prediction..."

YIELD_PAYLOAD='{
  "farm_id": "test_farm",
  "crop_type": "SOJA",
  "area_hectares": 100,
  "planting_date": "2026-10-15",
  "climate_data": [
    {"temperature": 25.5, "precipitation": 12.3, "humidity": 75.0, "solar_radiation": 18.5}
  ],
  "historical_yields": [3.5, 3.8, 3.6]
}'

YIELD_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/yield/predict \
  -H "Content-Type: application/json" \
  -d "$YIELD_PAYLOAD")

if echo "$YIELD_RESPONSE" | grep -q "predicted_yield"; then
    echo -e "${GREEN}✅ Yield Prediction funcionando${NC}"
    echo "$YIELD_RESPONSE" | jq -r '. | "Yield: \(.predicted_yield) t/ha (confidence: \(.confidence))"'
else
    echo -e "${RED}❌ Yield Prediction com problema${NC}"
fi

echo ""

# Go microservices (verificação básica de porta)
echo "🔧 Verificando Go Microservices..."
echo "----------------------------------"

check_grpc_service() {
    local name=$1
    local port=$2
    
    echo -n "Verificando $name (porta $port)... "
    
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Porta ativa${NC}"
    else
        echo -e "${RED}❌ Porta não está em uso${NC}"
    fi
}

check_grpc_service "Market Analysis" 50051
check_grpc_service "Climate Analysis" 50052
check_grpc_service "Decision Engine" 50053
check_grpc_service "Alert Worker" 50054

echo ""

# Bancos de dados
echo "🗄️  Verificando Bancos de Dados..."
echo "-----------------------------------"

echo -n "PostgreSQL... "
if docker exec lavra-postgres pg_isready -U lavra > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Offline${NC}"
fi

echo -n "TimescaleDB... "
if docker exec lavra-timescaledb pg_isready -U lavra > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Offline${NC}"
fi

echo -n "Redis... "
if docker exec lavra-redis redis-cli -a lavra123 ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Offline${NC}"
fi

echo ""
echo "🎉 Testes concluídos!"
echo ""
echo "📚 Para mais detalhes:"
echo "   • GraphQL Playground: ${YELLOW}http://localhost:3000/graphql${NC}"
echo "   • ML API Docs: ${YELLOW}http://localhost:8000/docs${NC}"
echo ""
