#!/bin/bash

# Script de setup local para Lavra.ai
# Configura todo o ambiente de desenvolvimento

set -e

echo "🚀 Lavra.ai - Setup Local"
echo "=========================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Docker
echo "📦 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado. Instale o Docker primeiro.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não encontrado. Instale o Docker Compose primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker encontrado${NC}"
echo ""

# Criar .env para API se não existir
echo "📝 Configurando variáveis de ambiente..."
if [ ! -f "apps/api/.env" ]; then
    cat > apps/api/.env << EOF
NODE_ENV=development
DATABASE_URL=postgresql://lavra:lavra123@localhost:5432/lavra?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=lavra123
JWT_SECRET=lavra-jwt-secret-key-development
PORT=3000

# gRPC Services
MARKET_ANALYSIS_SERVICE_URL=localhost:50051
CLIMATE_ANALYSIS_SERVICE_URL=localhost:50052
DECISION_ENGINE_SERVICE_URL=localhost:50053
ALERT_WORKER_SERVICE_URL=localhost:50054

# ML Service
ML_SERVICE_URL=http://localhost:8000

# External APIs
B3_API_KEY=your_b3_api_key
INMET_API_KEY=your_inmet_api_key
NASA_API_KEY=your_nasa_api_key
CEPEA_API_KEY=your_cepea_api_key
EOF
    echo -e "${GREEN}✅ Criado apps/api/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/api/.env já existe${NC}"
fi

# Criar .env para ML Service se não existir
if [ ! -f "apps/ml-service/.env" ]; then
    cp apps/ml-service/.env.example apps/ml-service/.env
    echo -e "${GREEN}✅ Criado apps/ml-service/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/ml-service/.env já existe${NC}"
fi

echo ""

# Subir containers
echo "🐳 Subindo containers Docker..."
docker-compose up -d postgres redis timescaledb

echo ""
echo -e "${YELLOW}⏳ Aguardando bancos de dados ficarem prontos...${NC}"
sleep 10

echo ""

# Instalar dependências da API
echo "📦 Instalando dependências da API NestJS..."
cd apps/api
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules já existe${NC}"
fi

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Executar migrations
echo "🗄️  Executando migrations do Prisma..."
npx prisma migrate deploy

cd ../..
echo ""

# Build Go services
echo "🔨 Buildando Go microservices..."

services=("market-analysis-service" "climate-analysis-service" "decision-engine-service" "alert-worker-service")

for service in "${services[@]}"; do
    echo "  📦 Building $service..."
    cd "apps/$service"
    go mod download
    go build -o "$service" .
    cd ../..
    echo -e "${GREEN}  ✅ $service built${NC}"
done

echo ""

# Instalar dependências Python
echo "🐍 Instalando dependências do ML Service..."
cd apps/ml-service
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment criado${NC}"
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

cd ../..
echo ""

echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Para subir todos os serviços:"
echo "   ${YELLOW}docker-compose up -d${NC}"
echo ""
echo "2. Para ver logs:"
echo "   ${YELLOW}docker-compose logs -f${NC}"
echo ""
echo "3. Para rodar a API localmente (sem Docker):"
echo "   ${YELLOW}cd apps/api && npm run start:dev${NC}"
echo ""
echo "4. Para rodar o ML Service localmente (sem Docker):"
echo "   ${YELLOW}cd apps/ml-service && source venv/bin/activate && uvicorn main:app --reload${NC}"
echo ""
echo "5. Acessar:"
echo "   📊 API GraphQL: ${YELLOW}http://localhost:3000/graphql${NC}"
echo "   🤖 ML Service: ${YELLOW}http://localhost:8000/docs${NC}"
echo "   🗄️  PgAdmin: ${YELLOW}http://localhost:5050${NC}"
echo "   📮 Redis Commander: ${YELLOW}http://localhost:8081${NC}"
echo ""
echo "6. Para parar tudo:"
echo "   ${YELLOW}docker-compose down${NC}"
echo ""
