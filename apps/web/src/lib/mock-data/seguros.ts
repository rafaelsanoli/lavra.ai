// Dados mockados para Módulo de Seguros
export const mockSegurosData = {
  apolices: [
    {
      id: '1',
      seguradora: 'Brasilseg Agro',
      tipo: 'Seguro Agrícola - Multirrisco',
      cobertura: 2500000,
      premio: 87500,
      vigenciaInicio: new Date('2025-10-01'),
      vigenciaFim: new Date('2026-03-31'),
      status: 'ativo',
      culturas: ['Soja', 'Milho'],
      riscosCobertos: ['Granizo', 'Geada', 'Seca', 'Vendaval'],
      franquia: 5, // %
      numeroApolice: 'AG-2025-001234',
    },
    {
      id: '2',
      seguradora: 'Porto Seguro Rural',
      tipo: 'Seguro Patrimonial',
      cobertura: 850000,
      premio: 12750,
      vigenciaInicio: new Date('2025-07-01'),
      vigenciaFim: new Date('2026-06-30'),
      status: 'ativo',
      culturas: [],
      riscosCobertos: ['Incêndio', 'Raio', 'Explosão', 'Queda de aeronave'],
      franquia: 0,
      numeroApolice: 'PT-2025-005678',
    },
    {
      id: '3',
      seguradora: 'Sancor Seguros',
      tipo: 'Seguro de Receita Agrícola',
      cobertura: 3200000,
      premio: 128000,
      vigenciaInicio: new Date('2025-11-01'),
      vigenciaFim: new Date('2026-04-30'),
      status: 'ativo',
      culturas: ['Soja'],
      riscosCobertos: ['Queda de produtividade', 'Variação de preço'],
      franquia: 10,
      numeroApolice: 'SC-2025-002891',
    },
  ],

  cotacoes: [
    {
      id: '1',
      seguradora: 'Allianz Agro',
      tipo: 'Seguro Multirrisco',
      cobertura: 2800000,
      premioEstimado: 95200,
      culturas: ['Soja', 'Milho', 'Algodão'],
      riscosCobertos: ['Granizo', 'Geada', 'Seca', 'Vendaval', 'Chuva excessiva'],
      franquia: 4,
      vigenciaMeses: 6,
      status: 'pendente',
      dataValidade: new Date('2026-01-20'),
    },
    {
      id: '2',
      seguradora: 'Swiss Re Brasil',
      tipo: 'Seguro Paramétrico',
      cobertura: 2500000,
      premioEstimado: 75000,
      culturas: ['Soja'],
      riscosCobertos: ['Índice pluviométrico', 'Temperatura extrema'],
      franquia: 0,
      vigenciaMeses: 6,
      status: 'em_analise',
      dataValidade: new Date('2026-01-25'),
    },
    {
      id: '3',
      seguradora: 'Mapfre Agronegócio',
      tipo: 'Seguro de Receita',
      cobertura: 3500000,
      premioEstimado: 140000,
      culturas: ['Soja', 'Milho'],
      riscosCobertos: ['Produtividade', 'Preço de mercado'],
      franquia: 8,
      vigenciaMeses: 7,
      status: 'aprovada',
      dataValidade: new Date('2026-02-01'),
    },
  ],

  sinistros: [
    {
      id: '1',
      apolice: 'AG-2025-001234',
      tipo: 'Granizo',
      dataOcorrencia: new Date('2025-12-10'),
      areaAfetada: 45,
      perdaEstimada: 135000,
      indenizacaoPaga: 128250,
      status: 'pago',
      dataPagamento: new Date('2025-12-28'),
    },
    {
      id: '2',
      apolice: 'SC-2025-002891',
      tipo: 'Seca',
      dataOcorrencia: new Date('2025-11-20'),
      areaAfetada: 80,
      perdaEstimada: 240000,
      indenizacaoPaga: 0,
      status: 'em_analise',
      dataPagamento: null,
    },
  ],

  estatisticas: {
    coberturaTotal: 6550000,
    premioTotal: 228250,
    sinistrosPagos: 128250,
    sinistrosAbertos: 1,
    taxaSinistralidade: 56.2, // %
    economiaFiscal: 45650, // Dedução IR
  },

  recomendacoes: [
    {
      id: '1',
      tipo: 'cobertura_insuficiente',
      prioridade: 'alta',
      titulo: 'Cobertura insuficiente para área de milho',
      descricao: 'Sua área de milho (400 ha) possui apenas 30% de cobertura. Recomendamos aumentar para pelo menos 70%.',
      acaoSugerida: 'Solicitar cotação adicional',
      impactoFinanceiro: 180000,
    },
    {
      id: '2',
      tipo: 'vencimento_proximo',
      prioridade: 'media',
      titulo: 'Apólice vencendo em 45 dias',
      descricao: 'A apólice AG-2025-001234 vence em 15/03/2026. Inicie renovação com antecedência para não perder cobertura.',
      acaoSugerida: 'Renovar apólice',
      impactoFinanceiro: 0,
    },
    {
      id: '3',
      tipo: 'oportunidade',
      prioridade: 'baixa',
      titulo: 'Seguro paramétrico pode reduzir custos',
      descricao: 'Com base em seu histórico climático, um seguro paramétrico pode ser 15-20% mais econômico.',
      acaoSugerida: 'Comparar opções',
      impactoFinanceiro: -17550,
    },
  ],
}

// Dados para gráfico de sinistralidade
export const mockSinistralidade = [
  { ano: '2021', sinistros: 45000, indenizacoes: 32000 },
  { ano: '2022', sinistros: 62000, indenizacoes: 48000 },
  { ano: '2023', sinistros: 38000, indenizacoes: 28000 },
  { ano: '2024', sinistros: 71000, indenizacoes: 55000 },
  { ano: '2025', sinistros: 128250, indenizacoes: 128250 },
]

// Tipos de seguro disponíveis
export const tiposSeguros = [
  {
    id: 'multirrisco',
    nome: 'Seguro Multirrisco',
    descricao: 'Cobertura ampla contra eventos climáticos adversos',
    riscos: ['Granizo', 'Geada', 'Seca', 'Vendaval', 'Chuva excessiva', 'Tromba d\'água'],
    premioMedio: 3.5, // % do valor segurado
    melhorPara: 'Produtores em regiões com histórico de eventos climáticos extremos',
  },
  {
    id: 'parametrico',
    nome: 'Seguro Paramétrico',
    descricao: 'Indenização automática baseada em índices climáticos',
    riscos: ['Índice pluviométrico', 'Temperatura', 'Umidade do solo'],
    premioMedio: 2.8,
    melhorPara: 'Operações que buscam agilidade no pagamento de sinistros',
  },
  {
    id: 'receita',
    nome: 'Seguro de Receita',
    descricao: 'Protege contra queda de produtividade e variação de preços',
    riscos: ['Produtividade abaixo da média', 'Queda de preço de mercado'],
    premioMedio: 4.2,
    melhorPara: 'Produtores expostos à volatilidade de preços',
  },
  {
    id: 'patrimonial',
    nome: 'Seguro Patrimonial Rural',
    descricao: 'Cobertura para benfeitorias, máquinas e equipamentos',
    riscos: ['Incêndio', 'Raio', 'Explosão', 'Roubo', 'Queda de aeronave'],
    premioMedio: 1.5,
    melhorPara: 'Proteção de ativos fixos e infraestrutura da fazenda',
  },
]
