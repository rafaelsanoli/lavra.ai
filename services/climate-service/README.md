# ☁️ Climate Service - Lavra.ia

> Microserviço em Go para ingestão e processamento de dados climáticos

## 📋 Descrição

Microserviço responsável por:
- Ingestão de dados climáticos de múltiplas fontes
- Armazenamento em TimescaleDB
- API REST para consulta de dados climáticos
- Cache inteligente com Redis
- Processamento de dados de satélite

## 🛠️ Stack Tecnológica

- **Go** 1.21+
- **Gin** - HTTP framework
- **GORM** - ORM
- **TimescaleDB** - Séries temporais
- **Redis** - Cache
- **gRPC** - Comunicação entre serviços

## 🔌 Integrações

| Provider | Dados | Frequência |
|----------|-------|------------|
| **INMET** | Temperatura, precipitação, umidade | Horária |
| **CPTEC/INPE** | Previsões, alertas | 6h |
| **NASA POWER** | Radiação solar, evapotranspiração | Diária |
| **Sentinel-2** | Imagens de satélite, NDVI | Semanal |

## 📁 Estrutura (a ser criada)

```
services/climate-service/
├── cmd/
│   └── main.go              # Entrypoint
├── internal/
│   ├── config/              # Configurações
│   ├── domain/              # Entidades e interfaces
│   │   ├── forecast.go
│   │   ├── station.go
│   │   └── satellite.go
│   ├── infra/               # Implementações
│   │   ├── inmet/           # Cliente INMET
│   │   ├── cptec/           # Cliente CPTEC
│   │   ├── nasa/            # Cliente NASA
│   │   ├── sentinel/        # Cliente Sentinel
│   │   ├── cache/           # Redis
│   │   └── db/              # TimescaleDB
│   ├── service/             # Lógica de negócio
│   │   └── climate_service.go
│   └── api/                 # HTTP handlers
│       └── handlers.go
├── pkg/                     # Código exportável
├── docker/
│   └── Dockerfile
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## 🚀 Próximos Passos

1. Setup do projeto Go
2. Implementar cliente INMET
3. Implementar cliente NASA POWER
4. Configurar TimescaleDB
5. Criar API REST
6. Implementar cache com Redis
7. Criar workers de ingestão

## 📝 Status

**🚧 EM PLANEJAMENTO** - Aguardando início do desenvolvimento
