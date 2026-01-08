// Dados mockados para Dashboard
export const mockDashboardData = {
  lucroProjetado: 2847000,
  lucroVariacao: 12.4,
  areasPlantadas: 2450,
  produtividadeMedia: 68.5,
  
  estatisticas: [
    { titulo: 'Lucro Projetado', valor: 'R$ 2.847.000', variacao: '+12,4%', tipo: 'positivo' },
    { titulo: 'Áreas Plantadas', valor: '2.450 ha', variacao: '+5,2%', tipo: 'positivo' },
    { titulo: 'Produtividade', valor: '68,5 sc/ha', variacao: '+8,1%', tipo: 'positivo' },
    { titulo: 'Eficiência', valor: '94%', variacao: '+2,3%', tipo: 'positivo' },
  ],

  alertas: [
    {
      id: '1',
      tipo: 'oportunidade',
      titulo: 'Janela de venda ideal para soja',
      descricao: 'Preço R$ 142/sc está 8% acima da média. Condições favoráveis nos próximos 3 dias.',
      severidade: 'alta',
      data: new Date('2026-01-08'),
    },
    {
      id: '2',
      tipo: 'risco',
      titulo: 'Alerta de geada para próxima semana',
      descricao: 'Previsão de temperatura abaixo de 2°C entre 12-14/01. Considere proteção para talhões norte.',
      severidade: 'média',
      data: new Date('2026-01-12'),
    },
    {
      id: '3',
      tipo: 'info',
      titulo: 'Período ideal para aplicação',
      descricao: 'Condições climáticas favoráveis para pulverização nos próximos 5 dias.',
      severidade: 'baixa',
      data: new Date('2026-01-09'),
    },
  ],

  atividadesRecentes: [
    { id: '1', tipo: 'plantio', descricao: 'Plantio concluído - Talhão A3', data: new Date('2026-01-06'), usuario: 'João Silva' },
    { id: '2', tipo: 'alerta', descricao: 'Alerta de mercado acionado', data: new Date('2026-01-06'), usuario: 'Sistema' },
    { id: '3', tipo: 'colheita', descricao: 'Colheita iniciada - Talhão B1', data: new Date('2026-01-05'), usuario: 'Maria Santos' },
  ],
}

// Dados de lucro ao longo do tempo (para gráfico)
export const mockLucroMensal = [
  { mes: 'Jul', valor: 1850000, projetado: 1900000 },
  { mes: 'Ago', valor: 2100000, projetado: 2050000 },
  { mes: 'Set', valor: 2350000, projetado: 2300000 },
  { mes: 'Out', valor: 2600000, projetado: 2550000 },
  { mes: 'Nov', valor: 2750000, projetado: 2700000 },
  { mes: 'Dez', valor: 2847000, projetado: 2850000 },
  { mes: 'Jan', projetado: 3100000 },
  { mes: 'Fev', projetado: 3350000 },
]

// Distribuição de culturas
export const mockCulturas = [
  { nome: 'Soja', hectares: 1450, percentual: 59.2, lucro: 1685000 },
  { nome: 'Milho', hectares: 750, percentual: 30.6, lucro: 892000 },
  { nome: 'Trigo', hectares: 250, percentual: 10.2, lucro: 270000 },
]
