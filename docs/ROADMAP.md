# 📅 LAVRA.IA - Roadmap de Desenvolvimento

> Planejamento detalhado para execução do projeto

---

## 📋 Sumário

1. [Visão Geral das Fases](#visão-geral-das-fases)
2. [MVP - Fase 1 (Meses 1-4)](#mvp---fase-1-meses-1-4)
3. [V1.0 - Fase 2 (Meses 5-6)](#v10---fase-2-meses-5-6)
4. [V2.0 - Fase 3 (Meses 7-12)](#v20---fase-3-meses-7-12)
5. [Detalhamento de Sprints](#detalhamento-de-sprints)
6. [Critérios de Aceite por Entrega](#critérios-de-aceite-por-entrega)
7. [Dependências e Riscos](#dependências-e-riscos)

---

## 🎯 Visão Geral das Fases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROADMAP LAVRA.IA 2025-2026                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MVP (3-4 meses)          V1.0 (6 meses)           V2.0 (12 meses)         │
│  ═══════════════          ══════════════           ═══════════════         │
│                                                                             │
│  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐         │
│  │ Infra base  │          │ IA Convers. │          │ Pecuária    │         │
│  │ Backend core│    →     │ Hedge exec. │    →     │ IoT         │         │
│  │ Dashboard   │          │ Seguros     │          │ Marketplace │         │
│  │ Alertas     │          │ API pública │          │ Crédito     │         │
│  │ Beta 5 prod │          │ 50 clientes │          │ Internac.   │         │
│  └─────────────┘          └─────────────┘          └─────────────┘         │
│                                                                             │
│  Meta: Validar produto    Meta: Monetização        Meta: Escala            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 MVP - Fase 1 (Meses 1-4)

### Objetivo
Validar o produto com 5 produtores parceiros e provar o valor da proposta.

### Entregas por Mês

---

### 📆 MÊS 1: Fundação

#### Semana 1-2: Setup de Infraestrutura

**O que fazer:**

```
□ Configurar repositório monorepo com pnpm workspaces + Turborepo
□ Configurar CI/CD com GitHub Actions
□ Provisionar infraestrutura AWS/GCP com Terraform
  ├─ VPC e subnets
  ├─ RDS PostgreSQL
  ├─ ElastiCache Redis
  ├─ ECS ou GKE para containers
  └─ S3/Cloud Storage para arquivos
□ Configurar ambientes (dev, staging, prod)
□ Setup de monitoramento (Datadog ou similar)
□ Configurar ferramentas de desenvolvimento
  ├─ ESLint + Prettier
  ├─ Husky + lint-staged
  └─ Commitlint
```

**Entregáveis:**
- [ ] Repositório configurado e documentado
- [ ] Pipeline CI/CD funcionando
- [ ] Infraestrutura provisionada
- [ ] Documento de arquitetura atualizado

**Responsável:** DevOps / Tech Lead

**Critérios de Aceite:**
1. Deploy automático ao fazer merge em `develop`
2. Testes rodando automaticamente em PRs
3. Ambientes isolados e funcionais
4. Documentação de acesso aos ambientes

---

#### Semana 3-4: Backend Core NestJS

**O que fazer:**

```
□ Estrutura base do projeto NestJS
  ├─ Configuração de módulos
  ├─ Configuração GraphQL + Apollo
  ├─ Configuração Prisma + migrations
  └─ Configuração de variáveis de ambiente
  
□ Módulo de Autenticação
  ├─ Registro de usuário
  ├─ Login com JWT
  ├─ Refresh token
  ├─ Recuperação de senha
  └─ OAuth Google (opcional MVP)
  
□ Módulo de Usuários
  ├─ CRUD de usuários
  ├─ Perfil do usuário
  └─ Configurações
  
□ Módulo de Fazendas
  ├─ CRUD de fazendas
  ├─ Upload de shapefile/geojson
  ├─ Validação de área
  └─ Listagem com filtros
  
□ Módulo de Talhões
  ├─ CRUD de talhões
  ├─ Vinculação com fazenda
  ├─ Cálculo de área
  └─ Histórico de culturas
```

**Schema Prisma Inicial:**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

/// Usuário do sistema
model Usuario {
  id            String    @id @default(uuid())
  email         String    @unique
  senha         String
  nome          String
  telefone      String?
  avatarUrl     String?   @map("avatar_url")
  emailVerificado Boolean @default(false) @map("email_verificado")
  
  fazendas      Fazenda[]
  
  criadoEm      DateTime  @default(now()) @map("criado_em")
  atualizadoEm  DateTime  @updatedAt @map("atualizado_em")
  
  @@map("usuarios")
}

/// Fazenda do produtor
model Fazenda {
  id                String    @id @default(uuid())
  nome              String
  areaTotalHectares Decimal   @map("area_total_hectares")
  localizacao       Json?     // GeoJSON
  endereco          String?
  cidade            String?
  estado            String?
  
  proprietarioId    String    @map("proprietario_id")
  proprietario      Usuario   @relation(fields: [proprietarioId], references: [id])
  
  talhoes           Talhao[]
  safras            Safra[]
  
  criadoEm          DateTime  @default(now()) @map("criado_em")
  atualizadoEm      DateTime  @updatedAt @map("atualizado_em")
  deletadoEm        DateTime? @map("deletado_em")
  
  @@map("fazendas")
  @@index([proprietarioId])
}

/// Talhão (subdivisão da fazenda)
model Talhao {
  id                String    @id @default(uuid())
  nome              String
  areaHectares      Decimal   @map("area_hectares")
  geometria         Json?     // GeoJSON polygon
  tipoSolo          TipoSolo? @map("tipo_solo")
  possuiIrrigacao   Boolean   @default(false) @map("possui_irrigacao")
  
  fazendaId         String    @map("fazenda_id")
  fazenda           Fazenda   @relation(fields: [fazendaId], references: [id])
  
  culturas          CulturaTalhao[]
  medicoes          MedicaoTalhao[]
  
  criadoEm          DateTime  @default(now()) @map("criado_em")
  atualizadoEm      DateTime  @updatedAt @map("atualizado_em")
  
  @@map("talhoes")
  @@index([fazendaId])
}

enum TipoSolo {
  ARENOSO
  ARGILOSO
  SILTOSO
  HUMIFERO
  CALCARIO
  
  @@map("tipo_solo")
}

/// Cultura plantada em um talhão
model CulturaTalhao {
  id                String    @id @default(uuid())
  cultura           Cultura
  variedade         String?
  dataPlantio       DateTime  @map("data_plantio")
  dataColheitaPrev  DateTime? @map("data_colheita_prev")
  dataColheitaReal  DateTime? @map("data_colheita_real")
  produtividadeReal Decimal?  @map("produtividade_real") // sacas/ha
  
  talhaoId          String    @map("talhao_id")
  talhao            Talhao    @relation(fields: [talhaoId], references: [id])
  
  safraId           String    @map("safra_id")
  safra             Safra     @relation(fields: [safraId], references: [id])
  
  criadoEm          DateTime  @default(now()) @map("criado_em")
  
  @@map("culturas_talhao")
}

enum Cultura {
  SOJA
  MILHO
  ALGODAO
  CAFE
  CANA
  TRIGO
  FEIJAO
  ARROZ
  
  @@map("cultura")
}

/// Safra (ciclo produtivo)
model Safra {
  id                String    @id @default(uuid())
  nome              String    // ex: "Safra 2024/2025"
  anoInicio         Int       @map("ano_inicio")
  anoFim            Int       @map("ano_fim")
  
  fazendaId         String    @map("fazenda_id")
  fazenda           Fazenda   @relation(fields: [fazendaId], references: [id])
  
  culturas          CulturaTalhao[]
  simulacoes        Simulacao[]
  
  criadoEm          DateTime  @default(now()) @map("criado_em")
  
  @@map("safras")
}
```

**Entregáveis:**
- [ ] API GraphQL funcionando com playground
- [ ] Autenticação completa com JWT
- [ ] CRUD de Fazendas e Talhões
- [ ] Testes unitários com cobertura > 80%
- [ ] Documentação da API

**Responsável:** Backend Lead + 1 Dev Backend

---

### 📆 MÊS 2: Dados e Dashboard

#### Semana 1-2: Ingestão de Dados Climáticos (Go)

**O que fazer:**

```
□ Microserviço Climate Service em Go
  ├─ Estrutura do projeto
  ├─ Cliente HTTP para APIs externas
  ├─ Sistema de retry e fallback
  └─ Cache com Redis
  
□ Integração INMET
  ├─ Autenticação na API
  ├─ Busca de estações por coordenadas
  ├─ Download de dados horários
  └─ Parser e normalização
  
□ Integração NASA POWER
  ├─ Busca de dados por lat/long
  ├─ Radiação solar
  ├─ Evapotranspiração
  └─ Histórico de 5 anos
  
□ Pipeline de ingestão
  ├─ Job scheduler (cron)
  ├─ Fila com Kafka/Redis
  ├─ Persistência no TimescaleDB
  └─ Alertas de falha
```

**Estrutura do Serviço:**

```go
// services/climate-service/cmd/main.go

climate-service/
├── cmd/
│   └── main.go              // Entrypoint
├── internal/
│   ├── config/              // Configurações
│   ├── domain/              // Entidades e interfaces
│   │   ├── previsao.go
│   │   └── estacao.go
│   ├── infra/               // Implementações
│   │   ├── inmet/           // Cliente INMET
│   │   ├── nasa/            // Cliente NASA
│   │   ├── cache/           // Redis
│   │   └── db/              // TimescaleDB
│   ├── service/             // Lógica de negócio
│   │   └── clima_service.go
│   └── api/                 // HTTP handlers
│       └── handlers.go
├── pkg/                     // Código exportável
├── docker/
└── Makefile
```

**Entregáveis:**
- [ ] Serviço Go rodando em container
- [ ] Dados INMET sendo ingeridos a cada hora
- [ ] Dados NASA POWER sendo ingeridos diariamente
- [ ] API REST para consulta de dados
- [ ] Dashboard de monitoramento de ingestão

**Responsável:** 1 Dev Go

---

#### Semana 3-4: Dashboard Frontend

**O que fazer:**

```
□ Estrutura Next.js 14 com App Router
  ├─ Layout base
  ├─ Sistema de rotas
  ├─ Providers (Auth, Query, etc)
  └─ Configuração Tailwind + shadcn
  
□ Sistema de Autenticação
  ├─ Páginas login/registro
  ├─ Proteção de rotas
  ├─ Context de usuário
  └─ Refresh token automático
  
□ Dashboard Principal
  ├─ Sidebar navegação
  ├─ Header com notificações
  ├─ Cards de métricas
  └─ Gráfico de clima (Recharts)
  
□ Páginas de Fazenda
  ├─ Lista de fazendas
  ├─ Detalhe da fazenda
  ├─ Mapa com talhões
  └─ Formulários CRUD
  
□ Componentes Base
  ├─ Button, Input, Select
  ├─ Card, Modal, Toast
  ├─ Table com paginação
  └─ Charts base
```

**Estrutura de Componentes:**

```typescript
// components/dashboard/card-metrica.tsx

interface CardMetricaProps {
  titulo: string;
  valor: string | number;
  variacao?: {
    valor: number;
    tipo: 'aumento' | 'reducao';
  };
  icone?: React.ReactNode;
  corBorda?: 'sucesso' | 'atencao' | 'perigo' | 'info';
  carregando?: boolean;
  aoClicar?: () => void;
}
```

**Entregáveis:**
- [ ] Dashboard funcionando com dados reais
- [ ] Visualização de fazendas e talhões
- [ ] Gráficos de dados climáticos
- [ ] Design responsivo (desktop + tablet)
- [ ] Testes E2E das principais jornadas

**Responsável:** Frontend Lead + 1 Dev Frontend

---

### 📆 MÊS 3: Motor de Simulação

#### Semana 1-2: Modelo de Predição Básico (Python)

**O que fazer:**

```
□ Estrutura do projeto ML
  ├─ Virtual environment
  ├─ Requirements.txt / Poetry
  ├─ Notebooks de exploração
  └─ Scripts de treinamento
  
□ Modelo v1 - Regressão Linear + Random Forest
  ├─ Feature engineering
  │   ├─ Dados climáticos agregados
  │   ├─ Histórico de produtividade
  │   └─ Características do solo
  ├─ Treinamento com dados históricos
  ├─ Validação cruzada
  └─ Métricas de performance (RMSE, MAE)
  
□ API de Inferência (FastAPI)
  ├─ Endpoint /prever
  ├─ Validação de entrada
  ├─ Serialização do modelo
  └─ Cache de predições
```

**Modelo de Dados para ML:**

```python
# ml/data/features.py

@dataclass
class FeaturesSimulacao:
    """Features de entrada para o modelo de simulação."""
    
    # Dados do talhão
    area_hectares: float
    tipo_solo: str
    possui_irrigacao: bool
    latitude: float
    longitude: float
    
    # Dados climáticos (últimos 30 dias)
    temperatura_media: float
    temperatura_min: float
    temperatura_max: float
    precipitacao_acumulada: float
    dias_sem_chuva: int
    umidade_media: float
    radiacao_media: float
    
    # Dados climáticos (previsão 15 dias)
    previsao_precipitacao: float
    previsao_temperatura: float
    probabilidade_chuva: float
    
    # Dados históricos
    produtividade_media_historica: float
    produtividade_ultimo_ano: float
    variancia_historica: float
    
    # Dados de mercado
    preco_atual_saca: float
    preco_futuro_3m: float
    volatilidade_30d: float
```

**Entregáveis:**
- [ ] Modelo treinado com dados históricos
- [ ] API de inferência funcionando
- [ ] Precisão > 85% em validação
- [ ] Documentação do modelo
- [ ] Notebook de análise exploratória

**Responsável:** 1 Data Scientist / ML Engineer

---

#### Semana 3-4: Motor de Decisão + Integração B3

**O que fazer:**

```
□ Decision Engine (Go + Python)
  ├─ Orquestração de chamadas
  ├─ Cálculo de cenários
  ├─ Geração de recomendações
  └─ Formatação de resultados
  
□ Integração B3 (read-only MVP)
  ├─ Conexão com API de cotações
  ├─ Busca de contratos futuros
  │   ├─ Soja (SFI)
  │   ├─ Milho (CCM)
  │   └─ Boi Gordo (BGI)
  ├─ Histórico de preços
  └─ Cache de cotações
  
□ Tela de Simulação no Frontend
  ├─ Formulário de parâmetros
  ├─ Visualização de cenários
  ├─ Comparativo de opções
  └─ Recomendação destacada
```

**Fluxo da Simulação:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │ ──► │   API    │ ──► │ Decision │ ──► │ ML Model │
│          │     │ Gateway  │     │  Engine  │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                       │
                      ┌────────────────┼────────────────┐
                      ▼                ▼                ▼
                ┌──────────┐    ┌──────────┐    ┌──────────┐
                │ Climate  │    │  Market  │    │   Farm   │
                │ Service  │    │ Service  │    │ Service  │
                └──────────┘    └──────────┘    └──────────┘
```

**Entregáveis:**
- [ ] Motor de simulação funcionando end-to-end
- [ ] Cotações B3 em tempo real
- [ ] Tela de simulação completa
- [ ] 3 cenários gerados por simulação
- [ ] Recomendação com valor em R$

**Responsável:** Backend Lead + Dev Go + Frontend

---

### 📆 MÊS 4: Sistema de Alertas + Beta

#### Semana 1-2: Sistema de Alertas

**O que fazer:**

```
□ Worker de Alertas (Go)
  ├─ Consumer Kafka/Redis
  ├─ Regras de alerta configuráveis
  ├─ Priorização de alertas
  └─ Deduplicação
  
□ Tipos de Alertas MVP
  ├─ Alerta de oportunidade de venda
  │   └─ "Preço atingiu R$ X, considere vender Y%"
  ├─ Alerta climático
  │   └─ "Previsão de veranico, impacto estimado: R$ X"
  ├─ Alerta de janela de decisão
  │   └─ "Contrato vence em X dias, decida agora"
  └─ Alerta de risco
      └─ "Score de risco caiu para X, ação necessária"
  
□ Canais de Notificação
  ├─ Push notification (PWA)
  ├─ Email
  └─ WhatsApp (via API) - opcional MVP
  
□ Central de Notificações no Frontend
  ├─ Lista de alertas
  ├─ Filtros e busca
  ├─ Marcar como lido
  └─ Ações rápidas
```

**Entregáveis:**
- [ ] Sistema de alertas funcionando
- [ ] Pelo menos 4 tipos de alertas
- [ ] Push notifications no PWA
- [ ] Emails transacionais
- [ ] Central de notificações no dashboard

**Responsável:** Backend + Frontend

---

#### Semana 3-4: Beta com Produtores

**O que fazer:**

```
□ Preparação para Beta
  ├─ Testes de carga
  ├─ Correção de bugs críticos
  ├─ Documentação de usuário
  └─ FAQ e suporte
  
□ Onboarding dos 5 Produtores
  ├─ Visita presencial ou call
  ├─ Cadastro assistido
  ├─ Upload de dados históricos
  └─ Treinamento na plataforma
  
□ Coleta de Feedback
  ├─ Entrevistas semanais
  ├─ Analytics de uso (Mixpanel/Amplitude)
  ├─ Formulários de feedback
  └─ Lista de melhorias priorizadas
  
□ Iterações Rápidas
  ├─ Sprints de 1 semana
  ├─ Fixes prioritários
  └─ Melhorias de UX
```

**Critérios de Sucesso do MVP:**
- [ ] 5 produtores usando ativamente
- [ ] NPS > 50
- [ ] Pelo menos 1 decisão de venda influenciada
- [ ] Feedback positivo documentado
- [ ] Lista de melhorias para V1

**Responsável:** Product Manager + Equipe

---

## 🎯 V1.0 - Fase 2 (Meses 5-6)

### Objetivo
Monetização com 50 clientes pagantes e funcionalidades completas.

---

### 📆 MÊS 5: IA Conversacional + Hedge

#### IA Conversacional (NEXUS AI)

```
□ Backend do Chat
  ├─ Integração com LLM (GPT-4 ou Claude)
  ├─ Contexto do usuário/fazenda
  ├─ Histórico de conversas
  └─ Actions (executar consultas)
  
□ Frontend do Chat
  ├─ Interface de chat
  ├─ Sugestões de perguntas
  ├─ Cards de ação inline
  └─ Histórico de conversas
```

#### Execução de Hedge

```
□ Integração com Corretoras
  ├─ API B3 (execução)
  ├─ Autenticação do usuário
  ├─ Envio de ordens
  └─ Status de execução
  
□ Fluxo de Hedge no Frontend
  ├─ Seleção de quantidade
  ├─ Confirmação com 2FA
  ├─ Execução
  └─ Comprovante
```

---

### 📆 MÊS 6: Seguros + API Pública + 50 Clientes

#### Módulo de Seguros

```
□ Análise de Apólices
  ├─ Upload de apólice (OCR)
  ├─ Parser de cobertura
  ├─ Comparativo com risco real
  └─ Identificação de gaps
  
□ Cotações Automáticas
  ├─ Integração com seguradoras
  ├─ Geração de cotações
  └─ Comparativo
```

#### API Pública

```
□ API REST/GraphQL pública
  ├─ Documentação OpenAPI
  ├─ Rate limiting
  ├─ API keys
  └─ Sandbox
```

#### Meta: 50 Clientes

```
□ Go-to-Market
  ├─ 20-50 produtores grandes (5.000+ ha)
  ├─ Eventos do setor (Agrishow, Tecnoshow)
  ├─ 3 meses grátis + onboarding white-glove
  └─ Coleta de testimonials
```

---

## 🚀 V2.0 - Fase 3 (Meses 7-12)

### Expansões Planejadas

```
□ Pecuária (Boi Gordo)
□ Integração com Sensores IoT
□ Marketplace de Insumos
□ Crédito Rural Integrado (parceria com bancos)
□ Expansão Geográfica (Sul, Matopiba)
□ Internacionalização (Argentina, Paraguai)
```

---

## 📊 Critérios de Aceite por Entrega

### Padrão para Todas as Features

| Critério | Descrição |
|----------|-----------|
| **Funcional** | Feature funciona conforme especificado |
| **Testado** | Cobertura de testes > 80% |
| **Documentado** | Documentação técnica e de usuário |
| **Revisado** | Code review aprovado por 2 pessoas |
| **Performático** | Tempo de resposta < 2s (P95) |
| **Seguro** | Sem vulnerabilidades críticas |
| **Acessível** | WCAG 2.1 AA compliance |

---

## ⚠️ Dependências e Riscos

### Dependências Externas

| Dependência | Risco | Mitigação |
|-------------|-------|-----------|
| API INMET | Instabilidade | Cache agressivo + fallback NASA |
| API B3 | Custo/Latência | Cache + múltiplos providers |
| LLM (GPT/Claude) | Custo/Rate limit | Caching + fallback local |
| AWS/GCP | Custo | Monitoramento de custos + alerts |

### Riscos de Projeto

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Atraso no MVP | Média | Alto | Escopo flexível, priorização |
| Precisão do modelo | Alta | Alto | Disclaimers, melhoria contínua |
| Adoção lenta | Média | Alto | Beta gratuito, ROI claro |
| Contratação | Alta | Médio | Parceria com consultorias |

---

## 👥 Equipe Sugerida

### MVP (Meses 1-4)

| Papel | Quantidade | Responsabilidade |
|-------|------------|------------------|
| Tech Lead | 1 | Arquitetura, decisões técnicas |
| Backend NestJS | 2 | API, autenticação, CRUD |
| Backend Go | 1 | Microserviços, ingestão |
| Frontend | 2 | Dashboard, UX |
| ML/Data | 1 | Modelos, dados |
| DevOps | 0.5 | Infra, CI/CD |
| Product | 1 | Requisitos, feedback |

**Total: 8-9 pessoas**

### V1.0+ (Meses 5-12)

Adicionar conforme necessidade:
- +1 Backend
- +1 Frontend
- +1 ML/Data
- +1 QA
- +1 DevOps (full-time)

---

*Documento atualizado em: 24 de Dezembro de 2025*
*Versão: 1.0*
