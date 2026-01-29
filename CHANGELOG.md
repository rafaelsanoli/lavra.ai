# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### 🚀 Em Desenvolvimento
- Simulations module
- WebSockets (Socket.io)
- Bull queues para jobs assíncronos
- Microserviços Go
- Machine Learning (Python/FastAPI)
- Testes E2E

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
