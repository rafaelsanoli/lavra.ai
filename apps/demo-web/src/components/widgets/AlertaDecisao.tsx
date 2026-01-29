'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
  DollarSign,
  Droplets,
  Cloud,
  Shield,
  X,
} from 'lucide-react'
import { useState } from 'react'

export interface AlertaDecisao {
  id: string
  tipo: 'urgente' | 'atencao' | 'informativo'
  prioridade: 'alta' | 'media' | 'baixa'
  categoria: 'clima' | 'mercado' | 'operacao' | 'financeiro'
  titulo: string
  descricao: string
  impactoFinanceiro?: number
  tempoRestante?: string
  acao: {
    label: string
    onClick: () => void
  }
  acaoSecundaria?: {
    label: string
    onClick: () => void
  }
  dados?: Record<string, string | number>
}

interface AlertaDecisaoCardProps {
  alerta: AlertaDecisao
  onDismiss?: (id: string) => void
}

export function AlertaDecisaoCard({ alerta, onDismiss }: AlertaDecisaoCardProps) {
  const [descartado, setDescartado] = useState(false)

  const handleDismiss = () => {
    setDescartado(true)
    setTimeout(() => {
      onDismiss?.(alerta.id)
    }, 300)
  }

  const getTipoEstilo = () => {
    switch (alerta.tipo) {
      case 'urgente':
        return {
          bg: 'bg-gradient-to-br from-red-500/20 via-red-600/10 to-orange-500/20',
          border: 'border-red-500/50',
          icon: AlertTriangle,
          iconColor: 'text-red-400',
          badge: 'bg-red-500/30 text-red-300 border-red-500/50',
        }
      case 'atencao':
        return {
          bg: 'bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-orange-500/20',
          border: 'border-yellow-500/50',
          icon: Zap,
          iconColor: 'text-yellow-400',
          badge: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50',
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-cyan-500/20',
          border: 'border-blue-500/50',
          icon: TrendingUp,
          iconColor: 'text-blue-400',
          badge: 'bg-blue-500/30 text-blue-300 border-blue-500/50',
        }
    }
  }

  const getCategoriaIcone = () => {
    switch (alerta.categoria) {
      case 'clima':
        return Cloud
      case 'mercado':
        return TrendingUp
      case 'operacao':
        return Droplets
      case 'financeiro':
        return DollarSign
      default:
        return Shield
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor)
  }

  const estilo = getTipoEstilo()
  const IconeTipo = estilo.icon
  const IconeCategoria = getCategoriaIcone()

  if (descartado) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative backdrop-blur-xl ${estilo.bg} border ${estilo.border} rounded-2xl p-6 shadow-2xl overflow-hidden`}
    >
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      </div>

      {/* Botão de Descartar */}
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all z-10"
        >
          <X className="w-4 h-4 text-neutral-400 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white" />
        </button>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 bg-white/10 rounded-xl ${estilo.iconColor}`}>
            <IconeTipo className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <IconeCategoria className="w-4 h-4 text-neutral-500 dark:text-gray-400" />
              <span className="text-xs text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                {alerta.categoria}
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${estilo.badge}`}>
                {alerta.prioridade.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{alerta.titulo}</h3>
            <p className="text-neutral-700 dark:text-gray-300">{alerta.descricao}</p>
          </div>
        </div>

        {/* Dados Adicionais */}
        {(alerta.impactoFinanceiro || alerta.tempoRestante || alerta.dados) && (
          <div className="flex flex-wrap gap-4 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
            {alerta.impactoFinanceiro && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-gray-400">Impacto Financeiro</p>
                  <p className={`font-bold ${alerta.impactoFinanceiro > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {alerta.impactoFinanceiro > 0 ? '+' : ''}
                    {formatarMoeda(alerta.impactoFinanceiro)}
                  </p>
                </div>
              </div>
            )}
            {alerta.tempoRestante && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-gray-400">Tempo Restante</p>
                  <p className="font-bold text-neutral-900 dark:text-white">{alerta.tempoRestante}</p>
                </div>
              </div>
            )}
            {alerta.dados &&
              Object.entries(alerta.dados).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-neutral-500 dark:text-gray-400 capitalize">{key.replace('_', ' ')}</p>
                  <p className="font-bold text-neutral-900 dark:text-white">{value}</p>
                </div>
              ))}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-3">
          <button
            onClick={alerta.acao.onClick}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-600 to-green-600 hover:from-brand-500 hover:to-green-500 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-500/50"
          >
            {alerta.acao.label}
            <ArrowRight className="w-5 h-5" />
          </button>
          {alerta.acaoSecundaria && (
            <button
              onClick={alerta.acaoSecundaria.onClick}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl text-white font-medium transition-all"
            >
              {alerta.acaoSecundaria.label}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Componente para lista de alertas
interface AlertaDecisaoListaProps {
  alertas: AlertaDecisao[]
  onDismiss?: (id: string) => void
  maxVisible?: number
}

export function AlertaDecisaoLista({ alertas, onDismiss, maxVisible }: AlertaDecisaoListaProps) {
  const [alertasVisiveis, setAlertasVisiveis] = useState(alertas)

  const handleDismiss = (id: string) => {
    setAlertasVisiveis((prev) => prev.filter((a) => a.id !== id))
    onDismiss?.(id)
  }

  const alertasExibir = maxVisible ? alertasVisiveis.slice(0, maxVisible) : alertasVisiveis

  if (alertasExibir.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {alertasExibir.map((alerta) => (
        <AlertaDecisaoCard key={alerta.id} alerta={alerta} onDismiss={handleDismiss} />
      ))}
    </div>
  )
}

// Hook para exemplos de alertas (mock)
export function useAlertasDecisao() {
  const [alertas] = useState<AlertaDecisao[]>([
    {
      id: '1',
      tipo: 'urgente',
      prioridade: 'alta',
      categoria: 'mercado',
      titulo: 'EXECUTAR HEDGE AGORA',
      descricao:
        'Janela de oportunidade: Preço da soja atingiu R$ 145/sc, 7% acima da média. Execute hedge de 30.000 sacas antes do fechamento.',
      impactoFinanceiro: 435000,
      tempoRestante: '2h 15min',
      dados: {
        preco_atual: 'R$ 145,00/sc',
        preco_alvo: 'R$ 140,00/sc',
      },
      acao: {
        label: 'Executar Hedge',
        onClick: () => console.log('Executar hedge'),
      },
      acaoSecundaria: {
        label: 'Ver Simulação',
        onClick: () => console.log('Ver simulação'),
      },
    },
    {
      id: '2',
      tipo: 'atencao',
      prioridade: 'alta',
      categoria: 'clima',
      titulo: 'Risco de Geada em 48 horas',
      descricao:
        'Previsão de temperatura abaixo de 2°C nos talhões T4 e T5. Considere aplicação de irrigação preventiva.',
      impactoFinanceiro: -180000,
      tempoRestante: '48h',
      dados: {
        temperatura_minima: '-1°C',
        area_afetada: '85 ha',
      },
      acao: {
        label: 'Ativar Proteção',
        onClick: () => console.log('Ativar proteção'),
      },
      acaoSecundaria: {
        label: 'Ver Detalhes',
        onClick: () => console.log('Ver detalhes'),
      },
    },
    {
      id: '3',
      tipo: 'informativo',
      prioridade: 'media',
      categoria: 'financeiro',
      titulo: 'Oportunidade: Seguro Paramétrico',
      descricao:
        'Nova cotação de seguro paramétrico oferece cobertura 15% mais econômica que multirrisco tradicional.',
      impactoFinanceiro: 45000,
      dados: {
        economia: 'R$ 45.000',
        cobertura: 'R$ 2,8M',
      },
      acao: {
        label: 'Ver Proposta',
        onClick: () => console.log('Ver proposta'),
      },
    },
  ])

  return { alertas }
}
