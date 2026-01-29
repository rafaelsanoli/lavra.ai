# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### 🚀 Em Desenvolvimento
- Módulo Harvests (gestão de colheitas)
- Testes E2E
- Swagger/OpenAPI documentation

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
