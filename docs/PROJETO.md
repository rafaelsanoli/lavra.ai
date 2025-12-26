# 🏗️ LAVRA.AI - Documentação do Projeto

> Guia técnico completo para desenvolvimento e manutenção

---

## 📋 Sumário

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Diagrama de Microserviços](#diagrama-de-microserviços)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Ambientes](#ambientes)
6. [Integrações Externas](#integrações-externas)

---

## 🏛️ Visão Geral da Arquitetura

O Lavra.ai utiliza uma arquitetura de **microserviços** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Next.js 14 (App Router) + React 18                                     │
│  • Dashboard interativo com Recharts/D3.js                              │
│  • PWA para acesso offline no campo                                     │
│  • React Query para cache inteligente                                   │
│  • Tailwind CSS + shadcn/ui                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                     │
├──────────────────────────────────┬──────────────────────────────────────┤
│                                  │                                      │
│  NestJS (API Principal)          │  Go (Microserviços)                  │
│  ├─ Auth (JWT + OAuth)           │  ├─ Engine de Cálculo                │
│  ├─ GraphQL API                  │  ├─ Ingestão de Dados                │
│  ├─ WebSocket (real-time)        │  ├─ Processamento ML                 │
│  ├─ Integrações (B3, Tradings)   │  └─ Worker de Alertas                │
│  └─ Business Logic               │                                      │
│                                  │                                      │
└──────────────────────────────────┴──────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA & AI LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PostgreSQL (dados estruturados) + TimescaleDB (séries temporais)       │
│  Redis (cache + pub/sub) + Apache Kafka (streaming)                     │
│  Python microservices para ML (FastAPI)                                 │
│  • Modelos de previsão climática (LSTM + Transformers)                  │
│  • Otimização de portfólio (programação linear)                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        INTEGRAÇÕES EXTERNAS                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  • INMET/CPTEC (dados climáticos)                                       │
│  • NASA POWER (radiação solar, evapotranspiração)                       │
│  • B3 API (cotações e execução)                                         │
│  • USDA/CONAB (relatórios de safra)                                     │
│  • Sentinel-2/Landsat (imagens de satélite)                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 14.x | Framework React com App Router |
| **React** | 18.x | Biblioteca UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 3.x | Estilização |
| **shadcn/ui** | latest | Componentes UI |
| **Recharts** | 2.x | Gráficos e visualizações |
| **D3.js** | 7.x | Visualizações complexas |
| **React Query** | 5.x | Gerenciamento de estado servidor |
| **Zustand** | 4.x | Gerenciamento de estado cliente |
| **React Hook Form** | 7.x | Formulários |
| **Zod** | 3.x | Validação de schemas |

### Backend - NestJS (API Principal)

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **NestJS** | 10.x | Framework backend |
| **TypeScript** | 5.x | Tipagem estática |
| **GraphQL** | 16.x | API principal |
| **Apollo Server** | 4.x | Servidor GraphQL |
| **Prisma** | 5.x | ORM |
| **Passport** | 0.7.x | Autenticação |
| **Socket.io** | 4.x | WebSocket real-time |
| **Bull** | 4.x | Filas de jobs |

### Backend - Go (Microserviços de Alta Performance)

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Go** | 1.21+ | Linguagem |
| **Gin** | 1.9.x | HTTP framework |
| **GORM** | 1.25.x | ORM |
| **go-redis** | 9.x | Cliente Redis |
| **sarama** | 1.41.x | Cliente Kafka |

### Data & AI Layer

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **PostgreSQL** | 16.x | Banco principal |
| **TimescaleDB** | 2.x | Séries temporais |
| **Redis** | 7.x | Cache e pub/sub |
| **Apache Kafka** | 3.x | Streaming de eventos |
| **Python** | 3.11+ | ML e análises |
| **FastAPI** | 0.104+ | API para ML |
| **PyTorch** | 2.x | Deep Learning |
| **scikit-learn** | 1.3+ | ML tradicional |

### Infraestrutura

| Tecnologia | Uso |
|------------|-----|
| **AWS / GCP** | Cloud provider |
| **Docker** | Containerização |
| **Kubernetes** | Orquestração |
| **Terraform** | IaC |
| **GitHub Actions** | CI/CD |

---

## 🔄 Diagrama de Microserviços

```
                    ┌─────────────────┐
                    │   API Gateway   │
                    │    (NestJS)     │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
   │  Farm Service │ │Market Service │ │Climate Service│
   │   (NestJS)    │ │     (Go)      │ │     (Go)      │
   └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
           │                 │                 │
           ▼                 ▼                 ▼
   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
   │  PostgreSQL   │ │  TimescaleDB  │ │     Redis     │
   └───────────────┘ └───────────────┘ └───────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
           ┌───────────────┐ ┌───────────────┐
           │Decision Engine│ │  ML Pipeline  │
           │  (Go + Python)│ │   (Python)    │
           └───────────────┘ └───────────────┘
```

### Responsabilidades dos Serviços

| Serviço | Linguagem | Responsabilidade |
|---------|-----------|------------------|
| **API Gateway** | NestJS | Autenticação, roteamento, rate limiting |
| **Farm Service** | NestJS | CRUD de fazendas, talhões, usuários |
| **Market Service** | Go | Cotações B3, execução de ordens, histórico |
| **Climate Service** | Go | Ingestão dados climáticos, previsões |
| **Decision Engine** | Go + Python | Motor de simulação, recomendações |
| **ML Pipeline** | Python | Treinamento e inferência de modelos |

---

## 📁 Estrutura de Pastas

```
lavra.ai/
│
├── 📁 apps/                          # Aplicações
│   ├── 📁 web/                       # Frontend Next.js
│   │   ├── 📁 app/                   # App Router (páginas)
│   │   ├── 📁 components/            # Componentes React
│   │   │   ├── 📁 ui/                # Componentes base (shadcn)
│   │   │   ├── 📁 dashboard/         # Componentes do dashboard
│   │   │   ├── 📁 forms/             # Formulários
│   │   │   └── 📁 charts/            # Gráficos e visualizações
│   │   ├── 📁 hooks/                 # Custom hooks
│   │   ├── 📁 lib/                   # Utilitários e configs
│   │   ├── 📁 services/              # Chamadas API
│   │   ├── 📁 stores/                # Estado global (Zustand)
│   │   ├── 📁 types/                 # Tipos TypeScript
│   │   └── 📁 styles/                # Estilos globais
│   │
│   └── 📁 api/                       # Backend NestJS
│       ├── 📁 src/
│       │   ├── 📁 modules/           # Módulos NestJS
│       │   │   ├── 📁 auth/          # Autenticação
│       │   │   ├── 📁 users/         # Usuários
│       │   │   ├── 📁 farms/         # Fazendas
│       │   │   ├── 📁 plots/         # Talhões
│       │   │   ├── 📁 simulations/   # Simulações
│       │   │   ├── 📁 alerts/        # Alertas
│       │   │   └── 📁 integrations/  # Integrações externas
│       │   ├── 📁 common/            # Código compartilhado
│       │   │   ├── 📁 decorators/    # Decorators customizados
│       │   │   ├── 📁 filters/       # Exception filters
│       │   │   ├── 📁 guards/        # Guards de autenticação
│       │   │   ├── 📁 interceptors/  # Interceptors
│       │   │   └── 📁 pipes/         # Validation pipes
│       │   ├── 📁 config/            # Configurações
│       │   └── 📁 prisma/            # Schema e migrations
│       └── 📁 test/                  # Testes
│
├── 📁 services/                      # Microserviços Go
│   ├── 📁 market-service/            # Serviço de mercado
│   ├── 📁 climate-service/           # Serviço climático
│   ├── 📁 decision-engine/           # Motor de decisão
│   └── 📁 alert-worker/              # Worker de alertas
│
├── 📁 ml/                            # Machine Learning (Python)
│   ├── 📁 models/                    # Definição dos modelos
│   ├── 📁 training/                  # Scripts de treinamento
│   ├── 📁 inference/                 # API de inferência (FastAPI)
│   ├── 📁 data/                      # Processamento de dados
│   └── 📁 notebooks/                 # Jupyter notebooks
│
├── 📁 packages/                      # Pacotes compartilhados
│   ├── 📁 types/                     # Tipos compartilhados
│   ├── 📁 utils/                     # Utilitários
│   └── 📁 config/                    # Configurações compartilhadas
│
├── 📁 infra/                         # Infraestrutura
│   ├── 📁 docker/                    # Dockerfiles
│   ├── 📁 kubernetes/                # Manifests K8s
│   └── 📁 terraform/                 # IaC
│
├── 📁 docs/                          # Documentação
│   ├── PRODUTO.md                    # Documentação do produto
│   ├── PROJETO.md                    # Este arquivo
│   ├── PADROES-CODIGO.md             # Padrões de código
│   ├── ROADMAP.md                    # Roadmap detalhado
│   └── STARTUP.md                    # Documentação da startup
│
├── 📄 package.json                   # Monorepo config (pnpm workspaces)
├── 📄 pnpm-workspace.yaml            # Workspace config
├── 📄 turbo.json                     # Turborepo config
├── 📄 docker-compose.yml             # Desenvolvimento local
└── 📄 README.md                      # Readme principal
```

---

## 🌍 Ambientes

### Desenvolvimento Local

```bash
# Requisitos
- Node.js 20+
- pnpm 8+
- Go 1.21+
- Python 3.11+
- Docker e Docker Compose
- PostgreSQL 16 (via Docker)
- Redis 7 (via Docker)
```

### Ambientes de Deploy

| Ambiente | Uso | URL |
|----------|-----|-----|
| **development** | Desenvolvimento local | localhost:3000 |
| **staging** | Testes e validação | staging.lavra.ai |
| **production** | Produção | app.lavra.ai |

---

## 🔌 Integrações Externas

### Dados Climáticos

| Provider | Dados | Frequência |
|----------|-------|------------|
| **INMET** | Temperatura, precipitação, umidade | Horária |
| **CPTEC/INPE** | Previsões, alertas | 6h |
| **NASA POWER** | Radiação solar, evapotranspiração | Diária |

### Imagens de Satélite

| Provider | Resolução | Uso |
|----------|-----------|-----|
| **Sentinel-2** | 10m | NDVI, detecção de anomalias |
| **Landsat** | 30m | Análise histórica |

### Mercado Financeiro

| Provider | Dados | Frequência |
|----------|-------|------------|
| **B3** | Cotações futuros (soja, milho, boi) | Real-time |
| **Tradings** | Cotações físicas, bids/offers | Diária |

### Relatórios de Safra

| Provider | Dados | Frequência |
|----------|-------|------------|
| **USDA** | Relatórios mundiais | Mensal |
| **CONAB** | Safra brasileira | Mensal |

---

*Documento atualizado em: 24 de Dezembro de 2025*
*Versão: 1.0*
