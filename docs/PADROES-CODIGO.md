# 📝 LAVRA.AI - Padrões de Código

> Convenções e boas práticas para desenvolvimento

---

## 📋 Sumário

1. [Princípios Gerais](#princípios-gerais)
2. [Idioma e Nomenclatura](#idioma-e-nomenclatura)
3. [TypeScript/JavaScript](#typescriptjavascript)
4. [React/Next.js](#reactnextjs)
5. [NestJS](#nestjs)
6. [Go](#go)
7. [Python](#python)
8. [Banco de Dados](#banco-de-dados)
9. [Git e Commits](#git-e-commits)
10. [Documentação de Código](#documentação-de-código)
11. [Testes](#testes)

---

## 🎯 Princípios Gerais

### Valores do Código Lavra.ai

1. **Legibilidade** > Performance prematura
2. **Simplicidade** > Complexidade desnecessária
3. **Documentação** > Código auto-explicativo (ambos são necessários)
4. **Consistência** > Preferências pessoais
5. **Manutenibilidade** > Soluções "espertas"

### Regras de Ouro

```
✅ Todo código deve ser compreensível por um novo dev em 5 minutos
✅ Todo código deve ter comentários explicando o "porquê"
✅ Todo código deve ter testes
✅ Todo código deve seguir os padrões deste documento
```

---

## 🌍 Idioma e Nomenclatura

### Regra Principal

> **Código em PORTUGUÊS BRASILEIRO** para facilitar manutenção por equipe local.
> Exceções: palavras-chave da linguagem, nomes de bibliotecas, termos técnicos sem tradução adequada.

### Exemplos

```typescript
// ✅ CORRETO - Português
interface Fazenda {
  id: string;
  nome: string;
  areaTotal: number;          // em hectares
  proprietarioId: string;
  talhoes: Talhao[];
  dataCriacao: Date;
}

// ❌ INCORRETO - Inglês
interface Farm {
  id: string;
  name: string;
  totalArea: number;
  ownerId: string;
  plots: Plot[];
  createdAt: Date;
}
```

### Termos Técnicos Mantidos em Inglês

Alguns termos são mantidos em inglês por serem padrão da indústria:

| Termo | Motivo |
|-------|--------|
| `id` | Padrão universal |
| `API`, `REST`, `GraphQL` | Termos técnicos |
| `cache`, `token`, `hash` | Sem tradução adequada |
| `webhook`, `endpoint` | Termos técnicos |
| `props`, `state`, `hooks` | Termos React |

### Glossário do Domínio

| Termo em Português | Descrição |
|--------------------|-----------|
| `Fazenda` | Propriedade rural do usuário |
| `Talhao` | Subdivisão da fazenda |
| `Safra` | Ciclo de produção |
| `Colheita` | Harvest |
| `Saca` | Unidade de medida (60kg) |
| `Hedge` | Proteção de preço (mantido em inglês) |
| `Cotacao` | Preço de mercado |
| `Simulacao` | Cenário projetado |
| `Alerta` | Notificação importante |
| `Recomendacao` | Sugestão do sistema |

---

## 📘 TypeScript/JavaScript

### Configuração Base

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Nomenclatura

```typescript
// Interfaces e Types - PascalCase
interface Usuario { }
type TipoAlerta = 'urgente' | 'informativo';

// Classes - PascalCase
class ServicoFazenda { }

// Funções e métodos - camelCase
function calcularRiscoTalhao() { }

// Variáveis e constantes - camelCase
const precoAtual = 142.50;
let quantidadeSacas = 1000;

// Constantes globais - SCREAMING_SNAKE_CASE
const TAXA_CORRETAGEM = 0.001;
const LIMITE_REQUISICOES_POR_MINUTO = 100;

// Enums - PascalCase para nome, SCREAMING_SNAKE_CASE para valores
enum StatusSimulacao {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  CONCLUIDA = 'CONCLUIDA',
  ERRO = 'ERRO'
}

// Arquivos - kebab-case
// servico-fazenda.ts
// tipos-usuario.ts
// hook-use-simulacao.ts
```

### Interfaces e Types

```typescript
/**
 * Representa um talhão (subdivisão) de uma fazenda.
 * Cada talhão possui características próprias que afetam
 * o cálculo de risco e produtividade estimada.
 */
interface Talhao {
  /** Identificador único do talhão */
  id: string;
  
  /** Nome ou código do talhão (ex: "A-01", "Pivô Central") */
  nome: string;
  
  /** Área em hectares */
  areaHectares: number;
  
  /** Tipo de solo predominante */
  tipoSolo: TipoSolo;
  
  /** Cultura atual plantada */
  culturaAtual: Cultura | null;
  
  /** Score de risco calculado (0-100) */
  scoreRisco: number;
  
  /** Produtividade estimada em sacas/hectare */
  produtividadeEstimada: {
    media: number;
    minima: number;
    maxima: number;
  };
  
  /** Metadados de auditoria */
  criadoEm: Date;
  atualizadoEm: Date;
}
```

### Funções

```typescript
/**
 * Calcula o score de risco financeiro de um talhão.
 * 
 * O score considera múltiplos fatores:
 * - Condições climáticas previstas
 * - Características do solo
 * - Histórico de produtividade
 * - Estágio da cultura
 * 
 * @param talhao - Dados do talhão a ser analisado
 * @param previsaoClimatica - Previsão climática para os próximos dias
 * @param historicoProducao - Histórico de safras anteriores
 * @returns Score de 0 (alto risco) a 100 (baixo risco)
 * 
 * @example
 * ```typescript
 * const score = calcularScoreRisco(talhao, previsao, historico);
 * console.log(`Score de risco: ${score}/100`);
 * ```
 */
function calcularScoreRisco(
  talhao: Talhao,
  previsaoClimatica: PrevisaoClimatica,
  historicoProducao: HistoricoProducao[]
): number {
  // Peso de cada fator no cálculo final
  const PESO_CLIMA = 0.4;
  const PESO_SOLO = 0.2;
  const PESO_HISTORICO = 0.3;
  const PESO_ESTAGIO = 0.1;
  
  // Calcula score individual de cada fator
  const scoreClima = calcularScoreClima(previsaoClimatica);
  const scoreSolo = calcularScoreSolo(talhao.tipoSolo);
  const scoreHistorico = calcularScoreHistorico(historicoProducao);
  const scoreEstagio = calcularScoreEstagio(talhao.culturaAtual);
  
  // Score final ponderado
  const scoreFinal = 
    scoreClima * PESO_CLIMA +
    scoreSolo * PESO_SOLO +
    scoreHistorico * PESO_HISTORICO +
    scoreEstagio * PESO_ESTAGIO;
  
  return Math.round(scoreFinal);
}
```

---

## ⚛️ React/Next.js

### Estrutura de Componentes

```typescript
// components/dashboard/card-lucro-projetado.tsx

import { useMemo } from 'react';
import { formatarMoeda } from '@/lib/formatadores';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { ProjecaoLucro } from '@/types/simulacao';

/**
 * Props do componente CardLucroProjetado.
 */
interface CardLucroProjetadoProps {
  /** Dados da projeção de lucro */
  projecao: ProjecaoLucro;
  
  /** Callback ao clicar em "Ver detalhes" */
  aoClicarDetalhes?: () => void;
  
  /** Se o card está em estado de loading */
  carregando?: boolean;
}

/**
 * Card que exibe o lucro projetado da safra atual.
 * 
 * Mostra o valor projetado e a variação percentual
 * em relação à safra anterior.
 * 
 * @example
 * ```tsx
 * <CardLucroProjetado 
 *   projecao={dadosProjecao}
 *   aoClicarDetalhes={() => navegarParaDetalhes()}
 * />
 * ```
 */
export function CardLucroProjetado({
  projecao,
  aoClicarDetalhes,
  carregando = false
}: CardLucroProjetadoProps) {
  // Calcula a variação percentual
  const variacaoPercentual = useMemo(() => {
    if (!projecao.lucroSafraAnterior) return null;
    
    const diferenca = projecao.lucroProjetado - projecao.lucroSafraAnterior;
    return (diferenca / projecao.lucroSafraAnterior) * 100;
  }, [projecao]);
  
  // Determina a cor baseado na variação
  const corVariacao = variacaoPercentual && variacaoPercentual >= 0 
    ? 'text-sucesso' 
    : 'text-perigo';
  
  if (carregando) {
    return <CardLucroProjetadoSkeleton />;
  }
  
  return (
    <Card className="border-l-4 border-l-sucesso">
      <CardHeader>
        <h3 className="text-sm font-medium text-cinza-600">
          📈 Lucro Projetado
        </h3>
      </CardHeader>
      
      <CardContent>
        {/* Valor principal */}
        <p className="text-2xl font-bold text-terra-profunda font-mono">
          {formatarMoeda(projecao.lucroProjetado)}
        </p>
        
        {/* Variação percentual */}
        {variacaoPercentual !== null && (
          <p className={`text-sm ${corVariacao}`}>
            {variacaoPercentual >= 0 ? '+' : ''}
            {variacaoPercentual.toFixed(1)}% vs. safra anterior
          </p>
        )}
        
        {/* Link para detalhes */}
        {aoClicarDetalhes && (
          <button 
            onClick={aoClicarDetalhes}
            className="mt-4 text-sm text-verde-lavra hover:underline"
          >
            Ver detalhes →
          </button>
        )}
      </CardContent>
    </Card>
  );
}
```

### Custom Hooks

```typescript
// hooks/use-simulacao.ts

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicoSimulacao } from '@/services/simulacao';
import type { ParametrosSimulacao, ResultadoSimulacao } from '@/types/simulacao';

/**
 * Hook para gerenciar simulações de cenários.
 * 
 * Fornece métodos para criar, listar e buscar simulações,
 * além de gerenciar o estado de loading e erros.
 * 
 * @param fazendaId - ID da fazenda para filtrar simulações
 * 
 * @example
 * ```tsx
 * function PaginaSimulacoes() {
 *   const { 
 *     simulacoes, 
 *     carregando, 
 *     criarSimulacao 
 *   } = useSimulacao(fazendaId);
 *   
 *   // ...
 * }
 * ```
 */
export function useSimulacao(fazendaId: string) {
  const queryClient = useQueryClient();
  
  // Estado local para simulação em andamento
  const [simulacaoAtual, setSimulacaoAtual] = useState<ResultadoSimulacao | null>(null);
  
  // Query para listar simulações da fazenda
  const {
    data: simulacoes,
    isLoading: carregandoLista,
    error: erroLista
  } = useQuery({
    queryKey: ['simulacoes', fazendaId],
    queryFn: () => servicoSimulacao.listarPorFazenda(fazendaId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  // Mutation para criar nova simulação
  const mutationCriar = useMutation({
    mutationFn: servicoSimulacao.criar,
    onSuccess: (novaSimulacao) => {
      // Atualiza o cache local
      queryClient.invalidateQueries({ queryKey: ['simulacoes', fazendaId] });
      setSimulacaoAtual(novaSimulacao);
    },
  });
  
  /**
   * Cria uma nova simulação com os parâmetros fornecidos.
   */
  const criarSimulacao = useCallback(
    async (parametros: ParametrosSimulacao) => {
      return mutationCriar.mutateAsync({
        fazendaId,
        ...parametros
      });
    },
    [fazendaId, mutationCriar]
  );
  
  return {
    // Dados
    simulacoes: simulacoes ?? [],
    simulacaoAtual,
    
    // Estados
    carregando: carregandoLista,
    criando: mutationCriar.isPending,
    erro: erroLista || mutationCriar.error,
    
    // Ações
    criarSimulacao,
    limparSimulacaoAtual: () => setSimulacaoAtual(null),
  };
}
```

---

## 🏗️ NestJS

### Estrutura de Módulo

```typescript
// modules/fazendas/fazendas.module.ts

import { Module } from '@nestjs/common';
import { FazendasController } from './fazendas.controller';
import { FazendasService } from './fazendas.service';
import { FazendasRepository } from './fazendas.repository';
import { TalhoesModule } from '../talhoes/talhoes.module';

/**
 * Módulo responsável pelo gerenciamento de fazendas.
 * 
 * Inclui operações de CRUD, cálculo de métricas agregadas
 * e integração com o módulo de talhões.
 */
@Module({
  imports: [TalhoesModule],
  controllers: [FazendasController],
  providers: [FazendasService, FazendasRepository],
  exports: [FazendasService],
})
export class FazendasModule {}
```

### Service

```typescript
// modules/fazendas/fazendas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { FazendasRepository } from './fazendas.repository';
import { CriarFazendaDto } from './dto/criar-fazenda.dto';
import { AtualizarFazendaDto } from './dto/atualizar-fazenda.dto';
import type { Fazenda } from './entities/fazenda.entity';

/**
 * Serviço de negócios para gerenciamento de fazendas.
 * 
 * Contém a lógica de negócio relacionada a fazendas,
 * delegando operações de persistência ao repository.
 */
@Injectable()
export class FazendasService {
  constructor(
    private readonly fazendasRepository: FazendasRepository,
  ) {}
  
  /**
   * Cria uma nova fazenda para o usuário.
   * 
   * @param usuarioId - ID do usuário proprietário
   * @param dados - Dados da fazenda a ser criada
   * @returns Fazenda criada com ID gerado
   * @throws ConflictException se já existir fazenda com mesmo nome
   */
  async criar(usuarioId: string, dados: CriarFazendaDto): Promise<Fazenda> {
    // Verifica se já existe fazenda com mesmo nome para o usuário
    const fazendaExistente = await this.fazendasRepository.buscarPorNome(
      usuarioId,
      dados.nome
    );
    
    if (fazendaExistente) {
      throw new ConflictException(
        `Já existe uma fazenda com o nome "${dados.nome}"`
      );
    }
    
    // Cria a fazenda
    const fazenda = await this.fazendasRepository.criar({
      ...dados,
      proprietarioId: usuarioId,
    });
    
    return fazenda;
  }
  
  /**
   * Busca uma fazenda por ID.
   * 
   * @param id - ID da fazenda
   * @returns Fazenda encontrada
   * @throws NotFoundException se a fazenda não existir
   */
  async buscarPorId(id: string): Promise<Fazenda> {
    const fazenda = await this.fazendasRepository.buscarPorId(id);
    
    if (!fazenda) {
      throw new NotFoundException(`Fazenda com ID "${id}" não encontrada`);
    }
    
    return fazenda;
  }
  
  /**
   * Lista todas as fazendas de um usuário.
   * 
   * @param usuarioId - ID do usuário proprietário
   * @returns Lista de fazendas do usuário
   */
  async listarPorUsuario(usuarioId: string): Promise<Fazenda[]> {
    return this.fazendasRepository.listarPorUsuario(usuarioId);
  }
  
  /**
   * Calcula métricas agregadas da fazenda.
   * 
   * Inclui área total, número de talhões, score médio de risco
   * e produtividade estimada total.
   * 
   * @param fazendaId - ID da fazenda
   * @returns Métricas calculadas
   */
  async calcularMetricas(fazendaId: string): Promise<MetricasFazenda> {
    const fazenda = await this.buscarPorId(fazendaId);
    
    // Calcula métricas baseado nos talhões
    const areaTotal = fazenda.talhoes.reduce(
      (soma, talhao) => soma + talhao.areaHectares,
      0
    );
    
    const scoreRiscoMedio = fazenda.talhoes.reduce(
      (soma, talhao) => soma + talhao.scoreRisco,
      0
    ) / fazenda.talhoes.length;
    
    return {
      areaTotal,
      quantidadeTalhoes: fazenda.talhoes.length,
      scoreRiscoMedio: Math.round(scoreRiscoMedio),
      produtividadeEstimadaTotal: this.calcularProdutividadeTotal(fazenda),
    };
  }
}
```

---

## 🐹 Go

### Nomenclatura

```go
// Pacotes - lowercase, sem underscores
package climaservice

// Structs exportadas - PascalCase
type PrevisaoClimatica struct {
    ID                string    `json:"id"`
    Latitude          float64   `json:"latitude"`
    Longitude         float64   `json:"longitude"`
    DataPrevisao      time.Time `json:"data_previsao"`      // JSON em snake_case
    TemperaturaMedia  float64   `json:"temperatura_media"`
    PrecipitacaoMM    float64   `json:"precipitacao_mm"`
    ProbabilidadeChuva float64  `json:"probabilidade_chuva"`
}

// Structs não exportadas - camelCase
type configInterna struct {
    timeout time.Duration
    maxRetries int
}

// Funções exportadas - PascalCase
func BuscarPrevisao(latitude, longitude float64) (*PrevisaoClimatica, error) {
    // ...
}

// Funções não exportadas - camelCase
func validarCoordenadas(lat, long float64) error {
    // ...
}

// Constantes - PascalCase ou camelCase dependendo se exportada
const (
    MaxDiasPrevisao = 90      // Exportada
    urlBaseAPI      = "..."   // Não exportada
)
```

### Estrutura de Serviço

```go
// services/clima/servico.go

package clima

import (
    "context"
    "fmt"
    "time"
)

// ServicoClima gerencia a obtenção e processamento de dados climáticos.
// Integra com APIs externas (INMET, CPTEC, NASA POWER) e
// fornece dados normalizados para o sistema.
type ServicoClima struct {
    clienteINMET   *ClienteINMET
    clienteCPTEC   *ClienteCPTEC
    clienteNASA    *ClienteNASA
    cache          *CacheRedis
    logger         *Logger
}

// NovoServicoClima cria uma nova instância do serviço de clima.
//
// Parâmetros:
//   - config: Configurações de conexão com APIs externas
//   - cache: Cliente Redis para cache de dados
//   - logger: Logger para registro de operações
//
// Retorna:
//   - *ServicoClima: Instância configurada do serviço
//   - error: Erro se a configuração falhar
func NovoServicoClima(config ConfigClima, cache *CacheRedis, logger *Logger) (*ServicoClima, error) {
    // Valida configurações obrigatórias
    if config.ChaveINMET == "" {
        return nil, fmt.Errorf("chave da API INMET é obrigatória")
    }
    
    // Inicializa clientes
    clienteINMET, err := NovoClienteINMET(config.ChaveINMET)
    if err != nil {
        return nil, fmt.Errorf("erro ao criar cliente INMET: %w", err)
    }
    
    return &ServicoClima{
        clienteINMET: clienteINMET,
        clienteCPTEC: NovoClienteCPTEC(),
        clienteNASA:  NovoClienteNASA(config.ChaveNASA),
        cache:        cache,
        logger:       logger,
    }, nil
}

// BuscarPrevisao obtém a previsão climática para uma localização.
//
// A função primeiro verifica o cache. Se não encontrar dados válidos,
// consulta as APIs externas e combina os resultados para uma previsão
// mais precisa.
//
// Parâmetros:
//   - ctx: Contexto para cancelamento e timeout
//   - latitude: Latitude em graus decimais (-90 a 90)
//   - longitude: Longitude em graus decimais (-180 a 180)
//   - dias: Número de dias de previsão (máximo 90)
//
// Retorna:
//   - []PrevisaoClimatica: Lista de previsões por dia
//   - error: Erro se a busca falhar
//
// Exemplo:
//
//   previsoes, err := servico.BuscarPrevisao(ctx, -23.5505, -46.6333, 15)
//   if err != nil {
//       log.Printf("Erro ao buscar previsão: %v", err)
//       return
//   }
//   for _, p := range previsoes {
//       fmt.Printf("Data: %s, Temp: %.1f°C\n", p.DataPrevisao, p.TemperaturaMedia)
//   }
func (s *ServicoClima) BuscarPrevisao(
    ctx context.Context,
    latitude, longitude float64,
    dias int,
) ([]PrevisaoClimatica, error) {
    // Valida parâmetros de entrada
    if err := validarCoordenadas(latitude, longitude); err != nil {
        return nil, fmt.Errorf("coordenadas inválidas: %w", err)
    }
    
    if dias < 1 || dias > MaxDiasPrevisao {
        return nil, fmt.Errorf("dias deve estar entre 1 e %d", MaxDiasPrevisao)
    }
    
    // Tenta buscar do cache primeiro
    chaveCache := fmt.Sprintf("previsao:%f:%f:%d", latitude, longitude, dias)
    if dados, encontrado := s.cache.Buscar(ctx, chaveCache); encontrado {
        s.logger.Debug("Previsão encontrada no cache", "chave", chaveCache)
        return dados.([]PrevisaoClimatica), nil
    }
    
    // Busca das APIs em paralelo
    s.logger.Info("Buscando previsão das APIs externas",
        "latitude", latitude,
        "longitude", longitude,
        "dias", dias,
    )
    
    // ... implementação
    
    return previsoes, nil
}
```

---

## 🐍 Python

### Nomenclatura

```python
# Módulos e pacotes - snake_case
# servico_previsao.py
# modelos_clima.py

# Classes - PascalCase
class ModeloPrevisaoClimatica:
    pass

# Funções e variáveis - snake_case
def calcular_risco_talhao(dados_talhao: dict) -> float:
    valor_calculado = 0.0
    return valor_calculado

# Constantes - SCREAMING_SNAKE_CASE
TAXA_APRENDIZADO_PADRAO = 0.001
MAX_EPOCAS_TREINAMENTO = 100
```

### Estrutura de Modelo ML

```python
# ml/models/modelo_previsao_climatica.py

"""
Modelo de previsão climática baseado em LSTM + Transformers.

Este módulo implementa o modelo principal de previsão climática
do Lavra.ai, combinando LSTM para captura de padrões temporais
e Transformers para relações de longo prazo.
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple
import torch
import torch.nn as nn
import numpy as np


@dataclass
class ConfiguracaoModelo:
    """
    Configurações do modelo de previsão climática.
    
    Attributes:
        dimensao_entrada: Número de features de entrada
        dimensao_oculta: Dimensão das camadas ocultas
        numero_camadas_lstm: Quantidade de camadas LSTM empilhadas
        numero_cabecas_atencao: Número de cabeças de atenção do Transformer
        taxa_dropout: Taxa de dropout para regularização
        tamanho_sequencia: Tamanho da sequência temporal de entrada
    """
    dimensao_entrada: int = 10
    dimensao_oculta: int = 128
    numero_camadas_lstm: int = 2
    numero_cabecas_atencao: int = 8
    taxa_dropout: float = 0.1
    tamanho_sequencia: int = 30  # 30 dias de histórico


class ModeloPrevisaoClimatica(nn.Module):
    """
    Modelo híbrido LSTM + Transformer para previsão climática.
    
    Arquitetura:
    1. Camada de embedding para features de entrada
    2. Bloco LSTM para captura de padrões temporais locais
    3. Bloco Transformer para relações de longo prazo
    4. Camada de saída com projeção para variáveis climáticas
    
    Example:
        >>> config = ConfiguracaoModelo(dimensao_entrada=10, dimensao_oculta=128)
        >>> modelo = ModeloPrevisaoClimatica(config)
        >>> entrada = torch.randn(32, 30, 10)  # batch=32, seq=30, features=10
        >>> saida = modelo(entrada)
        >>> print(saida.shape)  # torch.Size([32, 15, 5])  # 15 dias, 5 variáveis
    """
    
    def __init__(self, config: ConfiguracaoModelo):
        """
        Inicializa o modelo com as configurações fornecidas.
        
        Args:
            config: Objeto ConfiguracaoModelo com os hiperparâmetros
        """
        super().__init__()
        self.config = config
        
        # Camada de embedding
        self.embedding = nn.Linear(
            config.dimensao_entrada, 
            config.dimensao_oculta
        )
        
        # Bloco LSTM
        self.lstm = nn.LSTM(
            input_size=config.dimensao_oculta,
            hidden_size=config.dimensao_oculta,
            num_layers=config.numero_camadas_lstm,
            batch_first=True,
            dropout=config.taxa_dropout if config.numero_camadas_lstm > 1 else 0,
            bidirectional=True
        )
        
        # Bloco Transformer
        camada_encoder = nn.TransformerEncoderLayer(
            d_model=config.dimensao_oculta * 2,  # *2 por ser bidirecional
            nhead=config.numero_cabecas_atencao,
            dropout=config.taxa_dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(
            camada_encoder, 
            num_layers=2
        )
        
        # Camada de saída
        # Projeta para 15 dias de previsão, 5 variáveis climáticas
        self.projecao_saida = nn.Linear(
            config.dimensao_oculta * 2, 
            5  # temperatura, precipitação, umidade, radiação, vento
        )
        
        self.dropout = nn.Dropout(config.taxa_dropout)
    
    def forward(
        self, 
        entrada: torch.Tensor,
        mascara: Optional[torch.Tensor] = None
    ) -> torch.Tensor:
        """
        Forward pass do modelo.
        
        Args:
            entrada: Tensor de entrada com shape (batch, sequencia, features)
            mascara: Máscara opcional para posições inválidas
            
        Returns:
            Tensor com previsões de shape (batch, dias_previsao, variaveis)
        """
        # Embedding das features
        x = self.embedding(entrada)
        x = self.dropout(x)
        
        # LSTM para padrões temporais
        x, _ = self.lstm(x)
        
        # Transformer para relações de longo prazo
        x = self.transformer(x, src_key_padding_mask=mascara)
        
        # Projeção para variáveis de saída
        # Usa apenas os últimos 15 timesteps como previsão
        x = x[:, -15:, :]
        saida = self.projecao_saida(x)
        
        return saida
    
    def prever(
        self, 
        dados_historico: np.ndarray,
        dias_previsao: int = 15
    ) -> dict:
        """
        Gera previsão climática a partir de dados históricos.
        
        Este método é o ponto de entrada para inferência em produção.
        Processa os dados de entrada, executa o modelo e retorna
        as previsões em formato estruturado.
        
        Args:
            dados_historico: Array numpy com histórico climático
                            Shape: (dias, variaveis)
            dias_previsao: Número de dias para prever (padrão: 15)
            
        Returns:
            Dicionário com previsões estruturadas:
            {
                'temperatura_media': [...],
                'precipitacao_mm': [...],
                'umidade_relativa': [...],
                'radiacao_solar': [...],
                'velocidade_vento': [...],
                'datas': [...],
                'confianca': [...]  # Intervalo de confiança
            }
        """
        self.eval()  # Modo de avaliação
        
        with torch.no_grad():
            # Prepara entrada
            entrada = torch.tensor(dados_historico, dtype=torch.float32)
            entrada = entrada.unsqueeze(0)  # Adiciona dimensão de batch
            
            # Executa modelo
            saida = self.forward(entrada)
            
            # Converte para numpy
            previsoes = saida.squeeze(0).numpy()
        
        # Estrutura resultado
        return {
            'temperatura_media': previsoes[:, 0].tolist(),
            'precipitacao_mm': previsoes[:, 1].tolist(),
            'umidade_relativa': previsoes[:, 2].tolist(),
            'radiacao_solar': previsoes[:, 3].tolist(),
            'velocidade_vento': previsoes[:, 4].tolist(),
        }
```

---

## 🗄️ Banco de Dados

### Nomenclatura de Tabelas e Colunas

```sql
-- Tabelas - snake_case, plural
CREATE TABLE fazendas (
    -- Colunas - snake_case
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    area_total_hectares DECIMAL(10, 2) NOT NULL,
    proprietario_id UUID NOT NULL REFERENCES usuarios(id),
    
    -- Timestamps padrão
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Soft delete
    deletado_em TIMESTAMP WITH TIME ZONE
);

-- Índices - idx_tabela_coluna
CREATE INDEX idx_fazendas_proprietario_id ON fazendas(proprietario_id);
CREATE INDEX idx_fazendas_nome ON fazendas(nome);

-- Foreign keys - fk_tabela_origem_tabela_destino
ALTER TABLE fazendas
ADD CONSTRAINT fk_fazendas_usuarios
FOREIGN KEY (proprietario_id) REFERENCES usuarios(id);
```

### Prisma Schema

```prisma
// prisma/schema.prisma

/// Representa uma fazenda cadastrada no sistema.
/// Cada fazenda pertence a um usuário e contém múltiplos talhões.
model Fazenda {
  /// Identificador único da fazenda
  id                String   @id @default(uuid())
  
  /// Nome da fazenda
  nome              String
  
  /// Área total em hectares
  areaTotalHectares Decimal  @map("area_total_hectares")
  
  /// ID do usuário proprietário
  proprietarioId    String   @map("proprietario_id")
  
  /// Relacionamento com usuário
  proprietario      Usuario  @relation(fields: [proprietarioId], references: [id])
  
  /// Talhões da fazenda
  talhoes           Talhao[]
  
  /// Simulações realizadas
  simulacoes        Simulacao[]
  
  /// Metadados de auditoria
  criadoEm          DateTime @default(now()) @map("criado_em")
  atualizadoEm      DateTime @updatedAt @map("atualizado_em")
  deletadoEm        DateTime? @map("deletado_em")
  
  @@map("fazendas")
  @@index([proprietarioId])
  @@index([nome])
}
```

---

## 🔀 Git e Commits

### Branches

```
main              → Produção (protegida)
develop           → Desenvolvimento principal
feature/xxx       → Novas funcionalidades
bugfix/xxx        → Correções de bugs
hotfix/xxx        → Correções urgentes em produção
release/x.x.x     → Preparação para release
```

### Commits - Conventional Commits em Português

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

#### Tipos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (não afeta lógica) |
| `refactor` | Refatoração |
| `perf` | Melhoria de performance |
| `test` | Testes |
| `chore` | Manutenção, configs |

#### Exemplos

```bash
feat(fazendas): adiciona endpoint para listar talhões

Implementa GET /api/fazendas/:id/talhoes que retorna
todos os talhões de uma fazenda com seus scores de risco.

Closes #123

---

fix(simulacao): corrige cálculo de risco em cenário de veranico

O cálculo não considerava corretamente o déficit hídrico
acumulado dos últimos 15 dias.

Fixes #456

---

docs(readme): atualiza instruções de instalação

---

refactor(api): extrai lógica de validação para módulo separado
```

---

## 📖 Documentação de Código

### Princípios

1. **Todo arquivo** deve ter um comentário de cabeçalho explicando seu propósito
2. **Toda função/método público** deve ter JSDoc/docstring
3. **Toda lógica complexa** deve ter comentários inline explicando o "porquê"
4. **Todo tipo/interface** deve ter descrição dos campos

### Template de Cabeçalho de Arquivo

```typescript
/**
 * @fileoverview Serviço de cálculo de risco financeiro por talhão.
 * 
 * Este módulo é responsável por calcular o score de risco de cada
 * talhão baseado em múltiplos fatores: clima, solo, histórico e
 * condições de mercado.
 * 
 * O score resultante é usado pelo motor de decisão para gerar
 * recomendações de hedge e momento ideal de venda.
 * 
 * @author Equipe Lavra.ai
 * @since 1.0.0
 * @see {@link ../docs/ARQUITETURA.md} para visão geral do sistema
 */
```

---

## 🧪 Testes

### Nomenclatura

```typescript
// Arquivo de teste - mesmo nome + .spec.ts ou .test.ts
// fazendas.service.ts → fazendas.service.spec.ts

describe('FazendasService', () => {
  describe('criar', () => {
    it('deve criar uma fazenda com dados válidos', async () => {
      // ...
    });
    
    it('deve lançar erro se nome já existir', async () => {
      // ...
    });
    
    it('deve calcular área total baseado nos talhões', async () => {
      // ...
    });
  });
  
  describe('calcularMetricas', () => {
    it('deve retornar score médio de risco dos talhões', async () => {
      // ...
    });
  });
});
```

### Estrutura de Teste

```typescript
describe('calcularScoreRisco', () => {
  it('deve retornar score alto (>80) para talhão com irrigação e bom histórico', async () => {
    // Arrange (Preparação)
    const talhao = criarTalhaoMock({
      possuiIrrigacao: true,
      historicoExcelente: true,
    });
    const previsao = criarPrevisaoMock({ probabilidadeChuva: 0.7 });
    
    // Act (Ação)
    const score = await calcularScoreRisco(talhao, previsao);
    
    // Assert (Verificação)
    expect(score).toBeGreaterThan(80);
  });
});
```

---

*Documento atualizado em: 24 de Dezembro de 2025*
*Versão: 1.0*
