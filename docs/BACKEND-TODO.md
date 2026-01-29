# 📋 BACKEND TODO - Checklist Completo de Desenvolvimento

> Documento de planejamento para completar o backend do Lavra.IA
> **Criado em:** 29 de Janeiro de 2026
> **Status:** Em Desenvolvimento Local

---

## 📊 Status Geral

```
┌─────────────────────────────────────────────────────────────────┐
│ PROGRESSO GERAL DO BACKEND: 35%                                 │
├─────────────────────────────────────────────────────────────────┤
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░                        │
└─────────────────────────────────────────────────────────────────┘

NestJS API:        60% ████████████░░░░░░░░
Microserviços Go:   0% ░░░░░░░░░░░░░░░░░░░░
Machine Learning:   0% ░░░░░░░░░░░░░░░░░░░░
Infraestrutura:    20% ████░░░░░░░░░░░░░░░░
Testes:            25% █████░░░░░░░░░░░░░░░
```

---

## 🎯 FASE 1: NestJS API (60% completo)

### ✅ Módulos Implementados (6/10)

- [x] **Auth** - Autenticação JWT + Refresh Token
- [x] **Users** - CRUD de usuários
- [x] **Farms** - CRUD de fazendas
- [x] **Plots** - CRUD de talhões (18 testes)
- [x] **Plantings** - CRUD de plantios (21 testes)
- [x] **Harvests** - CRUD de colheitas (17 testes)
- [x] **ClimateData** - Dados climáticos + OpenWeather (17 testes)
- [x] **Alerts** - Sistema de alertas (20 testes)
- [x] **MarketPrices** - Preços de mercado + Tendências (22 testes)

**Total de testes:** 115 unitários passando

---

### 🔄 Módulo em Progresso

#### [ ] **Transactions** (Prioridade: ALTA)

**Localização:** `apps/api/src/modules/transactions/`

**Arquivos a criar:**
- [x] `transactions.service.ts` - Service com CRUD + analytics
- [x] `transactions.resolver.ts` - Resolver GraphQL
- [x] `dto/create-transaction.input.ts` - DTO de criação
- [x] `dto/update-transaction.input.ts` - DTO de atualização
- [x] `entities/transaction.entity.ts` - Entity + TransactionSummary
- [x] `transactions.module.ts` - Module configurado
- [ ] `transactions.service.spec.ts` - Testes unitários

**Funcionalidades:**
- [x] CRUD de transações (create, findAll, findOne, update, remove)
- [x] Filtros: tipo, commodity, período
- [x] getSummary() - Resumo por tipo e commodity
- [x] getBalance() - Saldo de estoque (compras - vendas)
- [x] getProfitLoss() - Cálculo de P&L

**Tipos de Transação:**
- SALE - Venda de commodity
- PURCHASE - Compra de commodity
- HEDGE - Operação de hedge
- OPTION - Opção (call/put)

**Testes necessários (estimativa: 20):**
- [ ] should be defined
- [ ] create: deve criar transação com sucesso
- [ ] create: deve calcular totalValue automaticamente
- [ ] findAll: deve listar transações do usuário
- [ ] findAll: deve filtrar por tipo
- [ ] findAll: deve filtrar por commodity
- [ ] findAll: deve filtrar por período
- [ ] findOne: deve retornar transação específica
- [ ] findOne: deve falhar se não existir
- [ ] update: deve atualizar transação
- [ ] update: deve recalcular totalValue
- [ ] remove: deve remover transação
- [ ] getSummary: deve agrupar por tipo e commodity
- [ ] getSummary: deve calcular avgPrice corretamente
- [ ] getBalance: deve calcular saldo de estoque
- [ ] getBalance: deve separar compras e vendas
- [ ] getProfitLoss: deve calcular receita e custo
- [ ] getProfitLoss: deve calcular margem corretamente
- [ ] getProfitLoss: deve filtrar por período
- [ ] validação: deve rejeitar valores negativos

**Commit após completar:**
```bash
git commit -m "feat(backend): implementar módulo Transactions completo

- TransactionsService com CRUD + analytics (balance, P&L, summary)
- Suporte para 4 tipos: SALE, PURCHASE, HEDGE, OPTION
- Cálculos automáticos de totalValue, avgPrice, margin
- Filtros por tipo, commodity e período
- 20 testes unitários (100% cobertura)
- GraphQL resolver com 6 queries/mutations

Features:
- getSummary(): agregação por tipo e commodity
- getBalance(): saldo de estoque (compras - vendas)
- getProfitLoss(): receita, custo e margem de lucro

Testes: ✅ 20/20 passando
Total acumulado: 135 testes"
```

---

### 🆕 Módulos a Implementar (4/10)

---

#### [ ] **Simulations** (Prioridade: ALTA)

**Objetivo:** Motor de simulação de cenários de plantio e hedge

**Localização:** `apps/api/src/modules/simulations/`

**Arquivos a criar:**
- [ ] `simulations.service.ts`
- [ ] `simulations.resolver.ts`
- [ ] `dto/create-simulation.input.ts`
- [ ] `dto/simulation-scenario.input.ts`
- [ ] `entities/simulation.entity.ts`
- [ ] `entities/simulation-result.entity.ts`
- [ ] `simulations.module.ts`
- [ ] `simulations.service.spec.ts` (20+ testes)

**Funcionalidades:**
- [ ] createSimulation() - Criar simulação com múltiplos cenários
- [ ] runSimulation() - Executar cálculos de cenário
- [ ] findAll() - Listar simulações do usuário
- [ ] findOne() - Buscar simulação específica
- [ ] calculateBreakeven() - Ponto de equilíbrio
- [ ] calculateROI() - Retorno sobre investimento
- [ ] optimizeHedge() - Sugerir % ideal de hedge
- [ ] compareScenarios() - Comparar múltiplos cenários

**Cenários a simular:**
- Variação de preço (±10%, ±20%, ±30%)
- Variação de produtividade (±15%)
- Diferentes estratégias de hedge (0%, 25%, 50%, 75%, 100%)
- Impacto de custos (fertilizantes, defensivos)

**Schema Prisma:**
```prisma
model Simulation {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  
  // Inputs da simulação
  cropType    String
  area        Float    // hectares
  expectedYield Float  // kg/ha
  costs       Json     // custos detalhados
  
  // Cenários testados
  scenarios   Json     // array de cenários
  results     Json     // resultados de cada cenário
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("simulations")
}
```

**Exemplo de resultado:**
```json
{
  "scenarios": [
    {
      "name": "Otimista",
      "price": 150,
      "yield": 3500,
      "hedgePercent": 50,
      "revenue": 525000,
      "costs": 200000,
      "profit": 325000,
      "roi": 162.5
    },
    {
      "name": "Pessimista",
      "price": 100,
      "yield": 2800,
      "hedgePercent": 75,
      "revenue": 280000,
      "costs": 200000,
      "profit": 80000,
      "roi": 40
    }
  ],
  "recommendation": {
    "bestScenario": "Otimista",
    "suggestedHedge": 60,
    "breakeven": 57.14
  }
}
```

---

#### [ ] **Integrations** (Prioridade: MÉDIA)

**Objetivo:** Integrar APIs externas de dados

**Localização:** `apps/api/src/modules/integrations/`

**Sub-módulos a criar:**

**1. B3 Integration (Bolsa de Valores)**
- [ ] `b3/b3.service.ts`
- [ ] `b3/b3.controller.ts`
- [ ] Buscar cotações em tempo real
- [ ] Buscar histórico de preços
- [ ] Executar ordens (futuros)
- [ ] Webhook para atualizações

**2. INMET Integration (Instituto Nacional de Meteorologia)**
- [ ] `inmet/inmet.service.ts`
- [ ] `inmet/inmet.controller.ts`
- [ ] Buscar dados de estações próximas
- [ ] Histórico climático (últimos 30 dias)
- [ ] Previsões (próximos 7 dias)
- [ ] Alertas meteorológicos

**3. NASA POWER Integration**
- [ ] `nasa/nasa.service.ts`
- [ ] `nasa/nasa.controller.ts`
- [ ] Radiação solar
- [ ] Evapotranspiração
- [ ] Índices agroclimáticos

**4. CEPEA Integration (Preços Agrícolas)**
- [ ] `cepea/cepea.service.ts`
- [ ] `cepea/cepea.controller.ts`
- [ ] Web scraping de preços diários
- [ ] Histórico de indicadores

**Dependências a instalar:**
```bash
npm install axios cheerio
npm install @types/cheerio -D
```

**Configurações .env:**
```env
# B3 API
B3_API_KEY=
B3_API_URL=https://api.b3.com.br

# OpenWeather (já configurado)
OPENWEATHER_API_KEY=

# NASA POWER
NASA_POWER_API_URL=https://power.larc.nasa.gov/api

# INMET
INMET_API_URL=https://apitempo.inmet.gov.br
```

---

#### [ ] **WebSockets** (Prioridade: ALTA)

**Objetivo:** Comunicação real-time para alertas e cotações

**Localização:** `apps/api/src/websockets/`

**Arquivos a criar:**
- [ ] `events/events.gateway.ts` - Gateway principal
- [ ] `events/events.module.ts`
- [ ] `alerts/alerts.gateway.ts` - Gateway de alertas
- [ ] `prices/prices.gateway.ts` - Gateway de cotações

**Instalação:**
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
npm install socket.io
```

**Events Gateway:**
```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Emitir alerta para usuário específico
  sendAlert(userId: string, alert: any) {
    this.server.to(`user-${userId}`).emit('alert', alert);
  }

  // Emitir atualização de preço
  broadcastPriceUpdate(commodity: string, price: any) {
    this.server.emit(`price:${commodity}`, price);
  }
}
```

**Eventos a implementar:**
- [ ] `alert:new` - Novo alerta criado
- [ ] `alert:read` - Alerta marcado como lido
- [ ] `price:update` - Atualização de preço
- [ ] `weather:alert` - Alerta meteorológico
- [ ] `simulation:complete` - Simulação finalizada

---

#### [ ] **Jobs & Queues** (Prioridade: ALTA)

**Objetivo:** Processamento assíncrono de tarefas pesadas

**Localização:** `apps/api/src/jobs/`

**Instalação:**
```bash
npm install @nestjs/bull bull
npm install @types/bull -D
```

**Filas a criar:**

**1. Weather Queue**
- [ ] `weather/weather.processor.ts`
- [ ] Job: `fetch-weather-data` - Buscar dados climáticos a cada 1h
- [ ] Job: `process-weather-alerts` - Processar alertas meteorológicos
- [ ] Job: `update-forecasts` - Atualizar previsões

**2. Market Queue**
- [ ] `market/market.processor.ts`
- [ ] Job: `fetch-market-prices` - Buscar cotações a cada 5min (horário de mercado)
- [ ] Job: `calculate-trends` - Calcular tendências de preços
- [ ] Job: `check-price-alerts` - Verificar alertas de preço

**3. Simulation Queue**
- [ ] `simulation/simulation.processor.ts`
- [ ] Job: `run-simulation` - Executar simulação (pode demorar)
- [ ] Job: `optimize-portfolio` - Otimizar portfólio (ML)

**4. Notifications Queue**
- [ ] `notifications/notifications.processor.ts`
- [ ] Job: `send-email` - Enviar email
- [ ] Job: `send-sms` - Enviar SMS (futuro)
- [ ] Job: `send-push` - Enviar push notification (futuro)

**Exemplo de configuração:**
```typescript
// app.module.ts
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue(
      { name: 'weather' },
      { name: 'market' },
      { name: 'simulation' },
      { name: 'notifications' },
    ),
  ],
})
export class AppModule {}
```

**Cron jobs a criar:**
```typescript
import { Cron, CronExpression } from '@nestjs/schedule';

// A cada hora - buscar dados climáticos
@Cron(CronExpression.EVERY_HOUR)
async fetchWeatherData() {
  await this.weatherQueue.add('fetch-weather-data');
}

// A cada 5 minutos (horário de mercado)
@Cron('*/5 9-18 * * 1-5') // 9h-18h, seg-sex
async fetchMarketPrices() {
  await this.marketQueue.add('fetch-market-prices');
}

// Diariamente às 6h - gerar relatórios
@Cron('0 6 * * *')
async generateDailyReports() {
  await this.reportsQueue.add('generate-daily');
}
```

---

## 🎯 FASE 2: Microserviços Go (0% completo)

### Estrutura de diretórios:

```
services/
├── market-service/       # Serviço de mercado (B3)
├── climate-service/      # Serviço climático
├── decision-engine/      # Motor de decisão
└── alert-worker/         # Worker de alertas
```

---

### [ ] **Market Service (Go)**

**Objetivo:** Alta performance para cotações em tempo real

**Localização:** `services/market-service/`

**Estrutura:**
```
market-service/
├── cmd/
│   └── main.go                    # Entry point
├── internal/
│   ├── handlers/                  # HTTP handlers
│   │   ├── quotes.go
│   │   └── orders.go
│   ├── services/
│   │   ├── b3_client.go          # Cliente B3 API
│   │   └── market_service.go
│   ├── models/
│   │   ├── quote.go
│   │   └── order.go
│   └── repository/
│       └── postgres.go
├── pkg/
│   └── utils/
├── go.mod
├── go.sum
├── Dockerfile
└── README.md
```

**Funcionalidades:**
- [ ] Conectar API da B3
- [ ] Stream de cotações em tempo real
- [ ] Cache de cotações no Redis (TTL: 5min)
- [ ] Histórico de preços (TimescaleDB)
- [ ] Executar ordens de compra/venda
- [ ] Webhook para atualizar NestJS

**Tecnologias:**
- Gin (HTTP framework)
- GORM (ORM)
- go-redis
- WebSocket client

**API Endpoints:**
```
GET  /api/v1/quotes/:commodity           # Cotação atual
GET  /api/v1/quotes/:commodity/history   # Histórico
POST /api/v1/orders                      # Executar ordem
GET  /api/v1/orders/:id                  # Status da ordem
```

**Performance esperada:**
- Latência: < 50ms
- Throughput: > 10k req/s
- Concurrent connections: > 1000

---

### [ ] **Climate Service (Go)**

**Objetivo:** Ingestão massiva de dados climáticos

**Localização:** `services/climate-service/`

**Estrutura similar ao Market Service**

**Funcionalidades:**
- [ ] Polling INMET a cada 1h
- [ ] Polling NASA POWER diário
- [ ] Armazenar séries temporais (TimescaleDB)
- [ ] Calcular índices agroclimáticos
- [ ] Detectar anomalias (temperaturas extremas, falta de chuva)
- [ ] Gerar alertas meteorológicos

**Data Points:**
- Temperatura (°C)
- Umidade (%)
- Precipitação (mm)
- Radiação solar (W/m²)
- Vento (km/h)
- Evapotranspiração (mm)

---

### [ ] **Decision Engine (Go + Python)**

**Objetivo:** Motor de decisão para simulações complexas

**Localização:** `services/decision-engine/`

**Funcionalidades:**
- [ ] Receber cenários de simulação
- [ ] Executar cálculos paralelos
- [ ] Otimização de portfólio (programação linear)
- [ ] Análise de risco (Monte Carlo)
- [ ] Recomendação de hedge
- [ ] Integrar com ML service para previsões

**Algoritmos:**
- Programação linear (simplex)
- Monte Carlo simulation (10k iterações)
- Value at Risk (VaR)
- Sharpe ratio

---

### [ ] **Alert Worker (Go)**

**Objetivo:** Processamento de alertas em background

**Localização:** `services/alert-worker/`

**Funcionalidades:**
- [ ] Consumir Kafka topics
- [ ] Processar regras de alertas
- [ ] Enviar notificações via WebSocket
- [ ] Enviar emails (via SendGrid)
- [ ] Rate limiting por usuário

**Topics Kafka:**
- `weather.updates`
- `market.prices`
- `alerts.triggers`

---

## 🎯 FASE 3: Machine Learning (0% completo)

**Localização:** `ml/`

### Estrutura:

```
ml/
├── api/                              # FastAPI
│   ├── main.py
│   ├── routers/
│   │   ├── predictions.py
│   │   └── training.py
│   ├── models/
│   │   └── schemas.py
│   └── services/
│       ├── yield_predictor.py
│       └── price_forecaster.py
├── models/                           # Modelos salvos
│   ├── yield_lstm.h5
│   ├── price_transformer.pt
│   └── anomaly_detector.pkl
├── training/                         # Scripts de treino
│   ├── train_yield_model.py
│   ├── train_price_model.py
│   └── train_anomaly_detector.py
├── data/                             # Processamento de dados
│   ├── collectors/
│   │   ├── collect_weather.py
│   │   └── collect_prices.py
│   ├── processors/
│   │   └── features_engineering.py
│   └── datasets/
│       └── historical_yields.csv
├── notebooks/                        # Jupyter notebooks
│   ├── EDA_yields.ipynb
│   ├── EDA_prices.ipynb
│   └── Model_Evaluation.ipynb
├── requirements.txt
├── Dockerfile
└── README.md
```

---

### [ ] **1. Yield Prediction (LSTM)**

**Objetivo:** Prever produtividade da safra

**Features:**
- Dados climáticos históricos (90 dias)
- Tipo de solo
- Cultura
- Histórico de produtividade
- Índices de vegetação (NDVI)

**Modelo:** LSTM com 3 camadas

**Output:** Produtividade estimada (kg/ha) + intervalo de confiança

**Arquivos:**
- [ ] `ml/training/train_yield_model.py`
- [ ] `ml/api/services/yield_predictor.py`
- [ ] `ml/models/yield_lstm.h5`

---

### [ ] **2. Price Forecasting (Transformer)**

**Objetivo:** Prever preços de commodities (7-30 dias)

**Features:**
- Histórico de preços (365 dias)
- Indicadores técnicos (MA, RSI, MACD)
- Dados de safra (USDA, CONAB)
- Sentimento de mercado (notícias)

**Modelo:** Transformer (PyTorch)

**Output:** Série temporal de preços + tendência

**Arquivos:**
- [ ] `ml/training/train_price_model.py`
- [ ] `ml/api/services/price_forecaster.py`
- [ ] `ml/models/price_transformer.pt`

---

### [ ] **3. Anomaly Detection**

**Objetivo:** Detectar anomalias em dados de campo

**Casos de uso:**
- Pragas e doenças (queda abrupta de NDVI)
- Estresse hídrico (temperatura alta + baixa umidade)
- Geadas (temperatura < 0°C)

**Modelo:** Isolation Forest + Autoencoder

**Arquivos:**
- [ ] `ml/training/train_anomaly_detector.py`
- [ ] `ml/api/services/anomaly_detector.py`
- [ ] `ml/models/anomaly_detector.pkl`

---

### [ ] **FastAPI Setup**

**Instalação:**
```bash
cd ml/api
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn tensorflow torch scikit-learn pandas numpy
```

**API Endpoints:**
```python
POST /api/v1/predict/yield
POST /api/v1/predict/price
POST /api/v1/detect/anomalies
GET  /api/v1/models/status
POST /api/v1/models/retrain
```

**Exemplo de request:**
```json
POST /api/v1/predict/yield
{
  "crop_type": "soja",
  "area": 100,
  "soil_type": "latossolo",
  "weather_history": [...],
  "planting_date": "2025-10-15"
}

Response:
{
  "predicted_yield": 3200,
  "confidence_interval": [2800, 3600],
  "factors": {
    "weather_score": 0.85,
    "soil_score": 0.90,
    "risk_level": "LOW"
  }
}
```

---

## 🎯 FASE 4: Infraestrutura (20% completo)

### ✅ Já configurado:
- [x] PostgreSQL 16 (Docker)
- [x] Redis 7 (Docker)
- [x] Prisma ORM

### [ ] A configurar:

#### [ ] **TimescaleDB** (Séries Temporais)

**Objetivo:** Armazenar dados com timestamp de forma eficiente

**Instalação:**
```yaml
# docker-compose.yml
timescaledb:
  image: timescale/timescaledb:latest-pg16
  ports:
    - "5434:5432"
  environment:
    POSTGRES_DB: lavra_timeseries
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  volumes:
    - timescaledb-data:/var/lib/postgresql/data
```

**Tabelas a criar:**
- `weather_readings` - Dados climáticos
- `market_ticks` - Cotações em tempo real
- `sensor_data` - Dados de sensores IoT (futuro)

**Hypertables:**
```sql
CREATE TABLE weather_readings (
  time        TIMESTAMPTZ NOT NULL,
  farm_id     UUID NOT NULL,
  temperature DOUBLE PRECISION,
  humidity    DOUBLE PRECISION,
  rainfall    DOUBLE PRECISION
);

SELECT create_hypertable('weather_readings', 'time');

CREATE INDEX ON weather_readings (farm_id, time DESC);
```

---

#### [ ] **Apache Kafka** (Event Streaming)

**Objetivo:** Streaming de eventos entre microserviços

**Instalação:**
```yaml
# docker-compose.yml
zookeeper:
  image: confluentinc/cp-zookeeper:latest
  environment:
    ZOOKEEPER_CLIENT_PORT: 2181

kafka:
  image: confluentinc/cp-kafka:latest
  depends_on:
    - zookeeper
  ports:
    - "9092:9092"
  environment:
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
```

**Topics a criar:**
- `weather.updates` - Atualizações climáticas
- `market.prices` - Cotações de mercado
- `alerts.created` - Novos alertas
- `simulations.completed` - Simulações finalizadas

---

## 🎯 FASE 5: Testes (25% completo)

### ✅ Testes Unitários (115 passando)
- [x] Plots (18 testes)
- [x] Plantings (21 testes)
- [x] Harvests (17 testes)
- [x] ClimateData (17 testes)
- [x] Alerts (20 testes)
- [x] MarketPrices (22 testes)

### [ ] Testes Unitários Faltando

- [ ] Transactions (20 testes) - PRÓXIMO
- [ ] Simulations (25 testes)
- [ ] Integrations (15 testes)
- [ ] WebSockets (10 testes)
- [ ] Jobs (15 testes)

**Meta:** 250+ testes unitários

---

### [ ] **Testes E2E** (0% completo)

**Localização:** `apps/api/test/`

**Cenários a testar:**

#### [ ] Cenário 1: Fluxo completo de plantio
```typescript
// test/flows/planting.e2e-spec.ts

describe('Fluxo de Plantio (E2E)', () => {
  it('deve criar fazenda → talhão → plantio → colheita', async () => {
    // 1. Login
    const { token } = await login();
    
    // 2. Criar fazenda
    const farm = await createFarm(token, {
      name: 'Fazenda Teste',
      totalArea: 100,
    });
    
    // 3. Criar talhão
    const plot = await createPlot(token, {
      farmId: farm.id,
      name: 'Talhão 1',
      area: 50,
    });
    
    // 4. Criar plantio
    const planting = await createPlanting(token, {
      plotId: plot.id,
      cropType: 'Soja',
      area: 50,
    });
    
    // 5. Registrar colheita
    const harvest = await createHarvest(token, {
      plantingId: planting.id,
      quantity: 150000, // 150 toneladas
    });
    
    // Validações
    expect(harvest.productivity).toBe(3000); // 150000 / 50
    expect(planting.actualYield).toBe(3000);
  });
});
```

#### [ ] Cenário 2: Alertas em tempo real
```typescript
describe('Alertas em Tempo Real (E2E)', () => {
  it('deve criar alerta e receber via WebSocket', async () => {
    // Setup WebSocket
    const socket = connectWebSocket(token);
    
    // Criar alerta
    const alert = await createAlert({
      type: 'WEATHER',
      severity: 'HIGH',
    });
    
    // Esperar evento
    const received = await waitForEvent(socket, 'alert');
    
    expect(received.id).toBe(alert.id);
  });
});
```

#### [ ] Cenário 3: Simulação completa
```typescript
describe('Simulação (E2E)', () => {
  it('deve executar simulação e retornar resultados', async () => {
    const simulation = await createSimulation({
      cropType: 'Soja',
      area: 100,
      scenarios: [
        { price: 150, yield: 3000 },
        { price: 120, yield: 3000 },
      ],
    });
    
    await waitForJobCompletion(simulation.id);
    
    const result = await getSimulation(simulation.id);
    
    expect(result.results).toHaveLength(2);
    expect(result.results[0].profit).toBeGreaterThan(0);
  });
});
```

---

### [ ] **Testes de Integração**

#### [ ] API Externa: OpenWeather
```typescript
describe('OpenWeather Integration', () => {
  it('deve buscar dados reais da API', async () => {
    const data = await weatherService.fetchFromOpenWeather(farmId);
    
    expect(data.temperature).toBeDefined();
    expect(data.humidity).toBeGreaterThan(0);
  });
});
```

#### [ ] Queue: Bull
```typescript
describe('Weather Queue', () => {
  it('deve processar job de atualização climática', async () => {
    await weatherQueue.add('fetch-weather-data', { farmId });
    
    const job = await waitForJobCompletion();
    
    expect(job.returnvalue).toHaveProperty('temperature');
  });
});
```

---

## 📈 Ordem de Implementação Recomendada

### Sprint 1 (Próximos 7 dias)
1. ✅ Completar Transactions + testes
2. ✅ Implementar Bull queues básico
3. ✅ Implementar WebSockets básico

### Sprint 2 (Dias 8-14)
4. ✅ Completar Simulations + testes
5. ✅ Implementar Integrations (OpenWeather, CEPEA)
6. ✅ Criar jobs de atualização automática

### Sprint 3 (Dias 15-21)
7. ✅ Criar Market Service (Go) - MVP
8. ✅ Criar Climate Service (Go) - MVP
9. ✅ Configurar TimescaleDB

### Sprint 4 (Dias 22-28)
10. ✅ Configurar Kafka
11. ✅ Integrar microserviços Go com NestJS
12. ✅ Testes E2E básicos

### Sprint 5 (Dias 29-35)
13. ✅ Setup ML (FastAPI)
14. ✅ Modelo de previsão de produtividade (MVP)
15. ✅ Modelo de previsão de preços (MVP)

### Sprint 6 (Dias 36-42)
16. ✅ Decision Engine (Go + Python)
17. ✅ Alert Worker (Go + Kafka)
18. ✅ Testes E2E completos

---

## 🎯 Critérios de Conclusão

### Backend considera-se COMPLETO quando:

- [ ] **Todos os módulos NestJS implementados** (10/10)
- [ ] **Todos microserviços Go rodando** (4/4)
- [ ] **ML Pipeline funcionando** (3 modelos treinados)
- [ ] **250+ testes unitários passando**
- [ ] **30+ testes E2E passando**
- [ ] **Todas integrações externas funcionando**
- [ ] **WebSockets + queues operacionais**
- [ ] **Documentação completa (OpenAPI/Swagger)**
- [ ] **Docker Compose com todos serviços**
- [ ] **CI/CD configurado (GitHub Actions)**

---

## 📝 Comandos Úteis

### Rodar todos os testes
```bash
cd apps/api
npm run test              # Unitários
npm run test:e2e          # E2E
npm run test:cov          # Cobertura
```

### Rodar microserviços Go
```bash
cd services/market-service
go run cmd/main.go
```

### Rodar ML API
```bash
cd ml/api
uvicorn main:app --reload
```

### Docker Compose completo
```bash
docker-compose up -d
```

---

**Última atualização:** 29/01/2026
**Progresso:** 35% completo
**Próximo:** Finalizar Transactions + testes
