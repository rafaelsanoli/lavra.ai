# 🌱 LAVRA.IA - Inteligência que cultiva lucro

> Plataforma de Inteligência Preditiva para Gestão de Risco Climático e Financeiro Integrado no agronegócio brasileiro

[![Backend Status](https://img.shields.io/badge/backend-95%25-brightgreen)]()
[![ML Models](https://img.shields.io/badge/ML-3%20models-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## 📋 Sobre o Projeto

**Lavra.ai** é uma plataforma SaaS completa que conecta dados climáticos, mercado e operações da fazenda em **decisões financeiras acionáveis**, eliminando a fragmentação que custa milhões aos produtores rurais.

### 💡 Proposta de Valor

> "Transformamos dados climáticos, agronômicos e de mercado em DECISÕES FINANCEIRAS ACIONÁVEIS com valor monetário calculado."

### ✨ Diferenciais

- 🤖 **3 Modelos de IA**: LSTM (yield), Transformer (preços), Isolation Forest (anomalias)
- 🔄 **Arquitetura Moderna**: NestJS + Go microservices + Python ML
- 📊 **Análises em Tempo Real**: Climate, Market, Decision Engine, Alert Worker
- 💰 **ROI Calculado**: Decisões com impacto financeiro mensurado

---

## 🚀 Quick Start

### Requisitos

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 18+ (opcional, para dev local)
- **Go** 1.21+ (opcional, para dev local)
- **Python** 3.11+ (opcional, para dev local)

### Setup Rápido (Docker)

```bash
# 1. Clone o repositório
git clone https://github.com/rafaelsanoli/lavra.ai.git
cd lavra.ai

# 2. Execute o script de setup
./scripts/setup-local.sh

# 3. Suba todos os serviços
docker-compose up -d

# 4. Aguarde inicialização (~2 minutos)
docker-compose logs -f

# 5. Teste os serviços
./scripts/test-all.sh
```

### Acessar Serviços

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **API GraphQL** | http://localhost:3000/graphql | Playground GraphQL |
| **ML Service** | http://localhost:8000/docs | Swagger UI (FastAPI) |
| **PgAdmin** | http://localhost:5050 | Interface PostgreSQL |
| **Redis Commander** | http://localhost:8081 | Interface Redis |

**Credenciais PgAdmin:**
- Email: `admin@lavra.ai`
- Senha: `admin123`

---

## 🏗️ Arquitetura

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 14)                   │
│                  http://localhost:3000                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ GraphQL / REST
┌──────────────────────┴──────────────────────────────────────┐
│           API GATEWAY (NestJS + GraphQL)                     │
│                  port 3000                                   │
│  ┌─────────────┬─────────────┬──────────────┬────────────┐  │
│  │ Auth/Users  │ Fazendas    │ Simulações   │ Bull Queue │  │
│  │ GraphQL API │ Crops       │ WebSockets   │ Redis      │  │
│  └─────────────┴─────────────┴──────────────┴────────────┘  │
└───────┬──────────────┬───────────────┬──────────────┬───────┘
        │ gRPC         │ gRPC          │ gRPC         │ HTTP
┌───────┴────┐ ┌───────┴────┐ ┌────────┴────┐ ┌──────┴────────┐
│  Market    │ │  Climate   │ │  Decision   │ │  ML Service   │
│  Analysis  │ │  Analysis  │ │  Engine     │ │  (FastAPI)    │
│  (Go:50051)│ │ (Go:50052) │ │ (Go:50053)  │ │  (Py:8000)    │
│            │ │            │ │             │ │               │
│ • Trends   │ │ • GDD      │ │ • MCDA      │ │ • LSTM        │
│ • Volatil. │ │ • ET       │ │ • VaR       │ │ • Transform.  │
│ • Forecast │ │ • Water    │ │ • Sharpe    │ │ • IsoForest   │
└────────────┘ └────────────┘ └─────────────┘ └───────────────┘
        │              │              │              │
┌───────┴──────────────┴──────────────┴──────────────┴─────────┐
│                    DATABASES                                  │
│  ┌──────────────┬────────────────┬──────────────────────┐    │
│  │ PostgreSQL   │ TimescaleDB    │ Redis                │    │
│  │ (port 5432)  │ (port 5433)    │ (port 6379)          │    │
│  │ • Users      │ • Climate TS   │ • Cache              │    │
│  │ • Fazendas   │ • Price TS     │ • Bull Queues        │    │
│  │ • Scenarios  │ • Alerts TS    │ • Sessions           │    │
│  └──────────────┴────────────────┴──────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

### Serviços Implementados

#### 1. **NestJS API** (port 3000)
- 10 módulos core (auth, fazendas, crops, etc.)
- GraphQL API com Apollo
- Bull Queues (4 queues)
- Socket.io (3 gateways)
- 4 integrações externas (B3, INMET, NASA, CEPEA)
- **Status:** ✅ 100% completo, 205 testes passando

#### 2. **Market Analysis Service** (Go, port 50051)
- 6 RPCs: Trend analysis, volatility, anomalies, correlations, forecasting, seasonality
- Algoritmos: Linear regression, Pearson correlation, Z-score
- **Status:** ✅ 100% completo

#### 3. **Climate Analysis Service** (Go, port 50052)
- 6 RPCs: Risk calculation, planting conditions, harvest window, water balance, extreme events, crop growth
- Algoritmos: GDD (Growing Degree Days), Hargreaves ET, water balance
- **Status:** ✅ 100% completo

#### 4. **Decision Engine Service** (Go, port 50053)
- 6 RPCs: Decision evaluation, planting optimization, scenario comparison, hedge recommendation, insurance assessment, expected value
- Algoritmos: MCDA, VaR 95%, Sharpe/Sortino ratios, portfolio optimization
- **Status:** ✅ 100% completo

#### 5. **Alert Worker Service** (Go, port 50054)
- 6 RPCs: Alert processing, batch processing, prioritization, notifications, aggregation, scheduling
- Features: Multi-channel (email/sms/push/in-app/webhook), SLA-based
- **Status:** ✅ 100% completo

#### 6. **ML Service** (Python/FastAPI, port 8000)
- 3 modelos de IA:
  * **LSTM**: Previsão de produtividade (yield)
  * **Transformer**: Previsão de preços (1-90 dias)
  * **Isolation Forest**: Detecção de anomalias
- 4 APIs REST completas
- **Status:** ✅ 100% completo

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [CHANGELOG.md](CHANGELOG.md) | Histórico de versões e mudanças |
| [PRODUTO.md](docs/PRODUTO.md) | Visão do produto e funcionalidades |
| [STARTUP.md](docs/STARTUP.md) | Modelo de negócio e Go-to-Market |
| [FRONTEND-COMPLETO.md](docs/FRONTEND-COMPLETO.md) | Documentação do frontend |
| [apps/api/README.md](apps/api/README.md) | Documentação da API NestJS |
| [apps/ml-service/README.md](apps/ml-service/README.md) | Documentação do ML Service |

---

## 💻 Desenvolvimento Local

### Opção 1: Docker (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f [serviço]

# Parar todos
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build
```

### Opção 2: Local (sem Docker)

```bash
# 1. Subir bancos de dados
docker-compose up -d postgres redis timescaledb

# 2. Rodar API NestJS
cd apps/api
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev

# 3. Rodar ML Service
cd apps/ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# 4. Build e rodar Go microservices
cd apps/market-analysis-service
go build -o market-analysis .
./market-analysis

# Repetir para outros serviços Go
```

### Scripts Disponíveis

```bash
# Setup inicial completo
./scripts/setup-local.sh

# Iniciar todos serviços localmente (sem Docker)
./scripts/start-local.sh

# Testar todos os serviços
./scripts/test-all.sh

# Testar apenas ML Service
./scripts/test-ml-service.sh
```

---

## 🧪 Testes

### API NestJS
```bash
cd apps/api

# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

### ML Service
```bash
cd apps/ml-service

# Testes com pytest
pytest tests/ -v

# Coverage
pytest tests/ --cov=app
```

### Go Microservices
```bash
cd apps/[service-name]

# Testes
go test ./... -v

# Coverage
go test ./... -cover
```

---

## 🌍 Variáveis de Ambiente

### API (.env)

| Marco | Data | Descrição |
|-------|------|-----------|
| ✅ Frontend Demo | Jan 2026 | Completo |
| ✅ Planejamento | Jan 2026 | Completo |
| 🎯 MVP | Mai 2026 | 5 beta users |
| 🚀 V1.0 | Jul 2026 | 25 clientes |
| 📈 Scale | Jan 2027 | 100+ clientes |

---

## 📞 Contato

**Produto:** produto@lavra.ai  
**Técnico:** tech@lavra.ai  
**Comercial:** comercial@lavra.ai

---

**🌱 Inteligência que cultiva lucro**

Copyright © 2026 Lavra.ia. Todos os direitos reservados.
---

## 🌍 Variáveis de Ambiente

### API (.env)
```env
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

# External APIs (obter suas próprias keys)
B3_API_KEY=your_key_here
INMET_API_KEY=your_key_here
NASA_API_KEY=your_key_here
CEPEA_API_KEY=your_key_here
```

### ML Service (.env)
```env
HOST=0.0.0.0
PORT=8000
DEBUG=true
DATABASE_URL=postgresql://lavra:lavra123@localhost:5432/lavra
REDIS_URL=redis://:lavra123@localhost:6379/0
MODELS_DIR=./models
```

---

## 📊 Status do Projeto

### Backend: 95% Completo

| Componente | Status | Progresso |
|-----------|--------|-----------|
| NestJS API | ✅ Completo | 100% |
| Go Microservices (4) | ✅ Completo | 100% |
| ML Service | ✅ Completo | 100% |
| Docker/Infra | ✅ Completo | 100% |
| Testes E2E | ⏳ Em andamento | 60% |
| Docs de Deploy | ⏳ Planejado | 0% |

### Métricas

- **Total de Arquivos:** ~150 arquivos
- **Linhas de Código:** ~25,000 linhas
- **Commits:** 17 (v0.1.0 → v0.17.0)
- **Testes:** 205 testes passando (NestJS)
- **Cobertura:** ~80% (API), ~85% (Go services)

### Próximos Passos

1. ✅ ~~Completar ML Service routers~~ (v0.17.0)
2. ⏳ Implementar testes E2E completos
3. ⏳ Criar pipelines de training para modelos ML
4. ⏳ Documentação de deployment (AWS/GCP)
5. ⏳ CI/CD com GitHub Actions

---

## 🤝 Contribuindo

```bash
# 1. Fork o projeto
# 2. Crie sua feature branch
git checkout -b feature/MinhaFeature

# 3. Commit suas mudanças
git commit -m 'feat: adicionar alguma feature'

# 4. Push para a branch
git push origin feature/MinhaFeature

# 5. Abra um Pull Request
```

### Convenções

- **Commits:** Semantic commits (feat, fix, docs, refactor, test, chore)
- **Branches:** development (trabalho) → main (produção)
- **Código:** TypeScript/Go/Python com linters configurados
- **Testes:** Obrigatório para novas features

---

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Rafael Sanoli**
- GitHub: [@rafaelsanoli](https://github.com/rafaelsanoli)
- LinkedIn: [Rafael Sanoli](https://linkedin.com/in/rafaelsanoli)

---

## 🌟 Agradecimentos

- Comunidade Next.js, NestJS, Go e Python
- APIs públicas: B3, INMET, NASA POWER, CEPEA
- Produtores rurais que inspiraram este projeto

---

**Made with ❤️ for Brazilian Agriculture**
