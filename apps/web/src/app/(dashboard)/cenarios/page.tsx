'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Botao } from '@/components/ui'
import { GraficoLinha, GraficoBarra } from '@/components/charts'
import { mockCenariosData } from '@/lib/mock-data/cenarios'
import { Plus, Copy, Trash2, Play } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'

export default function CenariosPage() {
  const { cenarios, comparacao, sensibilidade } = mockCenariosData
  const [cenarioAtivo, setCenarioAtivo] = useState(cenarios[0])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor)
  }

  const dadosComparacao = comparacao.categorias.map((categoria, idx) => ({
    categoria,
    ...comparacao.cenarios.reduce((acc, cenario) => {
      acc[cenario.nome] = cenario.valores[idx]
      return acc
    }, {} as Record<string, number>),
  }))

  const dadosSensibilidadePreco = sensibilidade.precoSoja.map((item) => ({
    variacao: `${item.variacao > 0 ? '+' : ''}${item.variacao}%`,
    impacto: item.impactoLucro,
  }))

  const dadosSensibilidadeProdutividade = sensibilidade.produtividade.map((item) => ({
    variacao: `${item.variacao > 0 ? '+' : ''}${item.variacao}%`,
    impacto: item.impactoLucro,
  }))

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Simulador de Cenários</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Simule diferentes cenários e analise a viabilidade da safra
            </p>
          </div>
          <Botao variante="primario" tamanho="md">
            <Plus className="w-4 h-4" />
            Novo Cenário
          </Botao>
        </div>

        {/* Cenário Ativo - Métricas */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{cenarioAtivo.nome}</h2>
              <p className="text-brand-100 mt-1">{cenarioAtivo.descricao}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
              {cenarioAtivo.status === 'ativo' ? 'Ativo' : 'Simulação'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-sm text-brand-100 mb-1">Receita Bruta</p>
              <p className="text-2xl font-bold">{formatarMoeda(cenarioAtivo.resultados.receitaBruta)}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-sm text-brand-100 mb-1">Lucro Líquido</p>
              <p className="text-2xl font-bold">{formatarMoeda(cenarioAtivo.resultados.lucroLiquido)}</p>
              <p className="text-xs text-brand-100 mt-1">
                Margem: {cenarioAtivo.resultados.margemLiquida.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-sm text-brand-100 mb-1">ROI</p>
              <p className="text-2xl font-bold">{cenarioAtivo.resultados.roi.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-sm text-brand-100 mb-1">Custos Totais</p>
              <p className="text-2xl font-bold">{formatarMoeda(cenarioAtivo.resultados.custoTotal)}</p>
            </div>
          </div>
        </div>

        {/* Lista de Cenários */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cenarios.map((cenario) => {
            const isAtivo = cenario.id === cenarioAtivo.id
            return (
              <div
                key={cenario.id}
                onClick={() => setCenarioAtivo(cenario)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isAtivo
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1A1A1A] hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">{cenario.nome}</h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Criado em {format(cenario.dataCriacao, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <Copy className="w-4 h-4 text-neutral-500" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <Trash2 className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {cenario.descricao}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Lucro:</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {formatarMoeda(cenario.resultados.lucroLiquido)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">ROI:</span>
                    <span className="font-semibold text-green-600">
                      {cenario.resultados.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Comparação de Cenários */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Comparação de Cenários
          </h3>
          <GraficoBarra
            data={dadosComparacao}
            barras={[
              { dataKey: 'Base', nome: 'Base', cor: '#17522C' },
              { dataKey: 'Otimista', nome: 'Otimista', cor: '#22C55E' },
              { dataKey: 'Pessimista', nome: 'Pessimista', cor: '#EF4444' },
            ]}
            altura={320}
          />
        </div>

        {/* Análise de Sensibilidade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sensibilidade - Preço */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Sensibilidade - Preço da Soja
            </h3>
            <GraficoLinha
              data={dadosSensibilidadePreco}
              linhas={[{ dataKey: 'impacto', nome: 'Impacto no Lucro', cor: '#17522C' }]}
              altura={250}
              xAxisKey="variacao"
            />
            <p className="text-xs text-neutral-500 mt-3 text-center">
              Variação percentual do preço vs. impacto no lucro líquido
            </p>
          </div>

          {/* Sensibilidade - Produtividade */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Sensibilidade - Produtividade
            </h3>
            <GraficoLinha
              data={dadosSensibilidadeProdutividade}
              linhas={[{ dataKey: 'impacto', nome: 'Impacto no Lucro', cor: '#2563EB' }]}
              altura={250}
              xAxisKey="variacao"
            />
            <p className="text-xs text-neutral-500 mt-3 text-center">
              Variação percentual da produtividade vs. impacto no lucro líquido
            </p>
          </div>
        </div>

        {/* Parâmetros do Cenário Ativo */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Parâmetros - {cenarioAtivo.nome}
            </h3>
            <Botao variante="secundario" tamanho="sm">
              <Play className="w-4 h-4" />
              Simular Novamente
            </Botao>
          </div>

          <div className="space-y-4">
            {/* Culturas */}
            <div>
              <h4 className="font-medium text-neutral-900 dark:text-white mb-3">Culturas</h4>
              <div className="space-y-3">
                {cenarioAtivo.parametros.culturas.map((cultura, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-neutral-900 dark:text-white">{cultura.cultura}</h5>
                      <span className="text-sm text-neutral-500">
                        Receita: {formatarMoeda(cultura.area * cultura.produtividade * cultura.preco)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500 mb-1">Área (ha)</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">{cultura.area}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-1">Produtividade</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">{cultura.produtividade} sc/ha</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-1">Preço</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">R$ {cultura.preco}/sc</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-1">Custo/ha</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">R$ {cultura.custos}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custos e Investimentos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <p className="text-sm text-neutral-500 mb-1">Custos Fixos</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {formatarMoeda(cenarioAtivo.parametros.custoFixo)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <p className="text-sm text-neutral-500 mb-1">Investimentos</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  {formatarMoeda(cenarioAtivo.parametros.investimentos)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
