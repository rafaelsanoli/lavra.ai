# 🏗️ ARQUITETURA TÉCNICA DO BACKEND - LAVRA.IA

> Especificação técnica detalhada da arquitetura, fluxos de dados e integrações

---

## 📋 Sumário

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Fluxo de Dados](#fluxo-de-dados)
3. [Schemas de Banco de Dados](#schemas-de-banco-de-dados)
4. [APIs e Contratos](#apis-e-contratos)
5. [Comunicação entre Serviços](#comunicação-entre-serviços)
6. [Segurança](#segurança)
7. [Escalabilidade](#escalabilidade)

---

## 🏛️ Visão Geral da Arquitetura

### Diagrama de Alto Nível

```
┌──────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐               │
│  │   Web App        │    │   Mobile App     │               │
│  │   (Next.js)      │    │  (React Native)  │               │
│  └────────┬─────────┘    └────────┬─────────┘               │
│           │                       │                          │
│           └───────────┬───────────┘                          │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                       API GATEWAY                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  - Rate Limiting                                       │  │
│  │  - Authentication (JWT)                                │  │
│  │  - Request Routing                                     │  │
│  │  - Response Caching                                    │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
           ▼            ▼            ▼
┌────────────────┐ ┌────────────┐ ┌──────────────┐
│  BACKEND API   │ │ Go Services│ │  ML Service  │
│   (NestJS)     │ │  - Climate │ │   (Python)   │
│                │ │  - Market  │ │              │
│  - GraphQL     │ │  - Decision│ │  - FastAPI   │
│  - WebSocket   │ │  - Alerts  │ │  - Inference │
│  - Business    │ │            │ │  - Training  │
│  - Orchestrat. │ │  - gRPC    │ │              │
└───────┬────────┘ └─────┬──────┘ └──────┬───────┘
        │                │               │
        └────────────────┼───────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
┌─────────────────┐ ┌──────────────┐ ┌─────────────┐
│  PostgreSQL     │ │ TimescaleDB  │ │   Redis     │
│  (Dados core)   │ │ (Séries temp)│ │  (Cache)    │
└─────────────────┘ └──────────────┘ └─────────────┘
```

---

## 🔄 Fluxo de Dados

### 1. Fluxo de Autenticação

```
Cliente                  API Gateway              Backend API          Database
  │                          │                        │                  │
  │─────── POST /login ─────>│                        │                  │
  │                          │──── Validate & Route ─>│                  │
  │                          │                        │─── Query User ──>│
  │                          │                        │<─── User Data ───│
  │                          │<──── JWT + Refresh ────│                  │
  │<─── JWT + Refresh ───────│                        │                  │
  │                          │                        │                  │
  │─── Request + JWT ───────>│                        │                  │
  │                          │──── Verify JWT ───────>│                  │
  │                          │<──── Payload ──────────│                  │
  │                          │──── Forward Request ───>│                  │
  │<─── Response ────────────│<─── Response ──────────│                  │
```

### 2. Fluxo de Dashboard (Dados Agregados)

```
Cliente        API Gateway     Backend API     Climate Service   Market Service    ML Service
  │                │               │                  │                 │               │
  │─── Query ─────>│               │                  │                 │               │
  │ Dashboard      │── Route ─────>│                  │                 │               │
  │                │               │─── gRPC Call ───>│                 │               │
  │                │               │<── Weather Data ─│                 │               │
  │                │               │─── gRPC Call ──────────────────────>│               │
  │                │               │<── Quotes Data ──────────────────────│               │
  │                │               │─── gRPC Call ──────────────────────────────────────>│
  │                │               │<── Predictions ──────────────────────────────────────│
  │                │               │ (Aggregate data)                   │               │
  │                │<── GraphQL ───│                  │                 │               │
  │<── Response ───│               │                  │                 │               │
```

### 3. Fluxo de Ingestão de Dados Climáticos

```
INMET/NASA       Climate Service      TimescaleDB        Alert Worker
    │                   │                   │                  │
    │<── Poll Data ─────│                   │                  │
    │─── Raw Data ─────>│                   │                  │
    │                   │─── Normalize ─────│                  │
    │                   │─── Insert ───────>│                  │
    │                   │                   │                  │
    │                   │─── Check Rules ──────────────────────>│
    │                   │                   │   (If threshold) │
    │                   │<──────────────────────── Emit Alert ──│
```

---

## 🗄️ Schemas de Banco de Dados

### PostgreSQL (Backend Principal)

**Esquema Completo MVP:**

```sql
-- ==============================================
-- AUTENTICAÇÃO E USUÁRIOS
-- ==============================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'FARMER', 'AGRONOMIST', 'VIEWER');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'FARMER',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- ==============================================
-- FAZENDAS E TALHÕES
-- ==============================================

CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    total_area_ha DECIMAL(10, 2) NOT NULL,
    location JSONB, -- GeoJSON Point {type: "Point", coordinates: [lon, lat]}
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    country VARCHAR(2) DEFAULT 'BR',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_farms_owner ON farms(owner_id);
CREATE INDEX idx_farms_location ON farms USING GIN(location);
CREATE INDEX idx_farms_deleted ON farms(deleted_at) WHERE deleted_at IS NULL;

CREATE TYPE soil_type AS ENUM ('SANDY', 'CLAY', 'SILTY', 'LOAMY', 'PEATY', 'CHALKY');

CREATE TABLE plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    area_ha DECIMAL(10, 2) NOT NULL,
    geometry JSONB, -- GeoJSON Polygon
    soil_type soil_type,
    has_irrigation BOOLEAN DEFAULT FALSE,
    elevation_m DECIMAL(8, 2),
    slope_degree DECIMAL(5, 2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plots_farm ON plots(farm_id);
CREATE INDEX idx_plots_geometry ON plots USING GIN(geometry);

-- ==============================================
-- SAFRAS E CULTURAS
-- ==============================================

CREATE TABLE harvests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id),
    name VARCHAR(255) NOT NULL, -- ex: "Safra 2024/2025"
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CANCELLED
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_harvests_farm ON harvests(farm_id);
CREATE INDEX idx_harvests_year ON harvests(start_year, end_year);

CREATE TYPE crop_type AS ENUM ('SOYBEAN', 'CORN', 'COTTON', 'COFFEE', 'SUGARCANE', 'WHEAT', 'BEANS', 'RICE');

CREATE TABLE plot_crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID NOT NULL REFERENCES plots(id),
    harvest_id UUID NOT NULL REFERENCES harvests(id),
    crop crop_type NOT NULL,
    variety VARCHAR(100),
    planting_date DATE NOT NULL,
    expected_harvest DATE,
    actual_harvest DATE,
    yield_per_ha DECIMAL(8, 2), -- sacas/hectare (após colheita)
    
    -- Custos (calculados)
    cost_per_ha DECIMAL(10, 2),
    total_cost DECIMAL(12, 2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plot_crops_plot ON plot_crops(plot_id);
CREATE INDEX idx_plot_crops_harvest ON plot_crops(harvest_id);
CREATE INDEX idx_plot_crops_dates ON plot_crops(planting_date, expected_harvest);

-- ==============================================
-- ALERTAS
-- ==============================================

CREATE TYPE alert_type AS ENUM ('CLIMATE', 'MARKET', 'OPERATION', 'PEST', 'EQUIPMENT', 'REGULATORY');
CREATE TYPE alert_severity AS ENUM ('CRITICAL', 'ATTENTION', 'INFO');

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    farm_id UUID REFERENCES farms(id),
    plot_id UUID REFERENCES plots(id),
    
    type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_recommended TEXT,
    
    -- Metadados
    metadata JSONB, -- Dados específicos do alerta
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

CREATE INDEX idx_alerts_user ON alerts(user_id, created_at DESC);
CREATE INDEX idx_alerts_farm ON alerts(farm_id);
CREATE INDEX idx_alerts_unread ON alerts(user_id, is_read) WHERE is_read = FALSE;

-- ==============================================
-- SIMULAÇÕES E PREVISÕES
-- ==============================================

CREATE TABLE simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    farm_id UUID NOT NULL REFERENCES farms(id),
    harvest_id UUID REFERENCES harvests(id),
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Parâmetros da simulação
    parameters JSONB NOT NULL, -- {climateScenario, priceScenario, yieldAssumptions, etc}
    
    -- Resultados
    results JSONB NOT NULL, -- {projectedYield, projectedRevenue, projectedProfit, riskScore, etc}
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_simulations_user ON simulations(user_id);
CREATE INDEX idx_simulations_farm ON simulations(farm_id);
CREATE INDEX idx_simulations_created ON simulations(created_at DESC);

-- ==============================================
-- CACHE DE PREDIÇÕES ML
-- ==============================================

CREATE TABLE ml_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_crop_id UUID NOT NULL REFERENCES plot_crops(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL, -- 'yield_lstm_v1', 'price_ensemble_v1', etc
    model_version VARCHAR(20) NOT NULL,
    
    -- Predição
    prediction_type VARCHAR(50) NOT NULL, -- 'yield', 'price', 'risk', etc
    predicted_value DECIMAL(12, 4) NOT NULL,
    confidence_lower DECIMAL(12, 4),
    confidence_upper DECIMAL(12, 4),
    confidence_score DECIMAL(5, 4),
    
    -- Metadata
    features_used JSONB, -- Features que foram usadas
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ -- Cache expiration
);

CREATE INDEX idx_ml_predictions_plot_crop ON ml_predictions(plot_crop_id);
CREATE INDEX idx_ml_predictions_type ON ml_predictions(prediction_type);
CREATE INDEX idx_ml_predictions_valid ON ml_predictions(valid_until) WHERE valid_until > NOW();

-- ==============================================
-- TRIGGERS
-- ==============================================

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plots_updated_at BEFORE UPDATE ON plots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plot_crops_updated_at BEFORE UPDATE ON plot_crops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### TimescaleDB (Séries Temporais - Climate Service)

```sql
-- Dados climáticos
CREATE TABLE climate_data (
    time TIMESTAMPTZ NOT NULL,
    station_id VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    
    -- Temperatura (°C)
    temp_c DECIMAL(5, 2),
    temp_min_c DECIMAL(5, 2),
    temp_max_c DECIMAL(5, 2),
    feels_like_c DECIMAL(5, 2),
    
    -- Precipitação (mm)
    precip_mm DECIMAL(6, 2),
    precip_intensity VARCHAR(20), -- light, moderate, heavy
    
    -- Umidade (%)
    humidity_pct DECIMAL(5, 2),
    dew_point_c DECIMAL(5, 2),
    
    -- Vento (m/s e graus)
    wind_speed_ms DECIMAL(5, 2),
    wind_dir_deg DECIMAL(5, 2),
    wind_gust_ms DECIMAL(5, 2),
    
    -- Radiação solar (MJ/m²)
    solar_rad_mj DECIMAL(6, 2),
    
    -- Pressão atmosférica (hPa)
    pressure_hpa DECIMAL(6, 2),
    
    -- Evapotranspiração (mm)
    evapotranspiration_mm DECIMAL(6, 2),
    
    -- Metadados
    source VARCHAR(20), -- 'INMET', 'NASA_POWER', 'CPTEC'
    quality VARCHAR(10), -- 'RAW', 'VALIDATED', 'ESTIMATED'
    
    PRIMARY KEY (time, station_id)
);

-- Criar hypertable
SELECT create_hypertable('climate_data', 'time');

-- Continuous aggregates
CREATE MATERIALIZED VIEW climate_daily
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS day,
    station_id,
    latitude,
    longitude,
    AVG(temp_c) as temp_avg_c,
    MIN(temp_min_c) as temp_min_c,
    MAX(temp_max_c) as temp_max_c,
    SUM(precip_mm) as precip_total_mm,
    AVG(humidity_pct) as humidity_avg_pct,
    AVG(solar_rad_mj) as solar_rad_avg_mj,
    AVG(evapotranspiration_mm) as et_avg_mm
FROM climate_data
GROUP BY day, station_id, latitude, longitude;

-- Índices espaciais
CREATE INDEX idx_climate_location ON climate_data (latitude, longitude, time DESC);
CREATE INDEX idx_climate_station ON climate_data (station_id, time DESC);
CREATE INDEX idx_climate_source ON climate_data (source, time DESC);

-- Retention policy (manter dados brutos por 90 dias)
SELECT add_retention_policy('climate_data', INTERVAL '90 days');

-- Previsões climáticas
CREATE TABLE climate_forecasts (
    time TIMESTAMPTZ NOT NULL,
    forecast_for TIMESTAMPTZ NOT NULL, -- Data prevista
    source VARCHAR(20), -- 'CPTEC', 'INMET'
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    
    temp_c DECIMAL(5, 2),
    temp_min_c DECIMAL(5, 2),
    temp_max_c DECIMAL(5, 2),
    precip_mm DECIMAL(6, 2),
    precip_probability DECIMAL(5, 2), -- %
    humidity_pct DECIMAL(5, 2),
    wind_speed_ms DECIMAL(5, 2),
    
    confidence DECIMAL(5, 4), -- 0-1
    
    PRIMARY KEY (time, forecast_for, latitude, longitude)
);

SELECT create_hypertable('climate_forecasts', 'time');
```

### PostgreSQL (Market Service)

```sql
-- Contratos futuros
CREATE TABLE futures_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL, -- 'SOJA_JAN25', 'MILH_MAR25'
    commodity VARCHAR(20) NOT NULL, -- 'SOYBEAN', 'CORN', 'COTTON'
    maturity_date DATE NOT NULL,
    exchange VARCHAR(10) NOT NULL, -- 'B3'
    tick_size DECIMAL(10, 4), -- Tamanho do tick
    contract_size INTEGER, -- Sacas por contrato (ex: 27.000 para soja)
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(symbol, maturity_date)
);

-- Cotações (usar TimescaleDB também, mas aqui simplificado)
CREATE TABLE quotes (
    id BIGSERIAL PRIMARY KEY,
    contract_id UUID NOT NULL REFERENCES futures_contracts(id),
    timestamp TIMESTAMPTZ NOT NULL,
    
    -- Preços (R$/saca)
    open DECIMAL(10, 2),
    high DECIMAL(10, 2),
    low DECIMAL(10, 2),
    close DECIMAL(10, 2),
    settle DECIMAL(10, 2), -- Preço de ajuste
    
    -- Volume
    volume BIGINT,
    open_interest BIGINT,
    
    -- Número de negócios
    trades INTEGER,
    
    -- Metadados
    source VARCHAR(20) DEFAULT 'B3',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(contract_id, timestamp)
);

CREATE INDEX idx_quotes_contract_time ON quotes(contract_id, timestamp DESC);
CREATE INDEX idx_quotes_timestamp ON quotes(timestamp DESC);

-- Cotações físicas (tradings)
CREATE TABLE physical_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trading_company VARCHAR(100) NOT NULL, -- 'CARGILL', 'BUNGE', etc
    commodity VARCHAR(20) NOT NULL,
    region VARCHAR(100), -- 'MT', 'PR', 'RS'
    city VARCHAR(100),
    
    -- Preços (R$/saca)
    bid DECIMAL(10, 2), -- Preço de compra
    ask DECIMAL(10, 2), -- Preço de venda
    spread DECIMAL(10, 2), -- Diferença
    
    -- Condições
    delivery_terms VARCHAR(100), -- 'CIF', 'FOB', 'Posto Fazenda'
    payment_terms VARCHAR(100),
    
    timestamp TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_physical_quotes_commodity ON physical_quotes(commodity, timestamp DESC);
CREATE INDEX idx_physical_quotes_region ON physical_quotes(region, timestamp DESC);
```

---

## 📡 APIs e Contratos

### GraphQL API (Backend Principal)

**Schema Principal:**

```graphql
# ==============================================
# TYPES
# ==============================================

scalar DateTime
scalar JSON
scalar Decimal

enum UserRole {
  ADMIN
  FARMER
  AGRONOMIST
  VIEWER
}

type User {
  id: ID!
  email: String!
  name: String!
  phone: String
  avatarUrl: String
  role: UserRole!
  farms: [Farm!]!
  createdAt: DateTime!
}

type Farm {
  id: ID!
  name: String!
  totalAreaHa: Decimal!
  location: JSON
  address: String
  city: String
  state: String
  owner: User!
  plots: [Plot!]!
  harvests: [Harvest!]!
  currentHarvest: Harvest
  
  # Computed fields
  climateData(period: Period): [ClimateDataPoint!]!
  marketQuotes(commodities: [CropType!]): [MarketQuote!]!
  activeAlerts: [Alert!]!
}

enum SoilType {
  SANDY
  CLAY
  SILTY
  LOAMY
  PEATY
  CHALKY
}

type Plot {
  id: ID!
  name: String!
  areaHa: Decimal!
  geometry: JSON
  soilType: SoilType
  hasIrrigation: Boolean!
  farm: Farm!
  crops: [PlotCrop!]!
  
  # Computed fields
  riskScore: RiskScore
  ndvi: NDVIData
}

enum CropType {
  SOYBEAN
  CORN
  COTTON
  COFFEE
  SUGARCANE
  WHEAT
  BEANS
  RICE
}

type PlotCrop {
  id: ID!
  plot: Plot!
  harvest: Harvest!
  crop: CropType!
  variety: String
  plantingDate: DateTime!
  expectedHarvest: DateTime
  actualHarvest: DateTime
  yieldPerHa: Decimal
  
  # ML Predictions
  yieldPrediction: YieldPrediction
  riskAnalysis: RiskAnalysis
}

type Harvest {
  id: ID!
  name: String!
  startYear: Int!
  endYear: Int!
  status: String!
  farm: Farm!
  crops: [PlotCrop!]!
  
  # Aggregated data
  totalArea: Decimal!
  projectedYield: Decimal
  projectedRevenue: Decimal
}

# ==============================================
# ML PREDICTIONS
# ==============================================

type YieldPrediction {
  predicted: Decimal!
  confidenceInterval: [Decimal!]! # [lower, upper]
  confidence: Float!
  factors: JSON # Feature importance
  updatedAt: DateTime!
}

type RiskScore {
  score: Int! # 0-100
  level: RiskLevel!
  factors: [RiskFactor!]!
}

enum RiskLevel {
  LOW
  MODERATE
  HIGH
  CRITICAL
}

type RiskFactor {
  name: String!
  impact: Int! # -100 a +100
  description: String!
}

type RiskAnalysis {
  totalRisk: Decimal!
  climateRisk: Decimal!
  marketRisk: Decimal!
  operationalRisk: Decimal!
  recommendations: [String!]!
}

# ==============================================
# CLIMATE DATA
# ==============================================

enum Period {
  NEXT_7_DAYS
  NEXT_15_DAYS
  NEXT_30_DAYS
  LAST_30_DAYS
  LAST_90_DAYS
}

type ClimateDataPoint {
  date: DateTime!
  tempMin: Decimal
  tempMax: Decimal
  tempAvg: Decimal
  precipitation: Decimal
  humidity: Decimal
  windSpeed: Decimal
  solarRadiation: Decimal
  isForecast: Boolean!
}

# ==============================================
# MARKET DATA
# ==============================================

type MarketQuote {
  commodity: CropType!
  currentPrice: Decimal!
  change24h: Decimal!
  changePercent: Float!
  volume: Int
  timestamp: DateTime!
  contracts: [FutureContract!]!
}

type FutureContract {
  symbol: String!
  maturityDate: DateTime!
  price: Decimal!
  open: Decimal
  high: Decimal
  low: Decimal
  volume: Int
}

# ==============================================
# ALERTS
# ==============================================

enum AlertType {
  CLIMATE
  MARKET
  OPERATION
  PEST
  EQUIPMENT
  REGULATORY
}

enum AlertSeverity {
  CRITICAL
  ATTENTION
  INFO
}

type Alert {
  id: ID!
  type: AlertType!
  severity: AlertSeverity!
  title: String!
  description: String!
  actionRecommended: String
  isRead: Boolean!
  isArchived: Boolean!
  createdAt: DateTime!
}

# ==============================================
# SIMULATIONS
# ==============================================

type Simulation {
  id: ID!
  name: String!
  description: String
  parameters: JSON!
  results: JSON!
  createdAt: DateTime!
}

input SimulationInput {
  farmId: ID!
  harvestId: ID
  name: String!
  parameters: JSON!
}

# ==============================================
# QUERIES
# ==============================================

type Query {
  # User
  me: User
  user(id: ID!): User
  
  # Farms
  farm(id: ID!): Farm
  farms: [Farm!]!
  
  # Plots
  plot(id: ID!): Plot
  
  # Harvests
  harvest(id: ID!): Harvest
  harvests(farmId: ID!): [Harvest!]!
  
  # Alerts
  alerts(filters: AlertFilters): [Alert!]!
  unreadAlertsCount: Int!
  
  # Simulations
  simulation(id: ID!): Simulation
  simulations(farmId: ID!): [Simulation!]!
  
  # Dashboard
  dashboard(farmId: ID!): DashboardData!
}

type DashboardData {
  farm: Farm!
  summary: FarmSummary!
  recentAlerts: [Alert!]!
  weatherForecast: [ClimateDataPoint!]!
  marketOverview: [MarketQuote!]!
  recommendations: [Recommendation!]!
}

type FarmSummary {
  totalArea: Decimal!
  plantedArea: Decimal!
  projectedYield: Decimal!
  projectedRevenue: Decimal!
  averageRiskScore: Int!
}

type Recommendation {
  id: ID!
  type: String!
  priority: Int!
  title: String!
  description: String!
  potentialImpact: Decimal # R$
  actions: [String!]!
}

input AlertFilters {
  types: [AlertType!]
  severities: [AlertSeverity!]
  isRead: Boolean
  startDate: DateTime
  endDate: DateTime
}

# ==============================================
# MUTATIONS
# ==============================================

type Mutation {
  # Auth
  register(input: RegisterInput!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  
  # Farms
  createFarm(input: FarmInput!): Farm!
  updateFarm(id: ID!, input: FarmInput!): Farm!
  deleteFarm(id: ID!): Boolean!
  
  # Plots
  createPlot(input: PlotInput!): Plot!
  updatePlot(id: ID!, input: PlotInput!): Plot!
  deletePlot(id: ID!): Boolean!
  
  # Harvests
  createHarvest(input: HarvestInput!): Harvest!
  createPlotCrop(input: PlotCropInput!): PlotCrop!
  updatePlotCrop(id: ID!, input: PlotCropInput!): PlotCrop!
  
  # Alerts
  markAlertAsRead(id: ID!): Alert!
  markAllAlertsAsRead: Boolean!
  archiveAlert(id: ID!): Alert!
  
  # Simulations
  createSimulation(input: SimulationInput!): Simulation!
  runSimulation(id: ID!): Simulation!
}

type AuthPayload {
  user: User!
  accessToken: String!
  refreshToken: String!
}

input RegisterInput {
  email: String!
  password: String!
  name: String!
  phone: String
}

input FarmInput {
  name: String!
  totalAreaHa: Decimal!
  location: JSON
  address: String
  city: String
  state: String
}

input PlotInput {
  farmId: ID!
  name: String!
  areaHa: Decimal!
  geometry: JSON
  soilType: SoilType
  hasIrrigation: Boolean
}

input HarvestInput {
  farmId: ID!
  name: String!
  startYear: Int!
  endYear: Int!
}

input PlotCropInput {
  plotId: ID!
  harvestId: ID!
  crop: CropType!
  variety: String
  plantingDate: DateTime!
  expectedHarvest: DateTime
}

# ==============================================
# SUBSCRIPTIONS
# ==============================================

type Subscription {
  alertCreated(userId: ID!): Alert!
  marketQuoteUpdated(commodities: [CropType!]): MarketQuote!
  weatherUpdated(farmId: ID!): ClimateDataPoint!
}
```

### REST APIs (Microserviços Go)

**Climate Service API:**

```yaml
openapi: 3.0.0
info:
  title: Climate Service API
  version: 1.0.0

paths:
  /climate/current:
    get:
      summary: Get current weather data
      parameters:
        - name: lat
          in: query
          required: true
          schema:
            type: number
        - name: lon
          in: query
          required: true
          schema:
            type: number
      responses:
        '200':
          description: Current weather data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ClimateData'
  
  /climate/forecast:
    get:
      summary: Get weather forecast
      parameters:
        - name: lat
          in: query
          required: true
        - name: lon
          in: query
          required: true
        - name: days
          in: query
          schema:
            type: integer
            default: 7
      responses:
        '200':
          description: Weather forecast
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ClimateData'

components:
  schemas:
    ClimateData:
      type: object
      properties:
        timestamp:
          type: string
          format: date-time
        tempC:
          type: number
        tempMinC:
          type: number
        tempMaxC:
          type: number
        precipMm:
          type: number
        humidityPct:
          type: number
        windSpeedMs:
          type: number
        solarRadMj:
          type: number
        source:
          type: string
```

**Market Service API:**

```yaml
openapi: 3.0.0
info:
  title: Market Service API
  version: 1.0.0

paths:
  /market/quotes:
    get:
      summary: Get current market quotes
      parameters:
        - name: commodities
          in: query
          schema:
            type: array
            items:
              type: string
      responses:
        '200':
          description: Market quotes
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Quote'
  
  /market/contracts:
    get:
      summary: Get futures contracts
      parameters:
        - name: commodity
          in: query
          required: true
        - name: maturityFrom
          in: query
        - name: maturityTo
          in: query
      responses:
        '200':
          description: Futures contracts
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/FutureContract'

components:
  schemas:
    Quote:
      type: object
      properties:
        commodity:
          type: string
        currentPrice:
          type: number
        change24h:
          type: number
        timestamp:
          type: string
          format: date-time
    
    FutureContract:
      type: object
      properties:
        symbol:
          type: string
        maturityDate:
          type: string
          format: date
        price:
          type: number
        volume:
          type: integer
```

**ML Service API (FastAPI):**

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

app = FastAPI(title="Lavra.ia ML API")

# ==============================================
# MODELS
# ==============================================

class YieldPredictionRequest(BaseModel):
    plot_id: str
    crop_type: str
    variety: Optional[str]
    planting_date: date
    soil_type: str
    has_irrigation: bool
    climate_features: List[float]  # Pré-processadas

class YieldPredictionResponse(BaseModel):
    plot_id: str
    predicted_yield: float  # sacas/ha
    confidence_interval: tuple[float, float]
    confidence: float  # 0-1
    feature_importance: dict[str, float]
    model_version: str

class RiskScoreRequest(BaseModel):
    plot_id: str
    plot_features: dict  # Todas as features do talhão

class RiskScoreResponse(BaseModel):
    plot_id: str
    risk_score: int  # 0-100
    risk_level: str  # LOW, MODERATE, HIGH, CRITICAL
    factors: List[dict]  # {name, impact, description}

# ==============================================
# ENDPOINTS
# ==============================================

@app.post("/predict/yield", response_model=YieldPredictionResponse)
async def predict_yield(request: YieldPredictionRequest):
    """
    Predicts yield for a plot based on features
    """
    # Lógica de inferência aqui
    pass

@app.post("/predict/risk", response_model=RiskScoreResponse)
async def predict_risk(request: RiskScoreRequest):
    """
    Calculates risk score for a plot
    """
    # Lógica de inferência aqui
    pass

@app.get("/health")
async def health():
    return {"status": "healthy", "models_loaded": True}

@app.get("/models")
async def list_models():
    return {
        "yield_prediction": {"version": "1.0", "accuracy": 0.92},
        "risk_classification": {"version": "1.0", "accuracy": 0.87}
    }
```

---

## 🔐 Segurança

### 1. Autenticação e Autorização

**JWT Token Structure:**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "FARMER",
  "iat": 1706531234,
  "exp": 1706534834
}
```

**Role-Based Access Control (RBAC):**
- **ADMIN:** Acesso total
- **FARMER:** Acesso às próprias fazendas
- **AGRONOMIST:** Leitura de fazendas associadas
- **VIEWER:** Apenas leitura

### 2. Segurança de Dados

- **Dados em trânsito:** TLS 1.3
- **Dados em repouso:** Encryption at rest (AWS RDS)
- **Secrets:** AWS Secrets Manager
- **Senhas:** bcrypt com cost 12

### 3. Rate Limiting

```typescript
// API Gateway
{
  publicEndpoints: {
    limit: 100,  // requests
    window: '15m'
  },
  authenticatedEndpoints: {
    limit: 1000,
    window: '15m'
  },
  mlEndpoints: {
    limit: 100,
    window: '1h'  // ML é mais custoso
  }
}
```

---

## 📈 Escalabilidade

### Estratégia de Scaling

| Componente | Estratégia | Trigger |
|------------|-----------|---------|
| **Backend API** | Horizontal (auto-scaling) | CPU > 70% |
| **Go Services** | Horizontal | CPU > 70% |
| **ML Service** | Vertical + GPU | Latência > 5s |
| **PostgreSQL** | Vertical (read replicas futuramente) | Conexões > 80% |
| **Redis** | Cluster mode | Memória > 75% |

### Cache Strategy

```
┌──────────────┐
│   Browser    │  Cache: 5min (weather), 30s (quotes)
└──────┬───────┘
       │
┌──────▼───────┐
│  CloudFront  │  Cache: static assets, CDN
└──────┬───────┘
       │
┌──────▼───────┐
│ API Gateway  │  Cache: 30s-5min (configurável por endpoint)
└──────┬───────┘
       │
┌──────▼───────┐
│  Backend API │  Redis cache: 5min-1h
└──────┬───────┘
       │
┌──────▼───────┐
│  Database    │
└──────────────┘
```

---

**Documento criado em:** 29 de Janeiro de 2026
**Versão:** 1.0
**Status:** ✅ COMPLETO

Para detalhamento de implementação específica, consultar os READMEs de cada serviço:
- [Backend API](../apps/api/README.md)
- [Climate Service](../services/climate-service/README.md)
- [Market Service](../services/market-service/README.md)
- [ML Service](../ml/README.md)
