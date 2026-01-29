# 📈 Market Service - Lavra.ia

> Microserviço em Go para dados de mercado e execução de ordens

## 📋 Descrição

Microserviço responsável por:
- Ingestão de cotações da B3 em tempo real
- Armazenamento de histórico de preços
- Execução de ordens de hedge
- Integração com tradings e corretoras
- API REST para consulta de dados de mercado

## 🛠️ Stack Tecnológica

- **Go** 1.21+
- **Gin** - HTTP framework
- **GORM** - ORM
- **PostgreSQL** - Banco de dados
- **Redis** - Cache de cotações
- **WebSocket** - Dados em tempo real
- **gRPC** - Comunicação entre serviços

## 🔌 Integrações

| Provider | Dados | Tipo |
|----------|-------|------|
| **B3** | Cotações futuros (soja, milho, boi) | Real-time WebSocket |
| **Tradings** | Cotações físicas, bids/offers | API REST |
| **USDA** | Relatórios mundiais | Scheduled |
| **CONAB** | Safra brasileira | Scheduled |

## 📁 Estrutura (a ser criada)

```
services/market-service/
├── cmd/
│   └── main.go              # Entrypoint
├── internal/
│   ├── config/              # Configurações
│   ├── domain/              # Entidades e interfaces
│   │   ├── quote.go         # Cotação
│   │   ├── order.go         # Ordem
│   │   └── contract.go      # Contrato
│   ├── infra/               # Implementações
│   │   ├── b3/              # Cliente B3
│   │   ├── tradings/        # Clientes de tradings
│   │   ├── cache/           # Redis
│   │   └── db/              # PostgreSQL
│   ├── service/             # Lógica de negócio
│   │   ├── market_service.go
│   │   └── order_service.go
│   └── api/                 # HTTP/WebSocket handlers
│       └── handlers.go
├── pkg/                     # Código exportável
├── docker/
│   └── Dockerfile
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## 🔒 Segurança

- Credenciais em vault/secrets manager
- Autenticação mútua para execução de ordens
- Logs de auditoria de todas as operações
- Rate limiting por cliente

## 🚀 Próximos Passos

1. Setup do projeto Go
2. Implementar cliente B3
3. Implementar WebSocket para cotações em tempo real
4. Criar API REST para consultas
5. Implementar sistema de ordens (sandbox primeiro)
6. Integrar com sistema de autenticação
7. Criar dashboards de monitoramento

## 📝 Status

**🚧 EM PLANEJAMENTO** - Aguardando início do desenvolvimento
