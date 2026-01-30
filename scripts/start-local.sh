#!/bin/bash

# Script para iniciar todos os serviços localmente (sem Docker)
# Útil para desenvolvimento

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Iniciando Lavra.ai (Modo Local)"
echo "===================================="
echo ""

# Array para armazenar PIDs dos processos
declare -a PIDS

# Função para cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Parando todos os serviços...${NC}"
    for pid in "${PIDS[@]}"; do
        kill $pid 2>/dev/null || true
    done
    exit 0
}

# Registrar trap para Ctrl+C
trap cleanup SIGINT SIGTERM

# 1. PostgreSQL e Redis (via Docker)
echo "🐳 Iniciando bancos de dados (Docker)..."
docker-compose up -d postgres redis timescaledb
sleep 5
echo -e "${GREEN}✅ Bancos de dados iniciados${NC}"
echo ""

# 2. Go Microservices
echo "🔧 Iniciando Go Microservices..."

cd apps/market-analysis-service
export PORT=50051
export DATABASE_URL="postgres://lavra:lavra123@localhost:5433/lavra_timeseries?sslmode=disable"
./market-analysis-service &
PIDS+=($!)
echo -e "${GREEN}✅ Market Analysis Service (50051)${NC}"
cd ../..

cd apps/climate-analysis-service
export PORT=50052
export DATABASE_URL="postgres://lavra:lavra123@localhost:5433/lavra_timeseries?sslmode=disable"
./climate-analysis-service &
PIDS+=($!)
echo -e "${GREEN}✅ Climate Analysis Service (50052)${NC}"
cd ../..

cd apps/decision-engine-service
export PORT=50053
export DATABASE_URL="postgres://lavra:lavra123@localhost:5432/lavra?sslmode=disable"
./decision-engine-service &
PIDS+=($!)
echo -e "${GREEN}✅ Decision Engine Service (50053)${NC}"
cd ../..

cd apps/alert-worker-service
export PORT=50054
export DATABASE_URL="postgres://lavra:lavra123@localhost:5432/lavra?sslmode=disable"
export REDIS_URL="redis://:lavra123@localhost:6379"
./alert-worker-service &
PIDS+=($!)
echo -e "${GREEN}✅ Alert Worker Service (50054)${NC}"
cd ../..

echo ""
sleep 3

# 3. ML Service (Python)
echo "🐍 Iniciando ML Service..."
cd apps/ml-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
PIDS+=($!)
echo -e "${GREEN}✅ ML Service (8000)${NC}"
cd ../..

echo ""
sleep 3

# 4. NestJS API
echo "⚡ Iniciando NestJS API..."
cd apps/api
npm run start:dev &
PIDS+=($!)
echo -e "${GREEN}✅ NestJS API (3000)${NC}"
cd ../..

echo ""
echo -e "${GREEN}✅ Todos os serviços iniciados!${NC}"
echo ""
echo "📋 Serviços rodando:"
echo ""
echo "   🔹 NestJS API (GraphQL):    ${YELLOW}http://localhost:3000/graphql${NC}"
echo "   🔹 ML Service (Docs):       ${YELLOW}http://localhost:8000/docs${NC}"
echo "   🔹 Market Analysis:         ${YELLOW}localhost:50051${NC}"
echo "   🔹 Climate Analysis:        ${YELLOW}localhost:50052${NC}"
echo "   🔹 Decision Engine:         ${YELLOW}localhost:50053${NC}"
echo "   🔹 Alert Worker:            ${YELLOW}localhost:50054${NC}"
echo ""
echo "   📊 PgAdmin:                 ${YELLOW}http://localhost:5050${NC}"
echo "   📮 Redis Commander:         ${YELLOW}http://localhost:8081${NC}"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para parar todos os serviços${NC}"
echo ""

# Aguardar
wait
