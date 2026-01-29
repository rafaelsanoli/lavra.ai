'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { GraficoLinha } from '@/components/charts'
import { mockMercadoData, mockComparacaoPrecos } from '@/lib/mock-data/mercado'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function MercadoPage() {
  const { cotacoes, historicoSoja, analises, mercadoFisico } = mockMercadoData

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Inteligência de Mercado</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Cotações e análises para maximizar seu lucro
          </p>
        </div>

        {/* Cotações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(cotacoes).map(([cultura, dados]) => (
            <div
              key={cultura}
              className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white capitalize">
                  {cultura}
                </h3>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  dados.variacao >= 0
                    ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                }`}>
                  {dados.variacao >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {dados.variacao >= 0 ? '+' : ''}{dados.variacao}%
                </div>
              </div>

              <p className="text-3xl font-bold text-neutral-900 dark:text-white font-mono mb-4">
                R$ {dados.valor.toFixed(2)}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Abertura</p>
                  <p className="font-medium text-neutral-900 dark:text-white">R$ {dados.abertura.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Fech. Ant.</p>
                  <p className="font-medium text-neutral-900 dark:text-white">R$ {dados.fechamentoAnterior.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Máxima</p>
                  <p className="font-medium text-green-600 dark:text-green-400">R$ {dados.maxima.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Mínima</p>
                  <p className="font-medium text-red-600 dark:text-red-400">R$ {dados.minima.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-xs text-neutral-500">Volume</p>
                <p className="font-medium text-neutral-900 dark:text-white">{dados.volume.toLocaleString('pt-BR')} sc</p>
              </div>
            </div>
          ))}
        </div>

        {/* Análises de Mercado */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Análises e Oportunidades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analises.map((analise) => (
              <div
                key={analise.id}
                className={`p-4 rounded-lg border ${
                  analise.tipo === 'oportunidade'
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-white">{analise.titulo}</h4>
                    <p className="text-xs text-neutral-500 mt-1">{analise.cultura}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{analise.confianca}%</p>
                    <p className="text-xs text-neutral-500">confiança</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{analise.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico Histórico Soja */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Histórico de Preços - Soja (90 dias)
          </h3>
          <GraficoLinha
            data={historicoSoja.map(d => ({ mes: d.data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), preco: d.preco }))}
            linhas={[
              { dataKey: 'preco', nome: 'Preço (R$/sc)', cor: '#17522C' },
            ]}
            altura={300}
          />
        </div>

        {/* Comparação de Preços Histórica */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Comparação Histórica (Últimos 3 Anos)
          </h3>
          <GraficoLinha
            data={mockComparacaoPrecos}
            linhas={[
              { dataKey: 'ano2024', nome: '2024', cor: '#94A3B8' },
              { dataKey: 'ano2025', nome: '2025', cor: '#22C55E' },
              { dataKey: 'ano2026', nome: '2026', cor: '#17522C' },
            ]}
            altura={300}
          />
        </div>

        {/* Mercado Físico */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Mercado Físico por Região
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Região</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Cultura</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Preço</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Variação</th>
                </tr>
              </thead>
              <tbody>
                {mercadoFisico.map((item, index) => (
                  <tr key={index} className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="py-3 px-4 text-sm text-neutral-900 dark:text-white">{item.regiao}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">{item.cultura}</td>
                    <td className="py-3 px-4 text-sm font-medium text-right text-neutral-900 dark:text-white">
                      R$ {item.preco.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-sm font-medium text-right ${
                      item.variacao >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {item.variacao >= 0 ? '+' : ''}{item.variacao}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
