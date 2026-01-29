# 🔔 Alert Worker - Lavra.ia

> Worker em Go para processamento e envio de alertas

## 📋 Descrição

Worker responsável por:
- Monitoramento contínuo de condições
- Geração de alertas inteligentes
- Envio de notificações (push, email, SMS, WhatsApp)
- Priorização de alertas
- Deduplicação de alertas

## 🛠️ Stack Tecnológica

- **Go** 1.21+
- **Redis** - Fila de alertas
- **Apache Kafka** - Streaming de eventos
- **PostgreSQL** - Histórico de alertas
- **Twilio** - SMS
- **SendGrid** - Email
- **Firebase** - Push notifications

## 📊 Tipos de Alertas

### 1. Alertas Climáticos
```
CRÍTICO:
- Geada prevista
- Granizo iminente
- Seca prolongada (> 15 dias sem chuva)

ATENÇÃO:
- Chuva forte prevista
- Temperatura extrema
- Umidade crítica para pragas

INFORMATIVO:
- Período ideal para pulverização
- Janela de plantio
```

### 2. Alertas de Mercado
```
CRÍTICO:
- Janela de oportunidade (preço > 10% acima da média)
- Queda abrupta de preço

ATENÇÃO:
- Tendência de alta/baixa
- Volatilidade aumentando

INFORMATIVO:
- Relatório USDA/CONAB publicado
- Mudanças na safra mundial
```

### 3. Alertas Operacionais
```
CRÍTICO:
- Equipamento quebrado
- Pragas detectadas
- Colheita atrasada

ATENÇÃO:
- Manutenção preventiva devida
- Estoque baixo de insumos

INFORMATIVO:
- Atividade concluída
- Meta atingida
```

## 📁 Estrutura (a ser criada)

```
services/alert-worker/
├── cmd/
│   └── main.go              # Entrypoint
├── internal/
│   ├── config/              # Configurações
│   ├── domain/              # Entidades e interfaces
│   │   ├── alert.go
│   │   ├── notification.go
│   │   └── rule.go
│   ├── worker/              # Workers
│   │   ├── climate_monitor.go
│   │   ├── market_monitor.go
│   │   └── operation_monitor.go
│   ├── rules/               # Motor de regras
│   │   └── rules_engine.go
│   ├── notifier/            # Envio de notificações
│   │   ├── push.go
│   │   ├── email.go
│   │   ├── sms.go
│   │   └── whatsapp.go
│   ├── infra/               # Implementações
│   │   ├── queue/           # Redis/Kafka
│   │   ├── db/              # PostgreSQL
│   │   └── cache/           # Redis
│   └── api/                 # API de status
│       └── handlers.go
├── pkg/                     # Código exportável
├── docker/
│   └── Dockerfile
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## 🎯 Motor de Regras

```go
type Rule struct {
    ID          string
    Type        AlertType
    Condition   func(data interface{}) bool
    Severity    Severity
    Template    string
    Channels    []Channel
    Cooldown    time.Duration
}

// Exemplo de regra
Rule{
    ID: "climate-frost-alert",
    Type: Climate,
    Condition: func(data interface{}) bool {
        forecast := data.(ClimateForecast)
        return forecast.MinTemp < 2.0 && forecast.Confidence > 0.7
    },
    Severity: Critical,
    Template: "ALERTA: Risco de geada em {{.Days}} dias. Temp mín: {{.MinTemp}}°C",
    Channels: []Channel{Push, SMS, WhatsApp},
    Cooldown: 6 * time.Hour,
}
```

## 🔧 Configurações de Alerta por Usuário

```json
{
  "userId": "uuid",
  "preferences": {
    "channels": {
      "critical": ["push", "sms", "whatsapp"],
      "attention": ["push", "email"],
      "info": ["push"]
    },
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "07:00",
      "exceptCritical": true
    },
    "grouping": {
      "enabled": true,
      "window": "30m"
    }
  }
}
```

## 🚀 Próximos Passos

1. Setup do projeto Go
2. Implementar motor de regras
3. Criar workers de monitoramento
4. Integrar com provedores de notificação
5. Implementar sistema de preferências
6. Criar API de gerenciamento de alertas
7. Implementar deduplicação e agrupamento
8. Criar dashboard de monitoramento

## 📝 Status

**🚧 EM PLANEJAMENTO** - Aguardando início do desenvolvimento
