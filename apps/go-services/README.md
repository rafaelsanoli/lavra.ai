# Lavra.AI - Go Microservices

Microserviços em Go para processamento de análises complexas, machine learning inference e workers de background.

## 📁 Estrutura

```
go-services/
├── proto/              # Definições Protocol Buffers (gRPC)
│   ├── market.proto    # Market Analysis Service
│   ├── climate.proto   # Climate Analysis Service
│   ├── decision.proto  # Decision Engine Service
│   └── alert.proto     # Alert Worker Service
├── pb/                 # Código gerado dos .proto
├── services/
│   ├── market-analysis/
│   │   ├── cmd/
│   │   │   └── main.go
│   │   ├── internal/
│   │   │   ├── server/
│   │   │   ├── service/
│   │   │   ├── models/
│   │   │   └── utils/
│   │   └── Dockerfile
│   ├── climate-analysis/
│   ├── decision-engine/
│   └── alert-worker/
├── pkg/                # Pacotes compartilhados
│   ├── database/       # Database clients (PostgreSQL, Redis)
│   ├── cache/          # Cache helpers
│   ├── logger/         # Logging utilities
│   └── metrics/        # Prometheus metrics
├── go.mod
├── go.sum
├── Makefile
└── docker-compose.yml
```

## 🚀 Microserviços

### 1. Market Analysis Service (port 50051)
**Responsabilidade:** Análise avançada de mercado e preços

**Funcionalidades:**
- Análise de tendências de preços (ARIMA, Exponential Smoothing)
- Cálculo de volatilidade e risco de mercado
- Detecção de anomalias de preço (Z-score, IQR)
- Correlações entre commodities
- Previsão de preço de curto prazo (1-30 dias)
- Análise de sazonalidade (padrões mensais/anuais)

**RPCs:**
- `AnalyzePriceTrend` - Identificar tendências BULLISH/BEARISH
- `CalculateVolatility` - Volatilidade e coeficiente de variação
- `DetectPriceAnomalies` - Alertas de preços anormais
- `CalculateCorrelations` - Correlação entre commodities
- `ForecastPrice` - Previsão com intervalos de confiança
- `AnalyzeSeasonality` - Padrões sazonais e índices

### 2. Climate Analysis Service (port 50052)
**Responsabilidade:** Análise climática e agronômica

**Funcionalidades:**
- Cálculo de risco climático por cultura e estágio
- Análise de condições de plantio (solo, temp, precipitação)
- Previsão de janela de colheita (baseado em GDD)
- Balanço hídrico (P-ET, déficit acumulado)
- Detecção de eventos extremos (geada, seca, granizo)
- Análise de crescimento de culturas (GDD, fenologia)

**RPCs:**
- `CalculateClimateRisk` - Score de risco climático integrado
- `AnalyzePlantingConditions` - Avaliar condições de semeadura
- `PredictHarvestWindow` - Janela ótima de colheita
- `CalculateWaterBalance` - Déficit/excesso hídrico
- `DetectExtremeEvents` - Eventos climáticos críticos
- `AnalyzeCropGrowth` - Fenologia e progresso de crescimento

### 3. Decision Engine Service (port 50053)
**Responsabilidade:** Motor de decisão inteligente

**Funcionalidades:**
- Recomendação de estratégias de hedge (futuros, opções)
- Avaliação de oportunidades de seguro rural
- Otimização de momento de venda (timing analysis)
- Sugestão de diversificação de portfólio
- Análise integrada de risco (clima + mercado + operacional)
- Geração de planos de ação personalizados

**RPCs:**
- `RecommendHedgeStrategy` - Estratégias de proteção de preço
- `EvaluateInsuranceOpportunity` - Viabilidade de seguro
- `OptimizeSaleTiming` - Melhor momento para vender
- `SuggestPortfolioDiversification` - Diversificação de culturas
- `AnalyzeIntegratedRisk` - Risco holístico da operação
- `GenerateActionPlan` - Plano de ação customizado

### 4. Alert Worker Service (port 50054)
**Responsabilidade:** Processamento inteligente de alertas

**Funcionalidades:**
- Processamento e enriquecimento de alertas
- Cálculo dinâmico de prioridade (1-10)
- Enriquecimento contextual (weather, market, crop data)
- Agrupamento de alertas similares
- Sugestão de ações corretivas/preventivas
- Validação de regras de negócio

**RPCs:**
- `ProcessAlert` - Pipeline completo de processamento
- `CalculatePriority` - Score de prioridade inteligente
- `EnrichAlert` - Adicionar dados contextuais
- `GroupAlerts` - Agrupar alertas relacionados
- `SuggestActions` - Ações recomendadas
- `ValidateBusinessRules` - Validação de regras

## 🛠️ Tecnologias

- **Go 1.21+** - Linguagem de programação
- **gRPC** - Comunicação entre serviços
- **Protocol Buffers** - Serialização de dados
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e pub/sub
- **Docker** - Containerização
- **Prometheus** - Métricas
- **Logrus** - Logging estruturado

## 📦 Instalação

### Pré-requisitos
```bash
# Go 1.21+
go version

# Protocol Buffers compiler
protoc --version

# Go plugins para protoc
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

### Setup
```bash
# Clone e entre no diretório
cd apps/go-services

# Instalar dependências
make deps

# Gerar código a partir dos .proto
make proto

# Build todos os serviços
make build
```

## 🚀 Executar

### Desenvolvimento (serviço individual)
```bash
# Market Analysis Service
make run-market

# Climate Analysis Service
make run-climate

# Decision Engine Service
make run-decision

# Alert Worker Service
make run-alert
```

### Desenvolvimento (todos os serviços)
```bash
make run-all
```

### Produção (Docker)
```bash
# Build imagens
make docker-build

# Iniciar serviços
make docker-up

# Parar serviços
make docker-down
```

## 🧪 Testes

```bash
# Executar todos os testes
make test

# Testes com cobertura
make test-coverage

# Lint
make lint

# Format code
make fmt

# Vet code
make vet
```

## 📊 Monitoramento

### Métricas (Prometheus)
Cada serviço expõe métricas em `/metrics`:
- `grpc_requests_total` - Total de requisições
- `grpc_request_duration_seconds` - Latência
- `grpc_errors_total` - Total de erros
- `service_health` - Status de saúde

### Health Checks
```bash
# Market Analysis Service
grpcurl -plaintext localhost:50051 grpc.health.v1.Health/Check

# Climate Analysis Service
grpcurl -plaintext localhost:50052 grpc.health.v1.Health/Check

# Decision Engine Service
grpcurl -plaintext localhost:50053 grpc.health.v1.Health/Check

# Alert Worker Service
grpcurl -plaintext localhost:50054 grpc.health.v1.Health/Check
```

## 🔧 Configuração

Variáveis de ambiente (`.env`):
```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USER=lavraai
POSTGRES_PASSWORD=lavraai123
POSTGRES_DB=lavraai

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# gRPC Ports
MARKET_SERVICE_PORT=50051
CLIMATE_SERVICE_PORT=50052
DECISION_SERVICE_PORT=50053
ALERT_SERVICE_PORT=50054

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Metrics
METRICS_PORT=9090
```

## 📖 Documentação da API

### gRPC Client (Node.js/NestJS)
```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('proto/market.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.market.MarketAnalysisService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

client.AnalyzePriceTrend({
  commodity: 'SOJA',
  market: 'PARANAGUA',
  days: 30
}, (err, response) => {
  console.log(response);
});
```

### gRPC Client (Python)
```python
import grpc
import market_pb2
import market_pb2_grpc

channel = grpc.insecure_channel('localhost:50051')
stub = market_pb2_grpc.MarketAnalysisServiceStub(channel)

request = market_pb2.PriceTrendRequest(
    commodity='SOJA',
    market='PARANAGUA',
    days=30
)

response = stub.AnalyzePriceTrend(request)
print(response)
```

## 🏗️ Arquitetura

### Fluxo de Comunicação
```
┌─────────────┐
│   NestJS    │ ──┐
│  (GraphQL)  │   │
└─────────────┘   │
                  │ gRPC
┌─────────────┐   │
│   Frontend  │   │
│  (Next.js)  │ ──┘
└─────────────┘   │
                  ▼
┌─────────────────────────────────────┐
│      Go Microservices (gRPC)        │
├──────────────┬──────────────────────┤
│   Market     │   Climate            │
│   Analysis   │   Analysis           │
│  (port 50051)│  (port 50052)        │
├──────────────┼──────────────────────┤
│   Decision   │   Alert              │
│   Engine     │   Worker             │
│  (port 50053)│  (port 50054)        │
└──────────────┴──────────────────────┘
         │              │
         ▼              ▼
    ┌──────────┐   ┌──────────┐
    │PostgreSQL│   │  Redis   │
    └──────────┘   └──────────┘
```

## 🔐 Segurança

- **TLS/SSL:** Produção usa certificados SSL para gRPC
- **Authentication:** JWT tokens via metadata
- **Rate Limiting:** 100 req/s por serviço
- **Input Validation:** Validação de todos os inputs
- **Error Handling:** Erros não expõem detalhes internos

## 📈 Performance

**Benchmarks (Go 1.21, 8 cores):**
- Market Analysis: ~500 req/s, p99 < 50ms
- Climate Analysis: ~400 req/s, p99 < 80ms
- Decision Engine: ~300 req/s, p99 < 100ms
- Alert Worker: ~800 req/s, p99 < 30ms

## 🤝 Integração com NestJS

```typescript
// apps/api/src/grpc/grpc.module.ts
@Module({
  providers: [
    {
      provide: 'MARKET_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'market',
            protoPath: join(__dirname, '../../../go-services/proto/market.proto'),
            url: 'localhost:50051',
          },
        });
      },
    },
  ],
  exports: ['MARKET_SERVICE'],
})
export class GrpcModule {}
```

## 📝 Contribuição

1. Sempre use `make fmt` antes de commitar
2. Todos os RPCs devem ter testes unitários
3. Adicionar logging estruturado (logrus)
4. Documentar mudanças no CHANGELOG.md
5. Seguir convenções Go (golangci-lint)

## 📄 Licença

MIT License - ver arquivo LICENSE
