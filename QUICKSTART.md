# 🚀 Lavra.ai - Guia Rápido de Inicialização

Este guia mostra como rodar o backend completo do Lavra.ai localmente em menos de 5 minutos.

---

## ⚡ Setup Rápido (Recomendado)

### 1. Pré-requisitos

Certifique-se de ter instalado:

- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+

Opcional (apenas para desenvolvimento sem Docker):
- Node.js 18+
- Go 1.21+
- Python 3.11+

### 2. Clone o Repositório

```bash
git clone https://github.com/rafaelsanoli/lavra.ai.git
cd lavra.ai
```

### 3. Execute o Setup

```bash
./scripts/setup-local.sh
```

Este script irá:
- ✅ Verificar Docker/Docker Compose
- ✅ Criar arquivos `.env`
- ✅ Subir bancos de dados (PostgreSQL, Redis, TimescaleDB)
- ✅ Instalar dependências (npm, go, pip)
- ✅ Executar migrations do Prisma
- ✅ Build dos Go microservices
- ✅ Criar ambiente virtual Python

**Tempo estimado:** 3-5 minutos

### 4. Inicie os Serviços

**Opção A: Com Docker (Recomendado)**

```bash
docker-compose up -d
```

Aguarde ~2 minutos para todos os serviços iniciarem.

**Opção B: Sem Docker (Desenvolvimento)**

```bash
./scripts/start-local.sh
```

Este script inicia todos os serviços em background localmente.

### 5. Verifique o Status

```bash
docker-compose ps
```

Todos os serviços devem estar com status `Up` e `healthy`.

---

## 🧪 Testando

### Teste Rápido

```bash
./scripts/test-all.sh
```

Este script verifica:
- ✅ Conectividade de todos os serviços
- ✅ Health checks (API, ML Service)
- ✅ Bancos de dados (PostgreSQL, Redis)
- ✅ GraphQL endpoint
- ✅ ML endpoints

### Teste Específico do ML Service

```bash
./scripts/test-ml-service.sh
```

Executa 3 testes completos:
1. **Yield Prediction** - Previsão de produtividade
2. **Price Forecast** - Previsão de preços (30 dias)
3. **Anomaly Detection** - Detecção de anomalias

---

## 🌐 Acessando os Serviços

Após iniciar, você pode acessar:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **API GraphQL** | http://localhost:3000/graphql | Playground GraphQL interativo |
| **ML Service Docs** | http://localhost:8000/docs | Swagger UI (testar endpoints) |
| **PgAdmin** | http://localhost:5050 | Interface PostgreSQL |
| **Redis Commander** | http://localhost:8081 | Interface Redis |

### Credenciais PgAdmin

- **Email:** `admin@lavra.ai`
- **Senha:** `admin123`

---

## 📋 Serviços Disponíveis

### Backend (6 serviços)

1. **NestJS API** (port 3000)
   - GraphQL API
   - REST endpoints
   - WebSockets
   - Bull Queues

2. **Market Analysis Service** (port 50051)
   - Análise de tendências
   - Cálculo de volatilidade
   - Detecção de anomalias de preço
   - Correlações de mercado

3. **Climate Analysis Service** (port 50052)
   - Cálculo de risco climático
   - Condições de plantio
   - Janela de colheita
   - Balanço hídrico

4. **Decision Engine Service** (port 50053)
   - Avaliação de decisões
   - Otimização de estratégias
   - Comparação de cenários
   - Recomendação de hedge

5. **Alert Worker Service** (port 50054)
   - Processamento de alertas
   - Priorização
   - Notificações multi-canal
   - Agregação

6. **ML Service** (port 8000)
   - Previsão de produtividade (LSTM)
   - Previsão de preços (Transformer)
   - Detecção de anomalias (Isolation Forest)

### Bancos de Dados (3 serviços)

1. **PostgreSQL** (port 5432) - Dados principais
2. **TimescaleDB** (port 5433) - Séries temporais
3. **Redis** (port 6379) - Cache e filas

---

## 🔧 Comandos Úteis

### Docker

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f ml-service

# Parar todos os serviços
docker-compose down

# Rebuild e reiniciar
docker-compose up -d --build

# Remover volumes (reset completo)
docker-compose down -v
```

### Desenvolvimento

```bash
# API NestJS
cd apps/api
npm run start:dev

# ML Service
cd apps/ml-service
source venv/bin/activate
uvicorn main:app --reload

# Go Microservice (exemplo)
cd apps/market-analysis-service
go run .
```

---

## 🎯 Testando Funcionalidades

### 1. GraphQL API

Acesse http://localhost:3000/graphql e execute:

```graphql
query {
  __typename
}
```

### 2. ML Service - Yield Prediction

```bash
curl -X POST http://localhost:8000/api/v1/yield/predict \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": "farm_001",
    "crop_type": "SOJA",
    "area_hectares": 100,
    "planting_date": "2026-10-15",
    "climate_data": [
      {"temperature": 25.5, "precipitation": 12.3, "humidity": 75.0, "solar_radiation": 18.5}
    ],
    "historical_yields": [3.5, 3.8, 3.6]
  }'
```

### 3. ML Service - Price Forecast

```bash
curl -X POST http://localhost:8000/api/v1/prices/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "commodity": "SOJA",
    "forecast_horizon": 30,
    "historical_prices": [150.5, 152.3, 151.8, 153.2, 154.1]
  }'
```

### 4. ML Service - Anomaly Detection

```bash
curl -X POST http://localhost:8000/api/v1/anomaly/detect \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": "farm_001",
    "data_type": "YIELD",
    "time_series": [
      {"timestamp": "2026-01-01T00:00:00Z", "value": 3.5},
      {"timestamp": "2026-01-02T00:00:00Z", "value": 3.6}
    ],
    "sensitivity": 0.5
  }'
```

---

## 📊 Monitoramento

### Verificar Health

```bash
# API
curl http://localhost:3000/health

# ML Service
curl http://localhost:8000/health

# Models Info
curl http://localhost:8000/models/info
```

### Logs em Tempo Real

```bash
# Todos os serviços
docker-compose logs -f

# Apenas API
docker-compose logs -f api

# Apenas ML Service
docker-compose logs -f ml-service
```

---

## 🐛 Troubleshooting

### Problema: Portas em uso

```bash
# Verificar portas ocupadas
lsof -i :3000
lsof -i :8000

# Matar processo
kill -9 <PID>
```

### Problema: Serviço não inicia

```bash
# Ver logs detalhados
docker-compose logs [serviço]

# Restart específico
docker-compose restart [serviço]

# Rebuild
docker-compose up -d --build [serviço]
```

### Problema: Banco de dados

```bash
# Reset completo (CUIDADO: apaga dados)
docker-compose down -v
docker-compose up -d
```

### Problema: Dependências Python

```bash
cd apps/ml-service
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 📚 Próximos Passos

1. **Explorar API GraphQL:** http://localhost:3000/graphql
2. **Testar ML endpoints:** http://localhost:8000/docs
3. **Ler documentação completa:** [README.md](README.md)
4. **Ver changelog:** [CHANGELOG.md](CHANGELOG.md)
5. **Consultar arquitetura:** Diagramas no README

---

## 💡 Dicas

- Use `docker-compose logs -f` para debug em tempo real
- Acesse PgAdmin para visualizar dados no banco
- Use Redis Commander para inspecionar cache/queues
- ML Service tem Swagger UI interativo
- GraphQL Playground tem autocomplete

---

## 🆘 Suporte

- **Issues:** https://github.com/rafaelsanoli/lavra.ai/issues
- **Documentação:** [README.md](README.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

**Made with ❤️ for Brazilian Agriculture**
