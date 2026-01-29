// Dados mockados para Simulador de Hedge
export const mockHedgeData = {
  // Preços de mercado atuais
  precosMercado: {
    soja: {
      futuro: 140.50, // R$/saca
      fisico: 138.75,
      variacao: 2.3, // %
      bolsa: 'B3',
      contrato: 'SOJ2026',
      vencimento: new Date('2026-03-31'),
    },
    milho: {
      futuro: 72.80,
      fisico: 71.20,
      variacao: -1.2,
      bolsa: 'B3',
      contrato: 'CNI2026',
      vencimento: new Date('2026-05-31'),
    },
    dolar: {
      atual: 5.82,
      futuro: 5.91,
      variacao: 1.5,
    },
  },

  // Posições de hedge existentes
  posicoesExistentes: [
    {
      id: '1',
      cultura: 'soja',
      tipo: 'venda_futura',
      quantidade: 50000, // sacas
      precoTravado: 135.20,
      dataOperacao: new Date('2025-10-15'),
      vencimento: new Date('2026-03-31'),
      bolsa: 'B3',
      contrato: 'SOJ2026',
      status: 'ativo',
      margemUtilizada: 175000,
      resultadoAtual: 265000, // ganho
    },
    {
      id: '2',
      cultura: 'milho',
      tipo: 'venda_futura',
      quantidade: 30000,
      precoTravado: 74.50,
      dataOperacao: new Date('2025-11-01'),
      vencimento: new Date('2026-05-31'),
      bolsa: 'B3',
      contrato: 'CNI2026',
      status: 'ativo',
      margemUtilizada: 89000,
      resultadoAtual: -51000, // perda
    },
    {
      id: '3',
      cultura: 'soja',
      tipo: 'opcao_put',
      quantidade: 20000,
      precoTravado: 130.00, // strike
      dataOperacao: new Date('2025-12-05'),
      vencimento: new Date('2026-03-15'),
      bolsa: 'B3',
      contrato: 'SOJW130',
      status: 'ativo',
      margemUtilizada: 24000, // prêmio pago
      resultadoAtual: -24000, // out of the money
    },
  ],

  // Estratégias de hedge disponíveis
  estrategias: [
    {
      id: 'venda_futura',
      nome: 'Venda Futura',
      descricao: 'Travamento de preço através de contratos futuros na bolsa',
      risco: 'medio',
      liquidez: 'alta',
      custoOperacional: 0.5, // % sobre valor
      margemNecessaria: 3.5, // % sobre valor
      vantagens: ['Proteção total contra queda', 'Alta liquidez', 'Facilidade operacional'],
      desvantagens: ['Abre mão de ganhos com alta', 'Exige margem de garantia'],
      melhorPara: 'Produtor com aversão a risco que quer garantir preço mínimo',
    },
    {
      id: 'opcao_put',
      nome: 'Opção de Venda (Put)',
      descricao: 'Direito de vender a um preço mínimo, mantendo ganhos potenciais',
      risco: 'baixo',
      liquidez: 'media',
      custoOperacional: 1.2,
      margemNecessaria: 0, // paga prêmio à vista
      vantagens: ['Protege contra queda', 'Mantém ganhos com alta', 'Risco limitado ao prêmio'],
      desvantagens: ['Custo do prêmio', 'Liquidez menor'],
      melhorPara: 'Produtor que quer proteção sem abrir mão de ganhos',
    },
    {
      id: 'collar',
      nome: 'Collar (Put + Call)',
      descricao: 'Combinação de opções que limita perdas e ganhos',
      risco: 'baixo',
      liquidez: 'media',
      custoOperacional: 0.8,
      margemNecessaria: 0,
      vantagens: ['Custo reduzido', 'Proteção contra queda', 'Orçamento previsível'],
      desvantagens: ['Limita ganhos com alta', 'Mais complexo'],
      melhorPara: 'Produtor que aceita limite de ganho para reduzir custo de proteção',
    },
    {
      id: 'swap',
      nome: 'Swap Cambial',
      descricao: 'Troca de índices para proteção cambial',
      risco: 'medio',
      liquidez: 'alta',
      custoOperacional: 0.3,
      margemNecessaria: 1.5,
      vantagens: ['Proteção cambial', 'Flexibilidade de prazos', 'Sem desembolso inicial alto'],
      desvantagens: ['Exposição a variação de taxas', 'Mais complexo'],
      melhorPara: 'Operações com exposição cambial significativa',
    },
  ],

  // Histórico de preços para gráfico
  historicoPrecos: {
    soja: [
      { data: '2025-07', preco: 132.50 },
      { data: '2025-08', preco: 135.20 },
      { data: '2025-09', preco: 138.40 },
      { data: '2025-10', preco: 136.80 },
      { data: '2025-11', preco: 139.60 },
      { data: '2025-12', preco: 140.50 },
      { data: '2026-01', preco: 140.50 },
    ],
    milho: [
      { data: '2025-07', preco: 68.30 },
      { data: '2025-08', preco: 70.50 },
      { data: '2025-09', preco: 73.20 },
      { data: '2025-10', preco: 74.50 },
      { data: '2025-11', preco: 73.80 },
      { data: '2025-12', preco: 72.80 },
      { data: '2026-01', preco: 72.80 },
    ],
  },

  // Cenários de simulação
  cenarios: [
    {
      id: 'otimista',
      nome: 'Cenário Otimista',
      probabilidade: 25,
      precoFinalSoja: 155.00,
      precoFinalMilho: 82.00,
      dolarFinal: 5.50,
      descricao: 'Demanda forte, clima favorável, dólar em queda',
    },
    {
      id: 'base',
      nome: 'Cenário Base',
      probabilidade: 50,
      precoFinalSoja: 142.00,
      precoFinalMilho: 73.50,
      dolarFinal: 5.85,
      descricao: 'Condições normais de mercado',
    },
    {
      id: 'pessimista',
      nome: 'Cenário Pessimista',
      probabilidade: 25,
      precoFinalSoja: 125.00,
      precoFinalMilho: 65.00,
      dolarFinal: 6.20,
      descricao: 'Safra recorde, demanda fraca, dólar em alta',
    },
  ],

  // Produção estimada do usuário
  producaoEstimada: {
    soja: {
      areaPlantada: 1200, // ha
      produtividadeEsperada: 58, // sc/ha
      producaoTotal: 69600, // sacas
      custoProducao: 95.50, // R$/sc
      hedgeAtual: 50000, // sacas já travadas
      percentualHedge: 71.8, // %
    },
    milho: {
      areaPlantada: 800,
      produtividadeEsperada: 120,
      producaoTotal: 96000,
      custoProducao: 52.30,
      hedgeAtual: 30000,
      percentualHedge: 31.3,
    },
  },

  // Recomendações inteligentes
  recomendacoes: [
    {
      id: '1',
      tipo: 'aumento_hedge',
      prioridade: 'alta',
      cultura: 'milho',
      titulo: 'Baixa proteção em milho',
      descricao: 'Apenas 31% da produção de milho está protegida. Com preços 5% acima do custo, considere aumentar hedge.',
      acaoSugerida: 'Travar mais 30.000 sacas',
      estrategiaSugerida: 'venda_futura',
      impactoFinanceiro: 2184000,
      riscoReduzido: 'alto',
    },
    {
      id: '2',
      tipo: 'ajuste_estrategia',
      prioridade: 'media',
      cultura: 'soja',
      titulo: 'Oportunidade de Collar',
      descricao: 'Mercado volátil com viés de alta. Collar pode proteger contra queda mantendo ganhos até R$ 150/sc.',
      acaoSugerida: 'Converter 20.000 sc em Collar',
      estrategiaSugerida: 'collar',
      impactoFinanceiro: 0,
      riscoReduzido: 'medio',
    },
    {
      id: '3',
      tipo: 'timing',
      prioridade: 'baixa',
      cultura: 'soja',
      titulo: 'Janela de preço favorável',
      descricao: 'Preço futuro está R$ 1,75/sc acima do físico. Momento favorável para travar vendas.',
      acaoSugerida: 'Avaliar em 7 dias',
      estrategiaSugerida: 'venda_futura',
      impactoFinanceiro: 34300,
      riscoReduzido: 'baixo',
    },
  ],
}

// Função auxiliar para calcular resultado de hedge
export function calcularResultadoHedge(
  quantidade: number,
  precoTravado: number,
  precoAtual: number,
  tipo: string
): number {
  if (tipo === 'venda_futura') {
    // Ganho = (Preço Travado - Preço Atual) * Quantidade
    return (precoTravado - precoAtual) * quantidade
  }
  if (tipo === 'opcao_put') {
    // Se preço atual < strike, ganho = diferença * quantidade - prêmio
    // Se preço atual >= strike, perda = prêmio
    if (precoAtual < precoTravado) {
      const premio = quantidade * 1.2 // mock: R$ 1,20/sc de prêmio
      return (precoTravado - precoAtual) * quantidade - premio
    }
    return -(quantidade * 1.2)
  }
  return 0
}
