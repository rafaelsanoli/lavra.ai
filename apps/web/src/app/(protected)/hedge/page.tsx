'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
  Calculator,
  Shield,
  Plus,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Zap,
  AlertCircle,
} from 'lucide-react'
import { mockHedgeData } from '@/lib/mock-data/hedge'

type Cultura = 'soja' | 'milho'

export default function HedgePage() {
  const [culturaSimulacao, setCulturaSimulacao] = useState<Cultura>('soja')
  const [quantidadeSimulacao, setQuantidadeSimulacao] = useState(10000)
  const [estrategiaSimulacao, setEstrategiaSimulacao] = useState('venda_futura')

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor)
  }

  const formatarNumero = (valor: number) => {
    return new Intl.NumberFormat('pt-BR').format(valor)
  }

  const precoAtual = mockHedgeData.precosMercado[culturaSimulacao].futuro
  const producao = mockHedgeData.producaoEstimada[culturaSimulacao]
  const estrategiaSelecionada = mockHedgeData.estrategias.find((e) => e.id === estrategiaSimulacao)

  // Cálculo da simulação
  const valorOperacao = quantidadeSimulacao * precoAtual
  const custoOperacional = (valorOperacao * (estrategiaSelecionada?.custoOperacional || 0)) / 100
  const margemNecessaria = (valorOperacao * (estrategiaSelecionada?.margemNecessaria || 0)) / 100

  // Simulação de resultados em diferentes cenários
  const resultadosCenarios = mockHedgeData.cenarios.map((cenario) => {
    const precoFinal = culturaSimulacao === 'soja' ? cenario.precoFinalSoja : cenario.precoFinalMilho
    const semHedge = quantidadeSimulacao * precoFinal
    const comHedge = quantidadeSimulacao * precoAtual

    let resultadoHedge = 0
    if (estrategiaSimulacao === 'venda_futura') {
      resultadoHedge = comHedge - custoOperacional
    } else if (estrategiaSimulacao === 'opcao_put') {
      if (precoFinal < precoAtual) {
        resultadoHedge = comHedge - custoOperacional
      } else {
        resultadoHedge = semHedge - custoOperacional
      }
    } else if (estrategiaSimulacao === 'collar') {
      const teto = precoAtual * 1.1 // limite superior 10% acima
      if (precoFinal < precoAtual) {
        resultadoHedge = comHedge - custoOperacional
      } else if (precoFinal > teto) {
        resultadoHedge = quantidadeSimulacao * teto - custoOperacional
      } else {
        resultadoHedge = semHedge - custoOperacional
      }
    }

    return {
      cenario: cenario.nome,
      probabilidade: cenario.probabilidade,
      precoFinal,
      semHedge,
      comHedge: resultadoHedge,
      diferenca: resultadoHedge - semHedge,
    }
  })

  const getRiscoColor = (risco: string) => {
    const colors: Record<string, string> = {
      baixo: 'text-green-400 bg-green-500/20 border-green-500/50',
      medio: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
      alto: 'text-red-400 bg-red-500/20 border-red-500/50',
    }
    return colors[risco] || 'text-neutral-600 dark:text-gray-400 bg-gray-500/20 border-gray-500/50'
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <Calculator className="w-8 h-8 text-brand-500" />
            Simulador de Hedge
          </h1>
          <p className="text-neutral-600 dark:text-gray-400 mt-1">
            Simule estratégias de proteção e otimize sua gestão de risco
          </p>
        </div>
      </motion.div>

      {/* Cards de Proteção Atual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4 min-w-0">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Proteção Soja</h3>
            <Shield className="w-5 h-5 text-green-400" />
          </div>
            <div className="space-y-3">
            <div className="flex items-center justify-between min-w-0">
              <span className="text-neutral-600 dark:text-gray-400">Produção Total</span>
              <span className="text-neutral-900 dark:text-white font-bold whitespace-nowrap">{formatarNumero(producao.producaoTotal)} sc</span>
            </div>
            <div className="flex items-center justify-between min-w-0">
              <span className="text-neutral-600 dark:text-gray-400">Hedge Atual</span>
              <span className="text-brand-400 font-bold whitespace-nowrap">
                {formatarNumero(mockHedgeData.producaoEstimada.soja.hedgeAtual)} sc
              </span>
            </div>
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-600 dark:text-gray-400">Nível de Proteção</span>
                <span className="text-neutral-900 dark:text-white font-bold">{mockHedgeData.producaoEstimada.soja.percentualHedge.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-brand-600 to-green-600 h-2 rounded-full"
                  style={{ width: `${mockHedgeData.producaoEstimada.soja.percentualHedge}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4 min-w-0">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Proteção Milho</h3>
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between min-w-0">
              <span className="text-neutral-600 dark:text-gray-400">Produção Total</span>
              <span className="text-neutral-900 dark:text-white font-bold whitespace-nowrap">
                {formatarNumero(mockHedgeData.producaoEstimada.milho.producaoTotal)} sc
              </span>
            </div>
            <div className="flex items-center justify-between min-w-0">
              <span className="text-neutral-600 dark:text-gray-400">Hedge Atual</span>
              <span className="text-brand-400 font-bold whitespace-nowrap">
                {formatarNumero(mockHedgeData.producaoEstimada.milho.hedgeAtual)} sc
              </span>
            </div>
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-600 dark:text-gray-400">Nível de Proteção</span>
                <span className="text-neutral-900 dark:text-white font-bold">{mockHedgeData.producaoEstimada.milho.percentualHedge.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 h-2 rounded-full"
                  style={{ width: `${mockHedgeData.producaoEstimada.milho.percentualHedge}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simulador */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-brand-400" />
          Simular Nova Operação
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Cultura */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-2">Cultura</label>
            <select
              value={culturaSimulacao}
              onChange={(e) => setCulturaSimulacao(e.target.value as Cultura)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              <option value="soja">Soja</option>
              <option value="milho">Milho</option>
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-2">Quantidade (sacas)</label>
            <input
              type="number"
              value={quantidadeSimulacao}
              onChange={(e) => setQuantidadeSimulacao(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-brand-500"
              step="1000"
              min="0"
            />
          </div>

          {/* Estratégia */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 dark:text-gray-400 mb-2">Estratégia</label>
            <select
              value={estrategiaSimulacao}
              onChange={(e) => setEstrategiaSimulacao(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {mockHedgeData.estrategias.map((estrategia) => (
                <option key={estrategia.id} value={estrategia.id}>
                  {estrategia.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detalhes da Estratégia Selecionada */}
        {estrategiaSelecionada && (
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-start justify-between mb-3 min-w-0">
              <div className="min-w-0">
                <h4 className="font-bold text-neutral-900 dark:text-white mb-1 truncate">{estrategiaSelecionada.nome}</h4>
                <p className="text-sm text-neutral-600 dark:text-gray-400 break-words">{estrategiaSelecionada.descricao}</p>
              </div>
              <span className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium border ${getRiscoColor(estrategiaSelecionada.risco)}`}>
                Risco {estrategiaSelecionada.risco}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="min-w-0">
                <p className="text-xs text-neutral-600 dark:text-gray-400">Custo Operacional</p>
                <p className="text-neutral-900 dark:text-white font-bold break-words">{estrategiaSelecionada.custoOperacional}%</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-600 dark:text-gray-400">Margem Necessária</p>
                <p className="text-neutral-900 dark:text-white font-bold break-words">{estrategiaSelecionada.margemNecessaria}%</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-600 dark:text-gray-400">Liquidez</p>
                <p className="text-neutral-900 dark:text-white font-bold capitalize break-words">{estrategiaSelecionada.liquidez}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-600 dark:text-gray-400">Melhor Para</p>
                <p className="text-xs text-neutral-900 dark:text-white line-clamp-2 break-words">{estrategiaSelecionada.melhorPara}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resumo da Operação */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 min-w-0">
            <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Preço Futuro</p>
            <p className="text-xl font-bold text-neutral-900 dark:text-white break-words md:whitespace-nowrap">{formatarMoeda(precoAtual)}/sc</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 min-w-0">
            <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Valor da Operação</p>
            <p className="text-xl font-bold text-brand-400 break-words md:whitespace-nowrap">{formatarMoeda(valorOperacao)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 min-w-0">
            <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Custo Operacional</p>
            <p className="text-xl font-bold text-yellow-400 break-words md:whitespace-nowrap">{formatarMoeda(custoOperacional)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 min-w-0">
            <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Margem Necessária</p>
            <p className="text-xl font-bold text-purple-400 break-words md:whitespace-nowrap">{formatarMoeda(margemNecessaria)}</p>
          </div>
        </div>

        {/* Análise de Cenários */}
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Análise de Cenários</h3>
        <div className="space-y-3">
          {resultadosCenarios.map((resultado) => (
            <div
              key={resultado.cenario}
              className="bg-white/5 rounded-xl p-4 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <h4 className="font-bold text-neutral-900 dark:text-white truncate">{resultado.cenario}</h4>
                  <span className="flex-shrink-0 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                    {resultado.probabilidade}% probabilidade
                  </span>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-xs text-neutral-600 dark:text-gray-400">Preço Final</p>
                  <p className="font-bold text-neutral-900 dark:text-white whitespace-nowrap">{formatarMoeda(resultado.precoFinal)}/sc</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-neutral-600 dark:text-gray-400">Sem Hedge</p>
                  <p className="font-bold text-neutral-900 dark:text-white break-words md:whitespace-nowrap">{formatarMoeda(resultado.semHedge)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-600 dark:text-gray-400">Com Hedge</p>
                  <p className="font-bold text-brand-400 break-words md:whitespace-nowrap">{formatarMoeda(resultado.comHedge)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-600 dark:text-gray-400">Diferença</p>
                  <p className={`font-bold flex items-center gap-1 min-w-0 ${resultado.diferenca >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {resultado.diferenca >= 0 ? <ArrowUp className="w-4 h-4 flex-shrink-0" /> : <ArrowDown className="w-4 h-4 flex-shrink-0" />}
                    <span className="break-words md:whitespace-nowrap">{formatarMoeda(Math.abs(resultado.diferenca))}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-brand-600 to-green-600 hover:from-brand-500 hover:to-green-500 rounded-xl text-neutral-900 dark:text-white font-bold transition-all flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Executar Operação de Hedge
        </button>
      </motion.div>

      {/* Recomendações Inteligentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Recomendações Inteligentes</h2>
        <div className="grid gap-4">
          {mockHedgeData.recomendacoes.map((rec) => (
            <div
              key={rec.id}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 min-w-0">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white truncate">{rec.titulo}</h3>
                    <span className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium border ${
                      rec.prioridade === 'alta'
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : rec.prioridade === 'media'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    }`}>
                      {rec.prioridade.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-gray-400 break-words">{rec.descricao}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-6 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Estratégia Sugerida</p>
                    <p className="font-bold text-neutral-900 dark:text-white capitalize break-words">
                      {mockHedgeData.estrategias.find((e) => e.id === rec.estrategiaSugerida)?.nome}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Impacto Financeiro</p>
                    <p className="font-bold text-brand-400 break-words">{formatarMoeda(rec.impactoFinanceiro)}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-brand-600 to-green-600 hover:from-brand-500 hover:to-green-500 rounded-xl text-neutral-900 dark:text-white font-medium transition-all flex items-center gap-2">
                  {rec.acaoSugerida}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      </div>
    </DashboardLayout>
  )
}
