// Dados mockados para Operações
export const mockOperacoesData = {
  fazendas: [
    {
      id: '1',
      nome: 'Fazenda Santa Maria',
      localizacao: 'Sorriso, MT',
      area: 1450,
      status: 'ativa',
      talhoesTotal: 12,
      talhoesProdutivos: 10,
      culturaAtual: 'Soja',
    },
    {
      id: '2',
      nome: 'Fazenda Boa Vista',
      localizacao: 'Rio Verde, GO',
      area: 1000,
      status: 'ativa',
      talhoesTotal: 8,
      talhoesProdutivos: 8,
      culturaAtual: 'Milho',
    },
  ],

  talhoes: [
    { id: 'T1', nome: 'Talhão A1', fazenda: 'Fazenda Santa Maria', area: 120, cultura: 'Soja', estagio: 'Floração', dataPlantio: new Date('2025-10-15'), produtividadeEsperada: 68 },
    { id: 'T2', nome: 'Talhão A2', fazenda: 'Fazenda Santa Maria', area: 150, cultura: 'Soja', estagio: 'Vegetativo', dataPlantio: new Date('2025-10-20'), produtividadeEsperada: 65 },
    { id: 'T3', nome: 'Talhão A3', fazenda: 'Fazenda Santa Maria', area: 135, cultura: 'Soja', estagio: 'Colheita', dataPlantio: new Date('2025-09-25'), produtividadeEsperada: 72 },
    { id: 'T4', nome: 'Talhão B1', fazenda: 'Fazenda Boa Vista', area: 200, cultura: 'Milho', estagio: 'Floração', dataPlantio: new Date('2025-11-01'), produtividadeEsperada: 145 },
    { id: 'T5', nome: 'Talhão B2', fazenda: 'Fazenda Boa Vista', area: 180, cultura: 'Milho', estagio: 'Vegetativo', dataPlantio: new Date('2025-11-10'), produtividadeEsperada: 140 },
  ],

  atividades: [
    { id: '1', tipo: 'Plantio', talhao: 'Talhão A3', data: new Date('2025-10-15'), status: 'concluida', responsavel: 'João Silva' },
    { id: '2', tipo: 'Pulverização', talhao: 'Talhão A1', data: new Date('2026-01-05'), status: 'concluida', responsavel: 'Maria Santos' },
    { id: '3', tipo: 'Adubação', talhao: 'Talhão B1', data: new Date('2026-01-08'), status: 'pendente', responsavel: 'Pedro Costa' },
    { id: '4', tipo: 'Colheita', talhao: 'Talhão A3', data: new Date('2026-01-15'), status: 'agendada', responsavel: 'José Lima' },
  ],

  insumos: [
    { id: '1', nome: 'Sementes Soja BR 2050', quantidade: 1200, unidade: 'kg', valorUnitario: 8.50, estoque: 850, estoqueMinimo: 500 },
    { id: '2', nome: 'Fertilizante NPK 20-20-20', quantidade: 5000, unidade: 'kg', valorUnitario: 3.20, estoque: 3200, estoqueMinimo: 2000 },
    { id: '3', nome: 'Herbicida Glifosato', quantidade: 800, unidade: 'L', valorUnitario: 25.00, estoque: 450, estoqueMinimo: 300 },
    { id: '4', nome: 'Inseticida Lambda', quantidade: 400, unidade: 'L', valorUnitario: 42.00, estoque: 180, estoqueMinimo: 200 },
  ],

  equipe: [
    { id: '1', nome: 'João Silva', cargo: 'Operador de Máquinas', contato: '(66) 99999-0001', status: 'ativo' },
    { id: '2', nome: 'Maria Santos', cargo: 'Agrônoma', contato: '(66) 99999-0002', status: 'ativo' },
    { id: '3', nome: 'Pedro Costa', cargo: 'Técnico Agrícola', contato: '(66) 99999-0003', status: 'ativo' },
    { id: '4', nome: 'José Lima', cargo: 'Operador de Colheitadeira', contato: '(66) 99999-0004', status: 'ativo' },
  ],
}

// Dados para gráfico de produtividade
export const mockProdutividadeMensal = [
  { mes: 'Jul', soja: 62, milho: 135 },
  { mes: 'Ago', soja: 64, milho: 138 },
  { mes: 'Set', soja: 66, milho: 140 },
  { mes: 'Out', soja: 68, milho: 142 },
  { mes: 'Nov', soja: 70, milho: 145 },
  { mes: 'Dez', soja: 72, milho: 148 },
]
