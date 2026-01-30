# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### 🚀 Em Desenvolvimento
- Decision Engine Service (Go)
- Alert Worker Service (Go)
- Machine Learning (Python/FastAPI)
- Testes E2E

---

## [0.14.0] - 2026-01-30

### ✨ Adicionado

#### 🌡️ **Climate Analysis Service** (port 50052)

Microserviço de análise climática e agronômica avançada.

**6 RPCs implementados:**

1. **CalculateClimateRisk**
   - Análise integrada de risco por cultura e estágio
   - 4 categorias: FROST, DROUGHT, HEAT_STRESS, EXCESS_RAIN
   - Score de risco geral (0-1)
   - Classificação: LOW, MEDIUM, HIGH, CRITICAL
   - Recomendações contextualizadas
   - Parâmetros por cultura (SOJA, MILHO, CAFE)

2. **AnalyzePlantingConditions**
   - Avaliação de adequação para plantio
   - Temperatura, umidade do solo, previsão 7 dias
   - Suitability score (0-1)
   - Status de umidade: DRY, ADEQUATE, EXCESSIVE
   - Fatores favoráveis vs desfavoráveis
   - Recomendação: plantar/aguardar/não plantar

3. **PredictHarvestWindow**
   - Previsão de janela ótima de colheita
   - Baseado em GDD (Growing Degree Days) acumulado
   - Janela ótima (±3 dias, 85% confiança)
   - Janela aceitável (±7 dias, 70% confiança)
   - Progresso de maturação (0-1)
   - Recomendações de monitoramento

4. **CalculateWaterBalance**
   - Balanço hídrico diário (P - ET)
   - Evapotranspiração (método Hargreaves)
   - Déficit acumulado
   - Status: SURPLUS, ADEQUATE, DEFICIT, SEVERE_DEFICIT
   - Nível de estresse hídrico: NONE, MILD, MODERATE, SEVERE
   - Recomendação de irrigação (mm)

5. **DetectExtremeEvents**
   - Detecção de 6 tipos de eventos extremos
   - FROST: Temperatura < 2°C
   - HEAT_WAVE: 3+ dias > 35°C
   - HEAVY_RAIN: Precipitação > 80mm/dia
   - DROUGHT: < 10mm em 7 dias
   - HAIL e STRONG_WIND (estrutura)
   - Probabilidade, severidade e impactos
   - Ações de mitigação específicas

6. **AnalyzeCropGrowth**
   - Análise fenológica completa
   - GDD acumulado vs target
   - 4 estágios: GERMINATION, VEGETATIVE, FLOWERING, MATURITY
   - Progresso de crescimento (0-1)
   - Taxa de desenvolvimento (GDD/dia)
   - Status de saúde: EXCELLENT, GOOD, FAIR, POOR
   - Estimativa de data de colheita

**Algoritmos agronômicos:**
- **GDD (Growing Degree Days):** Método térmico para fenologia
- **Evapotranspiração:** Hargreaves simplificado
- **Balanço hídrico:** P - ET com déficit acumulado
- **Z-score:** Detecção de anomalias climáticas
- **Regressão:** Estimativa de datas de colheita

**Parâmetros de culturas:**
- **SOJA:** 1800 GDD, base 10°C, ciclo 120 dias
- **MILHO:** 1500 GDD, base 10°C, ciclo 110 dias
- **CAFE:** 3000 GDD, base 12°C, ciclo 180 dias
- Temperaturas críticas (geada, ótima, estresse)
- Necessidade hídrica total

**Features:**
- Simulação de dados climáticos (desenvolvimento)
- Previsão 7-30 dias
- Análise histórica
- Context-aware recommendations
- Graceful shutdown
- Error handling robusto

### 🎯 **Use Cases Implementados**

1. **Decisão de plantio:**
   - Avaliar condições atuais
   - Verificar previsão 7 dias
   - Score de adequação
   - Recomendação: plantar ou aguardar

2. **Gestão de risco:**
   - Identificar riscos climáticos
   - Priorizar por severidade
   - Ações preventivas

3. **Planejamento de colheita:**
   - Monitorar GDD acumulado
   - Estimar janela ótima
   - Considerar previsão do tempo

4. **Manejo hídrico:**
   - Balanço hídrico diário
   - Déficit acumulado
   - Recomendação de irrigação

5. **Monitoramento fenológico:**
   - Estágio de crescimento atual
   - Progresso de maturação
   - Desvios de desenvolvimento

### 📄 **Arquivos Criados**

**Climate Analysis Service:**
- `cmd/main.go` (~50 linhas)
- `internal/server/server.go` (~20 linhas)
- `internal/service/climate_service.go` (~850 linhas)
- `internal/models/types.go` (~100 linhas)

**Total:** 4 arquivos, ~1,020 linhas Go

### 📊 **Progresso**

**Sprint 3-4 (Dias 15-28):** 25% → 50% completo
- ✅ Infraestrutura Go Microservices
- ✅ Market Analysis Service (6 RPCs)
- ✅ Climate Analysis Service (6 RPCs)
- ⏳ Decision Engine Service
- ⏳ Alert Worker Service

**Backend:** 65% → 70% completo

---

## [0.13.0] - 2026-01-30

### ✨ Adicionado

#### 🔷 **Go Microservices - Infraestrutura**

Criada arquitetura base para microserviços Go com gRPC e Protocol Buffers.

**Estrutura:**
- 4 definições Protocol Buffers (.proto)
- Makefile para build, test e deploy
- Docker e docker-compose configs
- go.mod com dependências
- README completo com documentação

**Tecnologias:**
- Go 1.21+
- gRPC (comunicação entre serviços)
- Protocol Buffers v3 (serialização)
- PostgreSQL + Redis clients
- Logrus (logging estruturado)
- Prometheus (métricas)

#### 📊 **Market Analysis Service** (port 50051)

Microserviço de análise avançada de mercado e preços.

**6 RPCs implementados:**

1. **AnalyzePriceTrend**
   - Regressão linear para identificar tendências
   - Cálculo de força de tendência (R²)
   - Classificação: BULLISH, BEARISH, NEUTRAL
   - Variação percentual e preço médio

2. **CalculateVolatility**
   - Retornos logarítmicos
   - Volatilidade anualizada (252 dias úteis)
   - Coeficiente de variação (CV)
   - Classificação de risco: LOW, MEDIUM, HIGH

3. **DetectPriceAnomalies**
   - Detecção via Z-score
   - Threshold configurável (padrão: 2σ)
   - Severidade: LOW, MEDIUM, HIGH, CRITICAL
   - Preço esperado vs observado

4. **CalculateCorrelations**
   - Correlação de Pearson entre pares de commodities
   - Matriz de correlação completa
   - Classificação: STRONG (>0.7), MODERATE (>0.4), WEAK
   - Útil para diversificação de portfólio

5. **ForecastPrice**
   - Previsão de curto prazo (1-30 dias)
   - Método: Tendência linear + ruído
   - Intervalos de confiança 95%
   - Acurácia estimada (RMSE/MAE)

6. **AnalyzeSeasonality**
   - Padrões mensais (índices sazonais)
   - Identificação de picos e vales
   - Força da sazonalidade (amplitude)
   - Útil para timing de venda

**Algoritmos implementados:**
- Regressão linear (least squares)
- Cálculo de R² (coeficiente de determinação)
- Correlação de Pearson
- Z-score para detecção de anomalias
- Random walk para simulação de preços
- Média móvel e desvio padrão
- Retornos logarítmicos

**Features:**
- Graceful shutdown (SIGTERM/SIGINT)
- Reflection API (suporte grpcurl)
- Logging estruturado
- Context propagation
- Error handling robusto
- Mock data para desenvolvimento

### 📦 **Protocol Buffers**

**4 arquivos .proto criados:**

1. **market.proto** (~200 linhas)
   - 6 métodos RPC
   - 16 message types
   - Suporte a múltiplas commodities
   - Timestamps Unix

2. **climate.proto** (~250 linhas)
   - 6 métodos RPC para análise climática
   - Cálculo de risco por estágio de crescimento
   - GDD (Growing Degree Days)
   - Balanço hídrico (P-ET)

3. **decision.proto** (~300 linhas)
   - 6 métodos RPC para decisões estratégicas
   - Hedge, seguro, timing de venda
   - Diversificação de portfólio
   - Planos de ação personalizados

4. **alert.proto** (~230 linhas)
   - 6 métodos RPC para processamento de alertas
   - Priorização inteligente (1-10)
   - Enriquecimento contextual
   - Agrupamento de alertas similares

### 🏗️ **Arquitetura**

**Comunicação:**
```
NestJS (GraphQL) <--gRPC--> Go Microservices
                                ↓
                        PostgreSQL + Redis
```

**Ports:**
- Market Analysis: 50051
- Climate Analysis: 50052
- Decision Engine: 50053
- Alert Worker: 50054
- Metrics (Prometheus): 9090

**Padrões:**
- Clean Architecture (cmd, internal, pkg)
- Dependency Injection
- Interface-based design
- Context propagation
- Graceful shutdown
- Health checks

### 📄 **Arquivos Criados**

**Market Analysis Service:**
- `cmd/main.go` (servidor gRPC)
- `internal/server/server.go` (interface)
- `internal/service/market_service.go` (~400 linhas)
- `internal/models/types.go` (estruturas de dados)

**Infraestrutura:**
- `go.mod` (dependências)
- `Makefile` (automação)
- `proto/*.proto` (4 arquivos, ~980 linhas)
- `README.md` (documentação completa)

**Total:** 9 arquivos, ~1,600 linhas Go + ~980 linhas proto

### 🎯 **Progresso**

**Sprint 3-4 (Dias 15-28):** 25% completo
- ✅ Infraestrutura Go Microservices
- ✅ Protocol Buffers (4 arquivos)
- ✅ Market Analysis Service (6 RPCs)
- ⏳ Climate Analysis Service
- ⏳ Decision Engine Service
- ⏳ Alert Worker Service

**Backend:** 60% → 65% completo

---

## [0.12.0] - 2026-01-30

### ✨ Adicionado

#### 🔗 **Módulo Integrations - APIs Externas**

Sistema completo de integrações com APIs externas do mercado agrícola brasileiro e internacional.

##### **B3Service** - Bolsa de Valores Brasileira
- **Cotações spot:** Preços em tempo real de ações e commodities
- **Contratos futuros:** Próximos vencimentos (SOJA, MILHO, CAFE, etc)
- **Batch quotes:** Múltiplas cotações simultâneas
- **Market status:** Verificação de horário de funcionamento (10h-17h30)
- **Cache:** 5 minutos para quotes, 10 minutos para futuros
- **Métodos:**
  * `getQuote(symbol)` - Cotação individual
  * `getFutures(commodity, limit)` - Contratos futuros
  * `getBatchQuotes(symbols)` - Múltiplas cotações
  * `isMarketOpen()` - Status do mercado

##### **InmetService** - Instituto Nacional de Meteorologia
- **Estações meteorológicas:** Busca por proximidade geográfica
- **Dados atuais:** Temperatura, umidade, pressão, vento, precipitação
- **Histórico:** Séries temporais de dados climáticos
- **Previsões:** Forecast 7 dias para municípios
- **Cache:** 30 min (atual), 3h (previsão), 6h (histórico), 24h (estações)
- **Raio de busca:** Configurável (padrão 100km)
- **Métodos:**
  * `findNearbyStations(lat, lon, radius)` - Estações próximas
  * `getCurrentWeather(stationCode)` - Dados atuais
  * `getHistoricalWeather(code, start, end)` - Histórico
  * `getForecast(municipality, uf, days)` - Previsão
  * `getWeatherByCoordinates(lat, lon)` - Clima por coordenada

##### **NasaPowerService** - NASA POWER API (Satélite)
- **Dados climáticos globais:** Cobertura mundial via satélite
- **Resolução:** 0.5° x 0.5° (~50km)
- **Histórico:** 1981 até presente
- **Parâmetros agrícolas:**
  * Temperatura (T2M, T2M_MAX, T2M_MIN)
  * Precipitação corrigida (PRECTOTCORR)
  * Umidade relativa (RH2M)
  * Velocidade do vento (WS2M)
  * Radiação solar (ALLSKY_SFC_SW_DWN)
  * PAR - Photosynthetically Active Radiation
- **Índices calculados:**
  * Evapotranspiração (Método Hargreaves)
  * Déficit hídrico
  * Graus-dia de crescimento (GDD) - base configurável por cultura
  * Índice de risco de geada (< 2°C)
  * Índice de estresse térmico (> 35°C)
- **Agregações:** Dados diários e médias mensais
- **Cache:** 12h (histórico), 1h (recente), 6h (índices)
- **Métodos:**
  * `getDailyData(lat, lon, start, end)` - Dados diários
  * `calculateAgriculturalIndices(lat, lon, start, end, crop)` - Índices
  * `getMonthlyAverages(lat, lon, year)` - Médias mensais

##### **CepeaService** - CEPEA/ESALQ/USP (Preços Agrícolas)
- **Indicadores de preços:** Spot e futuros do mercado brasileiro
- **Commodities suportadas:**
  * Grãos: SOJA, MILHO, TRIGO, ALGODAO
  * Cafés: CAFE_ARABICA, CAFE_ROBUSTA
  * Proteínas: BOI_GORDO, SUINO, FRANGO
  * Outros: LEITE, ACUCAR, ETANOL
- **Mercados principais:**
  * Soja: PARANAGUA, PASSO_FUNDO, CASCAVEL, RIO_VERDE
  * Milho: CAMPINAS, CASCAVEL, DOURADOS, SORRISO
  * Café: MOGIANA, SUL_MINAS, CERRADO
  * Boi: SAO_PAULO, GOIAS, MATO_GROSSO
- **Análises:**
  * Séries históricas com estatísticas (média, máx, mín, volatilidade)
  * Indicadores de mercado (tendências 7/30 dias)
  * Análise de sentimento (BULLISH, BEARISH, NEUTRAL)
  * Basis points (diferença spot vs futuro)
  * Comparação entre mercados
- **Cache:** 1h (preços atuais e indicadores), 6h (histórico)
- **Métodos:**
  * `getCurrentPrice(commodity, market)` - Preço atual
  * `getHistoricalSeries(commodity, market, start, end)` - Série histórica
  * `getMarketIndicator(commodity)` - Indicador consolidado
  * `compareMarkets(commodity, markets)` - Comparação
  * `getAvailableCommodities()` - Lista de commodities
  * `getMarketsByCommodity(commodity)` - Mercados por commodity

### 📦 **Dependências**
- ➕ `@nestjs/axios@^3.0.0` - HTTP client
- ➕ `axios@^1.6.0` - Promise-based HTTP
- ➕ `@nestjs/cache-manager@^2.0.0` - Cache abstraction
- ➕ `cache-manager@^5.0.0` - Cache engine

### 🎯 **GraphQL Queries Implementadas**

**B3 (4 queries):**
- `b3Quote(symbol)` - Cotação individual
- `b3Futures(commodity, limit)` - Contratos futuros
- `b3BatchQuotes(symbols)` - Múltiplas cotações
- `isB3MarketOpen` - Status do mercado

**INMET (5 queries):**
- `inmetStations(lat, lon, radiusKm)` - Estações próximas
- `inmetCurrentWeather(stationCode)` - Clima atual
- `inmetHistoricalWeather(code, start, end)` - Histórico
- `inmetForecast(municipality, uf, days)` - Previsão
- `inmetWeatherByCoordinates(lat, lon)` - Clima por coordenada

**NASA POWER (3 queries):**
- `nasaPowerDailyData(lat, lon, start, end)` - Dados diários
- `nasaPowerAgriculturalIndices(lat, lon, start, end, crop)` - Índices
- `nasaPowerMonthlyAverages(lat, lon, year)` - Médias mensais

**CEPEA (6 queries):**
- `cepeaCurrentPrice(commodity, market)` - Preço atual
- `cepeaHistoricalSeries(commodity, market, start, end)` - Histórico
- `cepeaMarketIndicator(commodity)` - Indicador consolidado
- `cepeaCompareMarkets(commodity, markets)` - Comparação
- `cepeaAvailableCommodities` - Lista de commodities
- `cepeaMarketsByCommodity(commodity)` - Mercados

**Total:** 18 queries GraphQL

### 🏗️ **Arquitetura**

**Padrões implementados:**
- **Cache em camadas:** TTL configurável por tipo de dado
- **Error handling:** Try-catch com logging detalhado
- **Mock data:** Estrutura pronta para APIs reais
- **Type-safe:** DTOs com GraphQL decorators
- **Modular:** Serviços independentes e reutilizáveis
- **Scalable:** HttpModule com timeout e retry

**Cache strategy:**
- Dados em tempo real: 5-30 minutos
- Previsões: 1-3 horas
- Dados históricos: 6-12 horas
- Metadados: 24 horas

### ✅ **Testes**

**45 testes unitários passando:**
- B3Service: 10 testes
- InmetService: 10 testes
- NasaPowerService: 12 testes
- CepeaService: 13 testes

**Cobertura:**
- Cache behavior (hit/miss)
- Data generation e validação
- Cálculos e estatísticas
- Error handling
- Edge cases

### 📄 **Arquivos Criados**

**Serviços (4):**
- `integrations/services/b3.service.ts` (~250 linhas)
- `integrations/services/inmet.service.ts` (~290 linhas)
- `integrations/services/nasa-power.service.ts` (~350 linhas)
- `integrations/services/cepea.service.ts` (~380 linhas)

**DTOs (4):**
- `integrations/dto/b3-quote.dto.ts` (~50 linhas)
- `integrations/dto/inmet-weather.dto.ts` (~70 linhas)
- `integrations/dto/nasa-power.dto.ts` (~80 linhas)
- `integrations/dto/cepea-price.dto.ts` (~90 linhas)

**Testes (4):**
- `integrations/services/b3.service.spec.ts` (~180 linhas)
- `integrations/services/inmet.service.spec.ts` (~170 linhas)
- `integrations/services/nasa-power.service.spec.ts` (~190 linhas)
- `integrations/services/cepea.service.spec.ts` (~210 linhas)

**Módulo e Resolver:**
- `integrations/integrations.module.ts` (~35 linhas)
- `integrations/integrations.resolver.ts` (~140 linhas)

**Total:** 14 arquivos, ~2,535 linhas de código

### 🎯 **Use Cases**

1. **Análise de mercado:** Comparar preços B3 vs CEPEA para hedge
2. **Decisão de plantio:** Clima NASA + previsão INMET + preços CEPEA
3. **Gestão de risco:** Alertas climáticos + volatilidade de preços
4. **Otimização de colheita:** GDD + clima atual + preços futuros

### 📊 **Progresso**

**Sprint 2 (Dias 8-14):** 60% completo
- ✅ Integrations Module (4 serviços + 18 queries)
- ✅ 45 testes unitários
- ⏳ Rate limiting e retry logic
- ⏳ Monitoramento de uptime das APIs
- ⏳ Fallback strategies

**Backend:** 55% → 60% completo

---

## [0.11.0] - 2026-01-29

### ✨ Adicionado

#### 🔌 **WebSockets (Socket.io) Completo**
- **Infraestrutura:**
  - Integração Socket.io com NestJS
  - CORS habilitado (configurável para produção)
  - Sistema de rooms e namespaces
  - Tracking de usuários conectados
  - Auto-reconnection support
  
- **EventsGateway** (`websockets/events.gateway.ts`):
  - Gateway base para comunicação WebSocket
  - Lifecycle hooks: afterInit, handleConnection, handleDisconnect
  - User tracking (socketId → userId mapping)
  - **Métodos:**
    * `emitToUser(userId, event, data)` - Enviar para usuário específico
    * `emitToAll(event, data)` - Broadcast para todos
    * `emitToRoom(room, event, data)` - Enviar para sala específica
    * `getConnectedUsersCount()` - Contador de usuários online
    * `isUserConnected(userId)` - Verificar status de conexão
  - Sistema de rooms: `user:{userId}` para comunicação direcionada
  
- **AlertsGateway** (`websockets/alerts.gateway.ts`):
  - Namespace: `/alerts`
  - **Eventos emitidos:**
    * `alert:new` - Novo alerta criado
    * `alert:updated` - Alerta atualizado
    * `alert:read` - Alerta marcado como lido
    * `alert:resolved` - Alerta resolvido
    * `alert:weather` - Alerta meteorológico específico
    * `alert:market` - Alerta de mercado específico
  - **Eventos de inscrição:**
    * `alerts:subscribe` - Inscrever em alertas
    * `alerts:unsubscribe` - Desinscrever
    * `alerts:getUnreadCount` - Obter contagem de não lidos
  - Integração automática com AlertsService
  - Roteamento inteligente por tipo de alerta
  
- **PricesGateway** (`websockets/prices.gateway.ts`):
  - Namespace: `/prices`
  - **Eventos emitidos:**
    * `price:update` - Atualização de preço
    * `price:alert` - Alerta de mudança significativa
    * `market:summary` - Resumo do mercado
  - **Eventos de inscrição:**
    * `prices:subscribe` - Inscrever em commodity específica
    * `prices:unsubscribe` - Desinscrever
    * `prices:subscribeAll` - Inscrever em todas commodities
    * `prices:getSubscribersCount` - Contagem de assinantes
  - Sistema de rooms por commodity: `commodity:{name}`
  - Tracking de subscrições (commodity → Set<socketId>)
  - Cleanup automático de subscrições ao desconectar
  - Suporte para múltiplas commodities: soja, milho, café, trigo, algodão
  - Integração automática com MarketPricesService
  
### 🔗 **Integrações Automáticas**
- **AlertsService:**
  - Emissão automática de WebSocket ao criar alerta
  - Roteamento por tipo: WEATHER → alert:weather, MARKET → alert:market
  - Tratamento de erros não-bloqueante
  
- **MarketPricesService:**
  - Emissão automática ao criar/atualizar preço
  - Notificação em tempo real para subscribers
  - Tratamento de erros não-bloqueante

### 📦 **Dependências**
- ➕ `@nestjs/websockets@^10.0.0` - NestJS wrapper para WebSockets
- ➕ `@nestjs/platform-socket.io@^10.0.0` - Adapter Socket.io
- ➕ `socket.io@^4.6.0` - Engine WebSocket

### 🎯 **Recursos Chave**
- **Real-time bidirectional:** Cliente ↔ Servidor comunicação instantânea
- **Namespaces:** Separação lógica (alerts, prices)
- **Rooms:** Agrupamento dinâmico de clientes
- **Event-driven:** Pub/Sub pattern para notificações
- **Auto-reconnection:** Cliente reconecta automaticamente
- **Scalable:** Suporta múltiplos clientes simultâneos
- **Type-safe:** TypeScript decorators + DTOs

### 📊 **Use Cases Implementados**
1. **Alertas em tempo real:** Usuário recebe notificação instantânea de alertas críticos
2. **Preços ao vivo:** Dashboard atualiza preços sem polling
3. **Multi-client sync:** Múltiplas abas/dispositivos sincronizados
4. **Selective updates:** Usuário só recebe dados relevantes (filtro por commodity)

### 📄 **Arquivos Criados**
- `websockets/websockets.module.ts` (módulo principal)
- `websockets/events.gateway.ts` (gateway base)
- `websockets/alerts.gateway.ts` (alertas real-time)
- `websockets/prices.gateway.ts` (preços real-time)
- **Total:** 4 arquivos, ~550 linhas

### 🎉 **Sprint 1 COMPLETO!**
- ✅ Simulations Module (22 testes)
- ✅ Bull Queues (4 filas operacionais)
- ✅ WebSockets (3 gateways + integrações)

**Progresso Backend:** 50% → 55%

---

## [0.10.0] - 2026-01-29

### ✨ Adicionado

#### ⚙️ **Sistema de Filas (Bull Queues) Completo**
- **Infraestrutura:**
  - Integração Bull + Redis para processamento assíncrono
  - 4 filas especializadas com processadores dedicados
  - Sistema de retry exponencial (2s-3s delay)
  - Limpeza automática de jobs completos
  - Monitoramento de jobs (waiting, active, completed, failed, delayed)
  
- **Weather Queue** (`queues/weather/`):
  - `addUpdateWeatherJob(farmId, userId)` - Atualização única
  - `addBulkWeatherUpdate(farmIds[])` - Atualização em massa
  - `schedulePeriodicUpdate(cron)` - Cron job (padrão: a cada 6 horas)
  - **Processor:**
    * Verifica coordenadas da fazenda
    * Simula dados meteorológicos (TODO: integrar OpenWeather API)
    * Salva ClimateData no banco
    * Gera alertas automáticos:
      - Temperatura >35°C → Alerta HIGH
      - Temperatura <5°C → Alerta CRITICAL (risco de geada)
      - Chuva >50mm → Alerta MEDIUM
      - Vento >60km/h → Alerta HIGH
  
- **Market Queue** (`queues/market/`):
  - `addUpdatePricesJob(commodity, market)` - Atualização única
  - `addBulkPriceUpdate(commodities[], market)` - Múltiplas commodities
  - `schedulePeriodicUpdate(cron)` - Cron job (padrão: 9h-17h, seg-sex)
  - **Processor:**
    * Simula preços de mercado (TODO: integrar B3/CBOT API)
    * Salva MarketPrice no banco
    * Analisa tendências (30 dias)
    * Gera alertas automáticos:
      - Alta >10% → Alerta MEDIUM
      - Queda >10% → Alerta HIGH
  
- **Simulation Queue** (`queues/simulation/`):
  - `addRunSimulationJob(simulationId, priority)` - Execução única (1-10)
  - `addBulkSimulations(simulations[])` - Múltiplas simulações
  - `pauseQueue() / resumeQueue()` - Controle de fila
  - **Processor:**
    * Executa SimulationsService.runSimulation()
    * Progress tracking (10% → 100%)
    * Timeout: 5 minutos
    * Retry: 2 tentativas (fixed delay 5s)
  
- **Notification Queue** (`queues/notification/`):
  - `addNotificationJob(userId, type, title, message)` - Envio único
  - `addBulkNotifications(notifications[])` - Envio em massa
  - `scheduleNotification(data, delay)` - Envio agendado
  - **Tipos suportados:** email, sms, push, in-app
  - **Prioridades:** low (10), normal (5), high (2), critical (1)
  - **Processor:**
    * Simula envio por canal (TODO: integrar SendGrid, Twilio, etc.)
    * Retry exponencial (1s delay)
  
### 📊 **Configurações**
- Redis connection via ConfigService (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
- forwardRef para resolver dependências circulares
- Todos os services de queues exportados para uso em outros módulos

### 📦 **Dependências**
- ➕ `@nestjs/bull@^10.0.0` - NestJS wrapper para Bull
- ➕ `bull@^4.11.0` - Queue system baseado em Redis

### 🔧 **Correções**
- Corrigido imports de AuthGuard (JwtAuthGuard → GqlAuthGuard)
- Corrigido imports de CurrentUser decorator (auth/ → common/)
- Corrigido uso de AlertType e AlertSeverity enums
- Corrigido metadata (object → JSON.stringify)
- Corrigido timestamp/date fields (Date → toISOString())
- Corrigido getPriceTrend (percentageChange → changePercent)

### 📄 **Arquivos Criados**
- `queues/queues.module.ts` (módulo principal)
- `queues/weather/` (module, service, processor) - 3 arquivos
- `queues/market/` (module, service, processor) - 3 arquivos
- `queues/simulation/` (module, service, processor) - 3 arquivos
- `queues/notification/` (module, service, processor) - 3 arquivos
- **Total:** 13 arquivos, ~1200 linhas

### 🎯 **Recursos Chave**
- **Retry automático:** Todas as queues com backoff exponencial
- **Cron jobs:** Weather (6h) e Market (horário comercial) programáveis
- **Priorização:** Simulation e Notification suportam prioridades
- **Timeout:** Simulation com timeout de 5min para simulações complexas
- **Alertas inteligentes:** Geração automática baseada em thresholds
- **Bulk operations:** Suporte para processamento em massa em todas as queues

---

## [0.9.0] - 2026-01-29

### ✨ Adicionado

#### 📊 **Módulo Simulations Completo**
- **Service** (`SimulationsService`):
  - CRUD completo com 5 operações básicas
  - Operações avançadas:
    * `runSimulation(id)` - Executa cenários de simulação
    * `calculateBreakeven(id)` - Análise de ponto de equilíbrio
    * `calculateROI(id)` - Retorno sobre investimento
    * `optimizeHedge(id)` - Otimização de estratégia de hedge
    * `compareScenarios(ids[])` - Comparação multi-dimensional de cenários
  - Geração automática de cenários:
    * HEDGE: Pessimistic (-15%), Expected, Optimistic (+15%)
    * PRODUCTION: Low Yield (80%), Expected (100%), High Yield (120%)
    * INSURANCE: No Loss, Moderate Loss (30%), Severe Loss (70%)
  - Cálculos financeiros:
    * Breakeven: quantity = Fixed Costs / (Price - Variable Cost), price = (Fixed Costs / Quantity) + Variable Cost
    * ROI: percentage = ((Return - Investment) / Investment) * 100, payback period in months
    * Hedge: optimal ratio based on price risk + volatility
  
- **Resolver** (`SimulationsResolver`):
  - 10 operações GraphQL:
    * Básicas: `createSimulation`, `simulations` (list), `simulation`, `updateSimulation`, `removeSimulation`
    * Analytics: `runSimulation`, `calculateBreakeven`, `calculateROI`, `optimizeHedge`, `compareScenarios`
  - Filtros: tipo (HEDGE, INSURANCE, PRODUCTION, MARKET), status (DRAFT, RUNNING, COMPLETED, FAILED), farmId
  - Proteção com `JwtAuthGuard`

- **DTOs**:
  - `CreateSimulationInput` (name, description?, type, parameters, scenarios?, farmId)
  - `UpdateSimulationInput` (results?, status?)
  - Enum `SimulationType`: HEDGE, INSURANCE, PRODUCTION, MARKET
  - Enum `SimulationStatus`: DRAFT, RUNNING, COMPLETED, FAILED
  - Validações:
    * Name: máximo 200 caracteres
    * Description: máximo 1000 caracteres
    * Parameters: JSON object obrigatório
    * Scenarios: JSON array opcional

- **Entities**:
  - `Simulation` - Simulação completa
  - `SimulationResult` - Resultado de execução (scenarios, bestScenario, worstScenario, statistics)
  - `BreakevenAnalysis` - Análise de ponto de equilíbrio (breakevenPrice, breakevenQuantity, contributionMargin)
  - `ROIAnalysis` - Análise de ROI (totalInvestment, expectedReturn, roi, roiPercentage, paybackPeriod)
  - `HedgeOptimization` - Otimização de hedge (recommendedStrategy, hedgeRatio, expectedProtection, scenarios, riskMetrics)
  - `ScenarioComparison` - Comparação de cenários (rankings por profit, ROI, risk)

- **Testes** (`simulations.service.spec.ts`):
  - ✅ 22 testes unitários passando (100% cobertura)
  - Cenários completos:
    - Criação com status DRAFT (1 caso)
    - Listagem e filtros (4 casos - all/tipo/status/farmId)
    - Busca individual (2 casos)
    - Atualização (2 casos)
    - Remoção (1 caso)
    - runSimulation (2 casos - success/failure)
    - calculateBreakeven (2 casos - normal/edge-case)
    - calculateROI (3 casos - zero-roi/positive-roi/zero-investment)
    - optimizeHedge (2 casos - custom-volatility/default)
    - compareScenarios (2 casos - multi-sim/no-results)

### 📦 **Banco de Dados**
- **Nova tabela:** `simulations`
  - Campos: id, name, description, type, parameters (JSON), scenarios (JSON), results (JSON), status, userId, farmId, createdAt, updatedAt
  - Índices: (userId, farmId)
  - Foreign keys: userId → users.id, farmId → farms.id
  - Cascade delete quando User ou Farm são deletados

- **Migration:** `20260129190625_add_simulations`
  - Criação da tabela simulations
  - Adicionados enums: SimulationType, SimulationStatus
  - Relações: User.simulations[], Farm.simulations[]

### 📊 **Estatísticas do Release**
- **Arquivos criados**: 8 (Entity, DTOs, Service, Resolver, Tests, Module, Migration)
- **Linhas de código**: ~1400 linhas
- **Testes**: 22/22 passando (100% cobertura)
- **Total de testes acumulados**: 160 (Plots: 18, Plantings: 21, Harvests: 17, ClimateData: 17, Alerts: 20, MarketPrices: 22, Transactions: 23, Simulations: 22)
- **Operações GraphQL**: 10 (5 básicas + 5 analytics)
- **Tempo de desenvolvimento**: ~60 minutos

### 🎯 **Funcionalidades de Analytics**
- **Run Simulation**: Execução completa de cenários com estatísticas (avg, std dev, min, max)
- **Breakeven**: Análise de ponto de equilíbrio (preço + quantidade) + margem de contribuição
- **ROI**: Retorno sobre investimento com payback period e breakdown financeiro
- **Hedge Optimization**: 4 estratégias (Conservative 100%, Optimal, Aggressive 50%, No hedge) com métricas de risco
- **Scenario Comparison**: Rankings multi-dimensionais (profit, ROI, risk) com overall score

### 📄 **Dependências**
- ➕ `graphql-type-json@0.3.2` - GraphQL JSON scalar type

---

## [0.8.0] - 2026-01-29

### ✨ Adicionado

#### 📦 **Módulo Transactions Completo**
- **Service** (`TransactionsService`):
  - CRUD completo com 5 operações básicas
  - Operações analytics:
    * `getSummary()` - Agreg por tipo e commodity (totalQuantity, totalValue, avgPrice, count)
    * `getBalance()` - Saldo de estoque (purchases - sales)
    * `getProfitLoss()` - Análise financeira (revenue, cost, profit, margin)
  - Filtros avançados:
    * Por tipo (SALE, PURCHASE, HEDGE, OPTION)
    * Por commodity
    * Por período (startDate, endDate)
  - Cálculos automáticos:
    * Average price = totalValue / totalQuantity
    * Balance = purchases - sales
    * Profit margin = ((revenue - cost) / revenue) * 100
  
- **Resolver** (`TransactionsResolver`):
  - 6 operações GraphQL:
    * Básicas: `createTransaction`, `transactions` (list), `transaction`, `updateTransaction`, `removeTransaction`
    * Analytics: `transactionsSummary`
  - Filtros: tipo, commodity, período
  - Proteção com `JwtAuthGuard`

- **DTOs**:
  - `CreateTransactionInput` (type, commodity, quantity, price, totalValue, executedAt, notes?)
  - `UpdateTransactionInput` (price?, totalValue?, notes?)
  - Enum `TransactionType`: SALE, PURCHASE, HEDGE, OPTION
  - Validações:
    * Quantity/price: mínimo 0
    * Commodity: máximo 100 caracteres
    * Notes: máximo 500 caracteres

- **Entities**:
  - `Transaction` - Transação completa
  - `TransactionSummary` - Agregação (type, commodity, totalQuantity, totalValue, avgPrice, count)

- **Testes** (`transactions.service.spec.ts`):
  - ✅ 23 testes unitários passando (100% cobertura)
  - Cenários completos:
    - Criação (2 casos - basic/auto-calc)
    - Listagem e filtros (4 casos - all/tipo/commodity/período)
    - Busca individual (2 casos)
    - Atualização (3 casos - basic/recalc/not-found)
    - Remoção (2 casos)
    - getSummary (3 casos - grouping/avgPrice/filter)
    - getBalance (2 casos - calc/filter)
    - getProfitLoss (4 casos - calc/margin/period/zero-revenue)

### 📊 **Estatísticas do Release**
- **Arquivos criados**: 7 (Service, Resolver, DTOs, Entity, Tests, Module)
- **Linhas de código**: ~1100 linhas
- **Testes**: 23/23 passando (100% cobertura)
- **Total de testes acumulados**: 138 (Plots: 18, Plantings: 21, Harvests: 17, ClimateData: 17, Alerts: 20, MarketPrices: 22, Transactions: 23)
- **Operações GraphQL**: 6 (5 básicas + 1 analytics)
- **Tempo de desenvolvimento**: ~45 minutos

### 🎯 **Funcionalidades de Analytics**
- **Summary**: Agregação multi-dimensional (tipo × commodity)
- **Balance**: Controle de estoque em tempo real
- **P&L**: Análise de rentabilidade com margem percentual
- **Filtros**: Multi-dimensional (tipo + commodity + período)

### 📄 **Documentação**
- **Novo arquivo:** `docs/BACKEND-TODO.md`
  - Checklist completo de desenvolvimento
  - 5 fases: NestJS, Go, ML, Infraestrutura, Testes
  - 6 sprints de 7 dias
  - Critérios de conclusão
  - Progresso: 35% → 40% completo

---

## [0.7.0] - 2026-01-29

### ✨ Adicionado

#### 📦 **Módulo MarketPrices Completo**
- **Service** (`MarketPricesService`):
  - CRUD completo com 5 operações básicas
  - Operações especiais:
    * `getLatestPrice()` - busca último preço de commodity
    * `getPriceTrend()` - calcula tendência (UP/DOWN/STABLE)
    * `getPriceStatistics()` - estatísticas por período (min/max/avg)
    * `getAvailableCommodities()` - lista commodities disponíveis
  - Cálculo de tendências:
    * Compara preço atual vs período anterior (default: 7 dias)
    * Variação percentual calculada automaticamente
    * Classificação: UP (> 1%), DOWN (< -1%), STABLE
  - Estatísticas:
    * Preço mínimo, máximo, médio
    * Contagem de registros
    * Filtro por período de datas
  - Filtros avançados:
    * Por commodity (Soja, Milho, Café, etc)
    * Por mercado (CBOT, BM&F, etc)
    * Por período (startDate, endDate)
  
- **Resolver** (`MarketPricesResolver`):
  - 9 operações GraphQL:
    * Básicas: `createMarketPrice`, `marketPrices` (list), `marketPrice`, `updateMarketPrice`, `removeMarketPrice`
    * Especiais: `latestMarketPrice`, `marketPriceTrend`, `marketPriceStatistics`, `availableCommodities`
  - Filtros: commodity, market, período
  - Proteção com `JwtAuthGuard`

- **DTOs**:
  - `CreateMarketPriceInput` (commodity, market, price, currency, unit, timestamp, source?)
  - `UpdateMarketPriceInput` (price?)
  - Validações:
    * Commodity/market: máximo 100 caracteres
    * Price: mínimo 0
    * Currency: máximo 10 caracteres (default: BRL)
    * Unit: máximo 20 caracteres (default: kg)

- **Entities**:
  - `MarketPrice` - Preço com dados básicos
  - `MarketPriceTrend` - Análise de tendência (current, previous, changePercent, trend)
  - `MarketPriceStatistics` - Estatísticas agregadas (min, max, avg, count)

- **Testes** (`market-prices.service.spec.ts`):
  - ✅ 22 testes unitários passando (100% cobertura)
  - Cenários completos:
    - Criação (1 caso)
    - Listagem e filtros (4 casos - all/commodity/market/período)
    - Busca individual (2 casos)
    - Atualização (2 casos)
    - Remoção (2 casos)
    - Último preço (3 casos)
    - Tendências (4 casos - up/down/stable/not-found)
    - Estatísticas (2 casos)
    - Commodities disponíveis (1 caso)

#### 🗄️ **Database**
- Migration `make_market_price_source_optional`:
  * Campo `source` agora opcional (permite inserção sem fonte)

### 📊 **Estatísticas do Release**
- **Arquivos criados**: 8 (Service, Resolver, DTOs, Entities, Tests, Module, Migration)
- **Linhas de código**: ~1000 linhas
- **Testes**: 22/22 passando (100% cobertura)
- **Total de testes acumulados**: 115 (Plots: 18, Plantings: 21, Harvests: 17, ClimateData: 17, Alerts: 20, MarketPrices: 22)
- **Operações GraphQL**: 9 (5 básicas + 4 especiais)
- **Tempo de desenvolvimento**: ~40 minutos

### 🎯 **Funcionalidades de Análise**
- **Tendência de Preços**: Comparação automática com período anterior
- **Estatísticas**: Min/max/média para análise histórica
- **Filtros Avançados**: Multi-dimensional (commodity + market + período)
- **Preço em Tempo Real**: Busca último preço registrado

---

## [0.6.0] - 2026-01-29

### ✨ Adicionado

#### 📦 **Módulo Alerts Completo**
- **Service** (`AlertsService`):
  - CRUD completo com 5 operações básicas
  - Operações especiais:
    * `markAsRead()` - marca alerta como lido
    * `markAsResolved()` - marca alerta como resolvido
    * `markAsDismissed()` - marca alerta como descartado
    * `markAllAsRead()` - marca todos pendentes como lidos
    * `countUnread()` - conta alertas não lidos
    * `removeExpired()` - remove alertas expirados
  - Filtros avançados:
    * Por tipo (WEATHER, MARKET, DISEASE, PEST, HARVEST, IRRIGATION)
    * Por status (PENDING, READ, RESOLVED, DISMISSED)
    * Por severidade (LOW, MEDIUM, HIGH, CRITICAL)
    * Apenas alertas ativos (não expirados)
  - Sistema de expiração de alertas
  - Metadata JSON para dados adicionais
  - Validações de ownership (usuário)
  
- **Resolver** (`AlertsResolver`):
  - 12 operações GraphQL:
    * Básicas: `createAlert`, `alerts` (list), `alert`, `updateAlert`, `removeAlert`
    * Especiais: `markAlertAsRead`, `markAlertAsResolved`, `markAlertAsDismissed`
    * Bulk: `markAllAlertsAsRead`, `removeExpiredAlerts`
    * Query: `unreadAlertsCount`
  - Filtros: tipo, status, apenas ativos
  - Proteção com `JwtAuthGuard`

- **DTOs**:
  - `CreateAlertInput` (type, severity, title, message, metadata?, expiresAt?)
  - `UpdateAlertInput` (status?)
  - Enums exportados para GraphQL:
    * `AlertType`: 6 tipos (WEATHER, MARKET, DISEASE, PEST, HARVEST, IRRIGATION)
    * `AlertSeverity`: 4 níveis (LOW, MEDIUM, HIGH, CRITICAL)
    * `AlertStatus`: 4 estados (PENDING, READ, RESOLVED, DISMISSED)
  - Validações:
    * Título: máximo 200 caracteres
    * Mensagem: máximo 1000 caracteres
    * Metadata: string JSON opcional

- **Entities**:
  - `Alert` entity com campos completos
  - Relação com User
  - Campos timestamp (createdAt, updatedAt)
  - Campo expiresAt opcional para alertas temporários

- **Testes** (`alerts.service.spec.ts`):
  - ✅ 20 testes unitários passando (100% cobertura)
  - Cenários completos:
    - Criação (3 casos - básico/com metadata/com expiração)
    - Listagem e filtros (4 casos - all/tipo/status/ativos)
    - Busca individual (2 casos)
    - Atualização (2 casos)
    - Remoção (2 casos)
    - Operações especiais (7 casos - read/resolved/dismissed/all-read/count/expired)

### 📊 **Estatísticas do Release**
- **Arquivos criados**: 7 (Service, Resolver, DTOs, Entity, Tests, Module)
- **Linhas de código**: ~900 linhas
- **Testes**: 20/20 passando (100% cobertura)
- **Total de testes acumulados**: 93 (Plots: 18, Plantings: 21, Harvests: 17, ClimateData: 17, Alerts: 20)
- **Operações GraphQL**: 12 (5 básicas + 7 especiais)
- **Tempo de desenvolvimento**: ~35 minutos

---

## [0.5.0] - 2026-01-29

### ✨ Adicionado

#### 📦 **Módulo ClimateData Completo**
- **Service** (`ClimateDataService`):
  - CRUD completo com 5 operações básicas
  - Integração com API OpenWeather:
    * `fetchFromOpenWeather()` busca dados em tempo real
    * Utiliza coordenadas da fazenda (latitude/longitude)
    * Suporta temperatura, umidade, precipitação, vento
  - Estatísticas climáticas:
    * `getStatistics()` calcula médias e totais por período
    * Temperatura média, umidade média, precipitação total, vento médio
  - Filtros avançados:
    * Por fazenda (farmId)
    * Por período (startDate, endDate)
  - Validações robustas:
    * Ownership de fazenda verificado
    * Ranges de valores validados (temp: -50 a 60°C, humidity: 0-100%)
  - Logging detalhado de operações
  
- **Resolver** (`ClimateDataResolver`):
  - 6 operações GraphQL:
    * `createClimateData`, `climateData` (list), `climateDataItem`
    * `updateClimateData`, `removeClimateData`
    * `fetchWeatherData` (busca dados externos)
  - Filtros: por fazenda e período de datas
  - Documentação inline para GraphQL Playground
  - Proteção com `JwtAuthGuard`

- **DTOs**:
  - `CreateClimateDataInput` (farmId, date, temperature, humidity, rainfall, windSpeed, solarRadiation, source)
  - `UpdateClimateDataInput` (todos campos opcionais)
  - Validações com ranges:
    * Temperatura: -50°C a 60°C
    * Umidade: 0% a 100%
    * Precipitação: mínimo 0mm
    * Vento: 0 a 100 km/h
    * Radiação solar: 0 a 100,000 W/m²

- **Entities**:
  - `ClimateData` entity com campos:
    * Dados climáticos básicos (temp, humidity, rainfall)
    * Dados avançados opcionais (windSpeed, solarRadiation)
    * Relações: Farm (obrigatória), Planting (opcional)
    * Campo source para rastreabilidade (OpenWeather, INMET, etc)
  - Documentação JSDoc completa

- **Testes** (`climate-data.service.spec.ts`):
  - ✅ 17 testes unitários passando (100% cobertura)
  - Cenários completos:
    - Criação com validações (2 casos)
    - Listagem e filtros complexos (3 casos - all/farmId/period)
    - Busca individual (2 casos)
    - Atualização (2 casos)
    - Remoção (2 casos)
    - Integração OpenWeather (3 casos - success/no-coords/no-api-key)
    - Estatísticas (2 casos - com e sem dados)
  - Mocks do HttpService para APIs externas

#### 🛠️ **Infraestrutura**
- Instalação do `@nestjs/axios` e `axios` para integração HTTP
- HttpModule configurado no ClimateDataModule
- Suporte para variável de ambiente `OPENWEATHER_API_KEY`

#### 🗄️ **Database**
- Migration `update_climate_data_schema`:
  * Adicionado campo `farmId` obrigatório
  * Campo `date` substituindo `timestamp`
  * Campo `solarRadiation` substituindo `pressure`
  * Campo `source` agora opcional
  * Relação com Farm adicionada
  * Índices otimizados: `[farmId, date]` e `[plantingId]`
  * Latitude/longitude da Farm agora opcionais

### 📊 **Estatísticas do Release**
- **Arquivos criados**: 7 (Service, Resolver, DTOs, Entity, Tests, Module, Migration)
- **Linhas de código**: ~850 linhas
- **Testes**: 17/17 passando (100% cobertura)
- **Total de testes acumulados**: 73 (Plots: 18, Plantings: 21, Harvests: 17, ClimateData: 17)
- **Tempo de desenvolvimento**: ~40 minutos

---

## [0.4.0] - 2026-01-29

### ✨ Adicionado

#### 📦 **Módulo Harvests Completo**
- **Service** (`HarvestsService`):
  - CRUD completo com 5 operações
  - Cálculos automáticos:
    * Produtividade (kg/ha) = quantidade / área do plantio
    * Valor total (R$) = quantidade * preço
  - Atualização automática do plantio:
    * Define actualYield na primeira colheita
    * Atualiza actualHarvest
  - Validações robustas:
    * Ownership de plantio verificado
    * Plantio deve estar com status HARVESTED
  - Logging detalhado de operações
  
- **Resolver** (`HarvestsResolver`):
  - 5 operações GraphQL: `createHarvest`, `harvests`, `harvest`, `updateHarvest`, `removeHarvest`
  - Filtro: por plantio
  - Documentação inline para GraphQL Playground
  - Proteção com `GqlAuthGuard`

- **DTOs**:
  - `CreateHarvestInput` (plantingId, harvestDate, quantity, quality, price, notes)
  - `UpdateHarvestInput` (quality, price, notes)
  - Validações com mensagens em português

- **Entities**:
  - `Harvest` entity com campos calculados (productivity, totalValue)
  - PlantingSimplified para evitar dependências circulares
  - Documentação JSDoc completa

- **Testes** (`harvests.service.spec.ts`):
  - ✅ 17 testes unitários passando (100% cobertura)
  - Cenários completos:
    - Criação com cálculos (6 casos)
    - Listagem e filtros (2 casos)
    - Busca individual (3 casos)
    - Atualização com recálculo (3 casos)
    - Remoção (3 casos)
  - Mocks do Prisma para isolamento

---

## [0.3.0] - 2026-01-29

### ✨ Adicionado

#### 📦 **Módulo Plantings Completo**
- **Service** (`PlantingsService`):
  - CRUD completo com 5 operações
  - Validações robustas:
    * Ownership de talhão verificado
    * Datas validadas (plantingDate < expectedHarvest)
    * Área disponível no talhão calculada
    * Transições de status controladas (PLANNED → IN_PROGRESS → HARVESTED/FAILED)
    * Proteção contra deleção com colheitas registradas
  - Logging detalhado de operações
  
- **Resolver** (`PlantingsResolver`):
  - 5 operações GraphQL: `createPlanting`, `plantings`, `planting`, `updatePlanting`, `removePlanting`
  - Filtros: por talhão e por status
  - Documentação inline para GraphQL Playground
  - Proteção com `GqlAuthGuard`

- **DTOs**:
  - `CreatePlantingInput` com validações (plotId, cropType, variety, area, datas, estimatedYield)
  - `UpdatePlantingInput` com status, actualHarvest, actualYield, notes
  - `PlantingStatus` enum (PLANNED, IN_PROGRESS, HARVESTED, FAILED)
  - Mensagens de erro em português

- **Entities**:
  - `Planting` entity com relações para Plot e Harvests
  - PlotSimplified e HarvestSimplified para evitar dependências circulares
  - Documentação JSDoc completa

- **Testes** (`plantings.service.spec.ts`):
  - ✅ 21 testes unitários passando (100% cobertura)
  - Cenários completos:
    - Criação com validações (6 casos)
    - Listagem e filtros (3 casos)
    - Busca individual (3 casos)
    - Atualização com transições de status (5 casos)
    - Remoção (4 casos)
  - Mocks do Prisma para isolamento

#### 🗄️ **Database**
- Campo `area` adicionado ao modelo Planting
- Índices criados: `plotId`, `status`
- Migration: `add_planting_area_and_indexes`

---

## [0.2.0] - 2026-01-29

### ✨ Adicionado

#### 📦 **Módulo Plots Completo**
- **Service** (`PlotsService`):
  - CRUD completo com validações robustas
  - Validação de área disponível na fazenda
  - Prevenção de nomes duplicados
  - Proteção contra remoção de talhões com plantios ativos
  - Logging detalhado de operações
  
- **Resolver** (`PlotsResolver`):
  - 5 operações GraphQL: `createPlot`, `plots`, `plot`, `updatePlot`, `removePlot`
  - Documentação inline para GraphQL Playground
  - Proteção com `GqlAuthGuard`
  - Validação de ownership

- **DTOs**:
  - `CreatePlotInput` com validações (nome, área, farmId, soilType)
  - `UpdatePlotInput` com campos opcionais
  - Mensagens de erro customizadas

- **Entities**:
  - `Plot` entity com relações para Farm e Plantings
  - Documentação JSDoc completa

- **Testes** (`plots.service.spec.ts`):
  - ✅ 18 testes unitários passando
  - Cobertura completa de cenários:
    - Criação com validações (6 casos)
    - Listagem e filtros (3 casos)
    - Busca individual (3 casos)
    - Atualização (3 casos)
    - Remoção (3 casos)
  - Mocks do Prisma para isolamento

#### 🏗️ **Infraestrutura de Desenvolvimento**

- **ADRs** (Architecture Decision Records):
  - ADR-001: NestJS como Framework Backend
  - ADR-002: GraphQL para API
  - Estrutura e template para novas decisões

- **Documentação Profissional**:
  - `CONTRIBUTING.md` - Guia de contribuição completo
  - `CHANGELOG.md` - Histórico de mudanças (este arquivo)
  - Code standards e best practices
  - Commit message conventions

- **Logger Service**:
  - Sistema de logging customizado
  - Contextos para rastreamento
  - Métodos especializados: `logDatabase`, `logRequest`, `logAuth`
  - Documentação JSDoc completa
  - Preparado para integração com Winston/ELK

#### 🔧 Melhorias

- **Documentação de Código**:
  - JSDoc em todos os services e resolvers
  - Descrições GraphQL em mutations/queries
  - Exemplos de uso inline
  - Comentários explicativos em lógica complexa

- **Validações**:
  - Verificação de ownership em todas operações
  - Validação de área total vs disponível
  - Prevenção de duplicatas
  - Guards de status (plantios ativos)

---

## [0.1.0] - 2026-01-29

### 🎉 Lançamento Inicial - MVP Foundation

#### ✨ Adicionado
- **Backend NestJS**
  - Estrutura modular com TypeScript
  - API GraphQL com Apollo Server
  - Hot reload em desenvolvimento
  - Validação de DTOs com class-validator

- **Autenticação**
  - JWT authentication (access + refresh tokens)
  - Passport strategy
  - Guards para rotas protegidas
  - Hash de senhas com bcrypt
  - Refresh token rotation

- **Módulos Implementados**
  - `AuthModule`: Login, registro, refresh token, logout
  - `UsersModule`: Perfil de usuário, CRUD básico
  - `FarmsModule`: Gestão de fazendas

- **Banco de Dados**
  - PostgreSQL 16 com Prisma ORM
  - Redis 7 para cache
  - Schema com 12 models:
    - Users, RefreshTokens
    - Farms, Plots, Plantings, Harvests
    - ClimateData, Alerts
    - MarketPrice, Transactions
    - MLPrediction
  - Migrations iniciais

- **Infraestrutura**
  - Docker Compose para desenvolvimento
  - Containers: PostgreSQL, Redis
  - Scripts de inicialização
  - Health checks nos containers

- **Documentação**
  - `INICIO-RAPIDO.md` - Guia de início
  - `COMO-CONTINUAR.md` - Guia de desenvolvimento
  - `STATUS-ATUAL.md` - Status do projeto
  - `PLANO-BACKEND.md` - Roadmap 12 meses
  - `ARQUITETURA-BACKEND.md` - Arquitetura técnica
  - `RESUMO-EXECUTIVO.md` - Resumo executivo
  - ADRs (Architecture Decision Records)

- **DevOps**
  - `.env.example` com todas variáveis
  - `.gitignore` configurado
  - ESLint + Prettier
  - Scripts npm organizados

#### 🔧 Configurado
- TypeScript 5.3 com strict mode
- NestJS 10.3 com decorators
- Prisma 5.8 com client generation
- GraphQL Code-First approach
- CORS habilitado para localhost:3000

#### 🎯 API Endpoints

**Mutations:**
- `register` - Cadastro de usuário
- `login` - Autenticação
- `refreshToken` - Renovar token
- `logout` - Deslogar
- `updateProfile` - Atualizar perfil
- `createFarm` - Criar fazenda
- `updateFarm` - Atualizar fazenda
- `removeFarm` - Remover fazenda

**Queries:**
- `me` - Dados do usuário logado
- `farms` - Listar fazendas
- `farm(id)` - Buscar fazenda específica

#### 📊 Métricas
- 32 arquivos TypeScript criados
- 12 database models
- 3 módulos NestJS funcionais
- 8 mutations + 3 queries
- 0 breaking changes (primeira versão)

---

## Como Contribuir

Ao adicionar entradas ao changelog:

### Categorias
- `✨ Adicionado` - Novas features
- `🔧 Modificado` - Mudanças em features existentes
- `🗑️ Deprecated` - Features que serão removidas
- `🚫 Removido` - Features removidas
- `🐛 Corrigido` - Bug fixes
- `🔒 Segurança` - Vulnerabilidades corrigidas

### Formato da Entrada
```markdown
- **Módulo/Área**: Descrição curta da mudança ([#123](link-pr))
```

### Exemplo
```markdown
### ✨ Adicionado
- **Auth**: Implementado 2FA com TOTP (#45)
- **Farms**: Adicionado campo `certification` (#47)

### 🐛 Corrigido
- **API**: Corrigido memory leak em websockets (#50)
```

---

## Versionamento

Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

Exemplo: `1.2.3` = Major.Minor.Patch

---

## Links
- [Repositório](https://github.com/seu-usuario/lavra.ai)
- [Issues](https://github.com/seu-usuario/lavra.ai/issues)
- [Pull Requests](https://github.com/seu-usuario/lavra.ai/pulls)
