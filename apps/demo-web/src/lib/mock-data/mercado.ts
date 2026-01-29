// Dados mockados para módulo de Mercado
export const mockMercadoData = {
  cotacoes: {
    soja: {
      valor: 142.50,
      variacao: 2.3,
      volume: 45678,
      fechamentoAnterior: 139.30,
      abertura: 140.80,
      maxima: 143.20,
      minima: 140.50,
    },
    milho: {
      valor: 68.90,
      variacao: -0.8,
      volume: 32456,
      fechamentoAnterior: 69.45,
      abertura: 69.20,
      maxima: 69.80,
      minima: 68.50,
    },
    trigo: {
      valor: 85.30,
      variacao: 1.5,
      volume: 12345,
      fechamentoAnterior: 84.05,
      abertura: 84.50,
      maxima: 85.60,
      minima: 84.20,
    },
  },

  historicoSoja: Array.from({ length: 90 }, (_, i) => ({
    data: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000),
    preco: 130 + Math.sin(i / 10) * 10 + Math.random() * 5,
    volume: 30000 + Math.random() * 20000,
  })),

  analises: [
    {
      id: '1',
      titulo: 'Janela de venda favorável',
      tipo: 'oportunidade',
      cultura: 'Soja',
      descricao: 'Preço 8% acima da média histórica. Demanda internacional forte.',
      confianca: 92,
      dataValidade: new Date('2026-01-10'),
    },
    {
      id: '2',
      titulo: 'Tendência de baixa no milho',
      tipo: 'risco',
      cultura: 'Milho',
      descricao: 'Safra recorde nos EUA pode pressionar preços nos próximos 30 dias.',
      confianca: 78,
      dataValidade: new Date('2026-02-05'),
    },
  ],

  mercadoFisico: [
    { regiao: 'Paraná', cultura: 'Soja', preco: 145.20, variacao: 1.8 },
    { regiao: 'Mato Grosso', cultura: 'Soja', preco: 138.50, variacao: 2.1 },
    { regiao: 'Rio Grande do Sul', cultura: 'Soja', preco: 143.80, variacao: 1.5 },
    { regiao: 'Goiás', cultura: 'Milho', preco: 70.30, variacao: -0.5 },
  ],

  previsaoPrecos: {
    soja: [
      { mes: 'Jan/26', precoMin: 138, precoMax: 148, precoMedio: 143 },
      { mes: 'Fev/26', precoMin: 135, precoMax: 145, precoMedio: 140 },
      { mes: 'Mar/26', precoMin: 140, precoMax: 150, precoMedio: 145 },
      { mes: 'Abr/26', precoMin: 142, precoMax: 155, precoMedio: 148 },
    ],
  },
}

// Comparação histórica de preços
export const mockComparacaoPrecos = Array.from({ length: 12 }, (_, i) => {
  const mes = new Date(2025, i, 1).toLocaleDateString('pt-BR', { month: 'short' })
  return {
    mes,
    ano2024: 120 + Math.sin(i / 2) * 15 + Math.random() * 5,
    ano2025: 130 + Math.sin(i / 2) * 12 + Math.random() * 5,
    ano2026: 135 + Math.sin(i / 2) * 10 + Math.random() * 5,
  }
})
