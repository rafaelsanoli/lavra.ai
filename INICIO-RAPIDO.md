# 🚀 Guia de Início Rápido - Lavra.ia Backend

Este guia vai te ajudar a iniciar o desenvolvimento do backend da Lavra.ia.

## 📋 Pré-requisitos

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

## 🎯 Início Rápido (5 minutos)

### 1️⃣ Instalar dependências do backend

```bash
cd apps/api
npm install
```

### 2️⃣ Subir banco de dados com Docker

```bash
# Voltar para raiz do projeto
cd ../..

# Subir apenas PostgreSQL e Redis
docker-compose up -d postgres redis
```

### 3️⃣ Configurar banco de dados com Prisma

```bash
cd apps/api

# Executar migrations (criar tabelas)
npx prisma migrate dev --name init

# Visualizar banco de dados (opcional)
npx prisma studio
```

### 4️⃣ Iniciar servidor de desenvolvimento

```bash
npm run start:dev
```

✅ **Backend rodando em:** http://localhost:4000/graphql

## 🧪 Testar a API

Acesse http://localhost:4000/graphql e teste estas mutations:

### Registrar novo usuário

```graphql
mutation {
  register(registerInput: {
    email: "teste@lavra.ai"
    password: "123456"
    name: "João Produtor"
    phone: "11999999999"
  }) {
    accessToken
    refreshToken
    user {
      id
      name
      email
    }
  }
}
```

### Login

```graphql
mutation {
  login(loginInput: {
    email: "teste@lavra.ai"
    password: "123456"
  }) {
    accessToken
    user {
      id
      name
      email
      role
    }
  }
}
```

### Criar uma fazenda (precisa estar autenticado)

Primeiro, adicione o token no header:
```json
{
  "Authorization": "Bearer SEU_ACCESS_TOKEN_AQUI"
}
```

Depois execute:
```graphql
mutation {
  createFarm(createFarmInput: {
    name: "Fazenda Santa Maria"
    location: "São Paulo, SP"
    latitude: -23.5505
    longitude: -46.6333
    totalArea: 150.5
  }) {
    id
    name
    location
    totalArea
  }
}
```

## 📁 Estrutura do Projeto

```
apps/api/
├── src/
│   ├── common/           # Guards, decorators, utils
│   ├── modules/
│   │   ├── auth/        # ✅ Autenticação JWT
│   │   ├── users/       # ✅ Usuários
│   │   └── farms/       # ✅ Fazendas
│   ├── prisma/          # ✅ Prisma service
│   ├── app.module.ts    # ✅ Módulo principal
│   └── main.ts          # ✅ Entry point
├── prisma/
│   └── schema.prisma    # ✅ Schema do banco
├── .env                 # ✅ Variáveis de ambiente
└── package.json         # ✅ Dependências
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev        # Hot reload
npm run start:debug      # Com debugger

# Build
npm run build           # Compilar TypeScript
npm run start:prod      # Produção

# Testes
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage

# Prisma
npx prisma migrate dev      # Nova migration
npx prisma migrate reset    # Resetar BD
npx prisma studio           # Interface visual
npx prisma generate         # Gerar client
```

## 🐳 Docker Compose Completo

Para subir **todos os serviços** (API, Frontend, Microserviços):

```bash
# Na raiz do projeto
docker-compose up -d
```

Serviços disponíveis:
- **API (NestJS):** http://localhost:4000/graphql
- **Frontend (Next.js):** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379
- **Climate Service:** http://localhost:5001
- **Market Service:** http://localhost:5002
- **ML Service:** http://localhost:8000

## 🗄️ Banco de Dados

### Ver dados no Prisma Studio
```bash
npx prisma studio
```

### Resetar banco (CUIDADO!)
```bash
npx prisma migrate reset
```

### Nova migration
```bash
npx prisma migrate dev --name nome_da_migration
```

## 🔐 Autenticação

A API usa **JWT** com access token (15min) e refresh token (7 dias).

Para fazer requests autenticados no GraphQL Playground:

1. Faça login e copie o `accessToken`
2. Adicione no HTTP Headers:
```json
{
  "Authorization": "Bearer seu_token_aqui"
}
```

## 📊 Schema GraphQL

O schema é gerado automaticamente em `src/schema.gql` pelo NestJS.

Ver queries/mutations disponíveis: http://localhost:4000/graphql

## 🚧 Próximos Passos

Agora que o backend básico está funcionando, você pode:

1. ✅ Criar módulos de Plots e Plantings
2. ✅ Implementar módulo de Climate Data
3. ✅ Integrar com microserviços Go (climate-service, market-service)
4. ✅ Adicionar WebSockets para alertas em tempo real
5. ✅ Implementar testes unitários e e2e
6. ✅ Conectar frontend Next.js com a API

Siga o **PLANO-BACKEND.md** para o roadmap completo de 12 meses!

## ❓ Problemas Comuns

### Erro ao conectar no banco
- Verifique se o Docker está rodando: `docker ps`
- Verifique se PostgreSQL está up: `docker-compose ps`
- Verifique a DATABASE_URL no `.env`

### Erro no Prisma
- Rode: `npx prisma generate`
- Se persistir: `rm -rf node_modules && npm install`

### Porta 4000 em uso
- Altere a `PORT` no `.env`
- Ou mate o processo: `lsof -ti:4000 | xargs kill`

## 📚 Documentação

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [GraphQL Docs](https://graphql.org/learn/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

---

**Desenvolvido com ❤️ para Lavra.ia**
