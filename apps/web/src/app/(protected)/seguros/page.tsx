'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
  Shield,
  FileText,
  Calculator,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Plus,
  Download,
  BarChart3,
} from 'lucide-react'
import { mockSegurosData } from '@/lib/mock-data/seguros'

type TabType = 'apolices' | 'cotacoes' | 'sinistros' | 'recomendacoes'

export default function SegurosPage() {
  const [tabAtiva, setTabAtiva] = useState<TabType>('apolices')

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor)
  }

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ativo: 'bg-green-500/20 text-green-400 border-green-500/50',
      pendente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      em_analise: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      aprovada: 'bg-green-500/20 text-green-400 border-green-500/50',
      pago: 'bg-green-500/20 text-green-400 border-green-500/50',
      rejeitado: 'bg-red-500/20 text-red-400 border-red-500/50',
    }
    return colors[status] || 'bg-gray-500/20 text-neutral-600 dark:text-gray-400 border-gray-500/50'
  }

  const getPrioridadeColor = (prioridade: string) => {
    const colors: Record<string, string> = {
      alta: 'bg-red-500/20 text-red-400 border-red-500/50',
      media: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      baixa: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    }
    return colors[prioridade] || 'bg-gray-500/20 text-neutral-600 dark:text-gray-400 border-gray-500/50'
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-500" />
            Módulo de Seguros
          </h1>
          <p className="text-neutral-600 dark:text-gray-400 mt-1">
            Gestão completa de apólices, cotações e análise de riscos
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-neutral-900 dark:text-white transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-brand-600 to-green-600 hover:from-brand-500 hover:to-green-500 rounded-xl text-neutral-900 dark:text-white font-medium transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Cotação
          </button>
        </div>
      </motion.div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/10 rounded-2xl p-6 w-full max-w-full box-border overflow-hidden"
        >
          <div className="flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-neutral-600 dark:text-gray-400 text-sm">Cobertura Total</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 break-words">
                {formatarMoeda(mockSegurosData.estatisticas.coberturaTotal)}
              </h3>
            </div>
            <div className="bg-brand-500/20 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+12% vs ano anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-full box-border overflow-hidden"
        >
          <div className="flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-neutral-600 dark:text-gray-400 text-sm">Prêmio Total</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 break-words">
                {formatarMoeda(mockSegurosData.estatisticas.premioTotal)}
              </h3>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <span className="text-neutral-600 dark:text-gray-400">
              {((mockSegurosData.estatisticas.premioTotal / mockSegurosData.estatisticas.coberturaTotal) * 100).toFixed(2)}% do valor segurado
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-full box-border overflow-hidden"
        >
          <div className="flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-neutral-600 dark:text-gray-400 text-sm">Taxa de Sinistralidade</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 break-words">
                {mockSegurosData.estatisticas.taxaSinistralidade}%
              </h3>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-green-400">-8% vs média histórica</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-full box-border overflow-hidden"
        >
          <div className="flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-neutral-600 dark:text-gray-400 text-sm">Economia Fiscal</p>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 break-words">
                {formatarMoeda(mockSegurosData.estatisticas.economiaFiscal)}
              </h3>
            </div>
            <div className="bg-green-500/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <span className="text-neutral-600 dark:text-gray-400">Dedução IR sobre prêmios</span>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: 'apolices', label: 'Apólices Ativas', icon: FileText },
          { id: 'cotacoes', label: 'Cotações', icon: Calculator },
          { id: 'sinistros', label: 'Sinistros', icon: AlertTriangle },
          { id: 'recomendacoes', label: 'Recomendações', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabAtiva(tab.id as TabType)}
            className={`px-6 py-3 flex items-center gap-2 font-medium transition-all ${
              tabAtiva === tab.id
                ? 'text-brand-400 border-b-2 border-brand-400'
                : 'text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      <motion.div
        key={tabAtiva}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Apólices Ativas */}
        {tabAtiva === 'apolices' && (
          <div className="grid gap-4">
            {mockSegurosData.apolices.map((apolice) => (
              <div
                key={apolice.id}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all w-full max-w-full box-border overflow-hidden"
              >
                  <div className="flex items-start justify-between mb-4 min-w-0">
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 min-w-0">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white truncate">{apolice.seguradora}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(apolice.status)}`}>
                        {apolice.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-gray-400">{apolice.tipo}</p>
                    <p className="text-sm text-gray-500 mt-1">Apólice: {apolice.numeroApolice}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg border border-white/10 transition-all flex-shrink-0">
                      <Eye className="w-4 h-4 text-neutral-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg border border-white/10 transition-all flex-shrink-0">
                      <Download className="w-4 h-4 text-neutral-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Cobertura</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white break-words">{formatarMoeda(apolice.cobertura)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Prêmio</p>
                    <p className="text-lg font-bold text-brand-400 break-words">{formatarMoeda(apolice.premio)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Vigência</p>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {formatarData(apolice.vigenciaInicio)} - {formatarData(apolice.vigenciaFim)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Franquia</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">{apolice.franquia}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {apolice.culturas.length > 0 && (
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Culturas</p>
                      <div className="flex gap-2">
                        {apolice.culturas.map((cultura) => (
                          <span
                            key={cultura}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs border border-green-500/50"
                          >
                            {cultura}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Riscos Cobertos</p>
                    <div className="flex flex-wrap gap-2">
                      {apolice.riscosCobertos.map((risco) => (
                        <span
                          key={risco}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs border border-blue-500/50"
                        >
                          {risco}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cotações */}
        {tabAtiva === 'cotacoes' && (
          <div className="grid gap-4">
            {mockSegurosData.cotacoes.map((cotacao) => (
              <div
                key={cotacao.id}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all w-full max-w-full box-border overflow-hidden"
              >
                  <div className="flex items-start justify-between mb-4 min-w-0">
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 min-w-0">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white truncate">{cotacao.seguradora}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(cotacao.status)}`}>
                        {cotacao.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-gray-400">{cotacao.tipo}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Válida até: {formatarData(cotacao.dataValidade)}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-brand-600 to-green-600 hover:from-brand-500 hover:to-green-500 rounded-xl text-neutral-900 dark:text-white font-medium transition-all w-full md:w-auto">
                    Contratar
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Cobertura Proposta</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white break-words">{formatarMoeda(cotacao.cobertura)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Prêmio Estimado</p>
                    <p className="text-lg font-bold text-brand-400 break-words">{formatarMoeda(cotacao.premioEstimado)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Vigência</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">{cotacao.vigenciaMeses} meses</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Franquia</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">{cotacao.franquia}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Culturas</p>
                    <div className="flex gap-2">
                      {cotacao.culturas.map((cultura) => (
                        <span
                          key={cultura}
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs border border-green-500/50"
                        >
                          {cultura}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-gray-400 mb-1">Coberturas</p>
                    <div className="flex flex-wrap gap-2">
                      {cotacao.riscosCobertos.map((risco) => (
                        <span
                          key={risco}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs border border-blue-500/50"
                        >
                          {risco}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sinistros */}
        {tabAtiva === 'sinistros' && (
          <div className="grid gap-4">
            {mockSegurosData.sinistros.map((sinistro) => (
              <div
                key={sinistro.id}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{sinistro.tipo}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(sinistro.status)}`}>
                        {sinistro.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-gray-400">Apólice: {sinistro.apolice}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Ocorrência: {formatarData(sinistro.dataOcorrencia)}
                    </p>
                  </div>
                  {sinistro.status === 'pago' ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Clock className="w-6 h-6 text-yellow-400" />
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Área Afetada</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">{sinistro.areaAfetada} ha</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Perda Estimada</p>
                    <p className="text-lg font-bold text-red-400">{formatarMoeda(sinistro.perdaEstimada)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Indenização</p>
                    <p className="text-lg font-bold text-green-400">
                      {sinistro.indenizacaoPaga > 0 ? formatarMoeda(sinistro.indenizacaoPaga) : '-'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 dark:text-gray-400">Data Pagamento</p>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {sinistro.dataPagamento ? formatarData(sinistro.dataPagamento) : 'Pendente'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recomendações */}
        {tabAtiva === 'recomendacoes' && (
          <div className="grid gap-4">
            {mockSegurosData.recomendacoes.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl p-6 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all w-full max-w-full box-border overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{rec.titulo}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPrioridadeColor(rec.prioridade)}`}>
                        {rec.prioridade.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-gray-400 mt-2">{rec.descricao}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 flex-wrap gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-600 dark:text-gray-400">Impacto Financeiro</p>
                      <p className={`text-lg font-bold ${rec.impactoFinanceiro > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {rec.impactoFinanceiro > 0 ? '+' : ''}{formatarMoeda(Math.abs(rec.impactoFinanceiro))}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-brand-600 to-green-600 hover:from-brand-500 hover:to-green-500 rounded-xl text-neutral-900 dark:text-white font-medium transition-all w-full md:w-auto">
                    {rec.acaoSugerida}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      </div>
    </DashboardLayout>
  )
}
