export const mockCenariosData = {
  cenarios: [
    {
      id: 1,
      nome: 'Cenário Base 2024/25',
      descricao: 'Projeção conservadora com preços médios e produtividade histórica',
      dataCriacao: new Date('2024-06-10'),
      status: 'ativo',
      parametros: {
        culturas: [
          { cultura: 'Soja', area: 800, produtividade: 60, preco: 135, custos: 4800 },
          { cultura: 'Milho', area: 650, produtividade: 140, preco: 68, custos: 5200 },
        ],
        custoFixo: 850000,
        investimentos: 320000,
      },
      resultados: {
        receitaBruta: 12450000,
        custosVariaveis: 7220000,
        custoTotal: 8390000,
        lucroLiquido: 4060000,
        margemLiquida: 32.6,
        roi: 126.8,
      },
    },
    {
      id: 2,
      nome: 'Cenário Otimista',
      descricao: 'Alta produtividade e preços favoráveis no mercado',
      dataCriacao: new Date('2024-06-12'),
      status: 'simulacao',
      parametros: {
        culturas: [
          { cultura: 'Soja', area: 800, produtividade: 68, preco: 145, custos: 4900 },
          { cultura: 'Milho', area: 650, produtividade: 155, preco: 75, custos: 5400 },
        ],
        custoFixo: 850000,
        investimentos: 320000,
      },
      resultados: {
        receitaBruta: 15408000,
        custosVariaveis: 8420000,
        custoTotal: 9590000,
        lucroLiquido: 5818000,
        margemLiquida: 37.8,
        roi: 181.8,
      },
    },
    {
      id: 3,
      nome: 'Cenário Pessimista',
      descricao: 'Adversidades climáticas e preços em baixa',
      dataCriacao: new Date('2024-06-13'),
      status: 'simulacao',
      parametros: {
        culturas: [
          { cultura: 'Soja', area: 800, produtividade: 52, preco: 125, custos: 4700 },
          { cultura: 'Milho', area: 650, produtividade: 120, preco: 62, custos: 5000 },
        ],
        custoFixo: 850000,
        investimentos: 320000,
      },
      resultados: {
        receitaBruta: 10020000,
        custosVariaveis: 6990000,
        custoTotal: 8160000,
        lucroLiquido: 1860000,
        margemLiquida: 18.6,
        roi: 58.1,
      },
    },
  ],
  comparacao: {
    categorias: ['Receita Bruta', 'Custos Totais', 'Lucro Líquido'],
    cenarios: [
      {
        nome: 'Base',
        valores: [12450000, 8390000, 4060000],
      },
      {
        nome: 'Otimista',
        valores: [15408000, 9590000, 5818000],
      },
      {
        nome: 'Pessimista',
        valores: [10020000, 8160000, 1860000],
      },
    ],
  },
  sensibilidade: {
    precoSoja: [
      { variacao: -20, impactoLucro: -1680000 },
      { variacao: -10, impactoLucro: -840000 },
      { variacao: 0, impactoLucro: 0 },
      { variacao: 10, impactoLucro: 840000 },
      { variacao: 20, impactoLucro: 1680000 },
    ],
    produtividade: [
      { variacao: -20, impactoLucro: -2088000 },
      { variacao: -10, impactoLucro: -1044000 },
      { variacao: 0, impactoLucro: 0 },
      { variacao: 10, impactoLucro: 1044000 },
      { variacao: 20, impactoLucro: 2088000 },
    ],
    custosInsumos: [
      { variacao: -20, impactoLucro: 1444000 },
      { variacao: -10, impactoLucro: 722000 },
      { variacao: 0, impactoLucro: 0 },
      { variacao: 10, impactoLucro: -722000 },
      { variacao: 20, impactoLucro: -1444000 },
    ],
  },
  parametrosDisponiveis: {
    culturas: ['Soja', 'Milho', 'Trigo', 'Algodão', 'Feijão'],
    faixasPreco: {
      soja: { min: 100, max: 180, medio: 135 },
      milho: { min: 45, max: 90, medio: 68 },
      trigo: { min: 60, max: 120, medio: 85 },
    },
    faixasProdutividade: {
      soja: { min: 40, max: 75, media: 60 },
      milho: { min: 100, max: 180, media: 140 },
      trigo: { min: 50, max: 90, media: 65 },
    },
  },
}
