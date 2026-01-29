# 🏗️ Backend API - Lavra.ia

> API principal em NestJS com GraphQL

## 📋 Descrição

API Gateway e backend principal do Lavra.ia construído com NestJS. Responsável por:
- Autenticação e autorização (JWT + OAuth)
- CRUD de entidades (Usuários, Fazendas, Talhões, Safras)
- API GraphQL principal
- WebSocket para comunicação real-time
- Orquestração dos microserviços

## 🛠️ Stack Tecnológica

- **NestJS** 10.x - Framework backend
- **TypeScript** 5.x
- **GraphQL** com Apollo Server
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **Passport** - Autenticação
- **Socket.io** - WebSocket
- **Bull** - Filas de jobs

## 📁 Estrutura (a ser criada)

```
apps/api/
├── src/
│   ├── modules/              # Módulos da aplicação
│   │   ├── auth/            # Autenticação
│   │   ├── users/           # Usuários
│   │   ├── farms/           # Fazendas
│   │   ├── plots/           # Talhões
│   │   ├── harvests/        # Safras
│   │   ├── simulations/     # Simulações
│   │   ├── alerts/          # Alertas
│   │   ├── market/          # Mercado (proxy para microserviço)
│   │   ├── climate/         # Clima (proxy para microserviço)
│   │   └── integrations/    # Integrações externas
│   ├── common/              # Código compartilhado
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/              # Configurações
│   ├── prisma/              # Schema Prisma e migrations
│   ├── graphql/             # Schema GraphQL
│   └── main.ts              # Entry point
├── test/                    # Testes
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## 🚀 Próximos Passos

1. Inicializar projeto NestJS
2. Configurar Prisma com PostgreSQL
3. Implementar módulo de autenticação
4. Criar schema GraphQL
5. Implementar CRUDs básicos
6. Integrar com microserviços Go

## 📝 Status

**🚧 EM PLANEJAMENTO** - Aguardando início do desenvolvimento
