// Dados mockados para módulo de Clima
export const mockClimaData = {
  atual: {
    temperatura: 28,
    sensacao: 30,
    umidade: 65,
    vento: 12,
    condicao: 'Parcialmente nublado',
    icone: '⛅',
  },

  previsao15Dias: Array.from({ length: 15 }, (_, i) => ({
    data: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
    temperaturaMin: 18 + Math.random() * 5,
    temperaturaMax: 28 + Math.random() * 8,
    precipitacao: Math.random() * 100,
    umidade: 50 + Math.random() * 30,
    vento: 5 + Math.random() * 20,
    condicao: ['Ensolarado', 'Nublado', 'Chuva', 'Parcialmente nublado'][Math.floor(Math.random() * 4)],
  })),

  alertasAtivos: [
    {
      id: '1',
      tipo: 'geada',
      titulo: 'Risco de geada',
      descricao: 'Temperatura pode atingir 2°C na madrugada de 12/01',
      dataInicio: new Date('2026-01-12T03:00'),
      dataFim: new Date('2026-01-12T08:00'),
      severidade: 'alta',
      regioes: ['Norte', 'Nordeste'],
    },
    {
      id: '2',
      tipo: 'seca',
      titulo: 'Período sem chuvas',
      descricao: '10 dias consecutivos sem precipitação prevista',
      dataInicio: new Date('2026-01-15'),
      dataFim: new Date('2026-01-25'),
      severidade: 'média',
      regioes: ['Sul', 'Centro'],
    },
  ],

  historicoPrecipitacao: Array.from({ length: 30 }, (_, i) => ({
    data: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    precipitacao: Math.random() * 60,
  })),

  indicesAgricolas: {
    evapotranspiracao: 4.2,
    deficitHidrico: 12,
    diasAteProximaChuva: 3,
    acumuladoMes: 145,
  },
}

// Dados de temperatura para gráfico
export const mockTemperaturaHistorico = Array.from({ length: 24 }, (_, i) => ({
  hora: `${i}:00`,
  temperatura: 18 + Math.sin(i / 4) * 8 + Math.random() * 2,
  sensacao: 19 + Math.sin(i / 4) * 8 + Math.random() * 2,
}))
