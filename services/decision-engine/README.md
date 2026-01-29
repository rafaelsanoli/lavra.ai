# 🧠 Decision Engine - Lavra.ia

> Motor de decisão com Go + Python para simulações e recomendações

## 📋 Descrição

Motor de decisão que combina dados climáticos, mercado e operações para gerar:
- Simulações de cenários (Otimista, Base, Pessimista)
- Recomendações de venda/hedge
- Análise de risco por talhão
- Alertas de oportunidade
- Score de risco financeiro

## 🛠️ Stack Tecnológica

- **Go** 1.21+ - Orquestração e API
- **Python** 3.11+ - Modelos de ML
- **PostgreSQL** - Armazenamento
- **Redis** - Cache de simulações
- **gRPC** - Comunicação entre serviços
- **Apache Kafka** - Streaming de eventos

## 🧮 Algoritmos

### 1. Motor de Simulação de Cenários
```
ENTRADA:
- Dados climáticos (previsão 90 dias)
- Dados de mercado (futuros)
- Dados operacionais (estágio de cultura, custos)

PROCESSAMENTO:
- Monte Carlo para cenários de produtividade
- Simulação de preços futuros
- Cálculo de risco/retorno

SAÍDA:
- 3 cenários com probabilidades
- Recomendações de ação
- Valor em risco calculado
```

### 2. Score de Risco por Talhão
```
FATORES:
- Tipo de solo (peso 15%)
- Histórico de produtividade (peso 25%)
- Risco climático (peso 30%)
- Estágio da cultura (peso 20%)
- Infraestrutura (irrigação, drenagem) (peso 10%)

SCORE: 0-100 (quanto maior, menor o risco)
```

### 3. Otimização de Portfólio
```
Programação linear para encontrar:
- Mix ideal de culturas
- Momento ótimo de venda
- Percentual de hedge recomendado
```

## 📁 Estrutura (a ser criada)

```
services/decision-engine/
├── cmd/
│   └── main.go              # Entrypoint
├── internal/
│   ├── config/              # Configurações
│   ├── domain/              # Entidades e interfaces
│   │   ├── scenario.go
│   │   ├── recommendation.go
│   │   └── risk_score.go
│   ├── engine/              # Lógica do motor
│   │   ├── simulator.go     # Simulador de cenários
│   │   ├── optimizer.go     # Otimizador
│   │   └── risk_calculator.go
│   ├── infra/               # Implementações
│   │   ├── db/              # PostgreSQL
│   │   ├── cache/           # Redis
│   │   └── ml/              # Cliente Python ML
│   ├── service/             # Serviços
│   │   └── decision_service.go
│   └── api/                 # API handlers
│       └── handlers.go
├── python/                  # Módulos Python
│   ├── models/              # Modelos de ML
│   ├── optimization/        # Otimização
│   └── api/                 # FastAPI para inferência
├── pkg/                     # Código exportável
├── docker/
│   ├── Dockerfile.go
│   └── Dockerfile.python
├── go.mod
├── go.sum
├── requirements.txt
├── Makefile
└── README.md
```

## 🔬 Modelos de ML (Python)

1. **Previsão de Produtividade**
   - LSTM + Transformers
   - Features: clima histórico, solo, variedade
   - Output: produtividade esperada (sacas/ha)

2. **Previsão de Preços**
   - ARIMA + LSTM
   - Features: histórico, safra mundial, câmbio
   - Output: distribuição de preços futuros

3. **Classificação de Risco**
   - Random Forest
   - Features: todos os fatores do talhão
   - Output: score 0-100

## 🚀 Próximos Passos

1. Setup do projeto Go
2. Implementar simulador de cenários básico
3. Criar API gRPC para comunicação
4. Setup do módulo Python
5. Treinar modelos iniciais de ML
6. Integrar Go + Python
7. Implementar cache de resultados
8. Criar testes de performance

## 📝 Status

**🚧 EM PLANEJAMENTO** - Aguardando início do desenvolvimento
