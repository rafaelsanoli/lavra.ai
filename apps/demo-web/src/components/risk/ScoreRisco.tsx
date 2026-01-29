'use client'

import { motion } from 'framer-motion'
import { Cloud, TrendingUp, Bug, Droplet, AlertTriangle, Shield } from 'lucide-react'

type RiskFactor = {
  nome: string
  valor: number
  icone: React.ReactNode
  cor: string
}

type ScoreRiscoProps = {
  score: number
  fatores: RiskFactor[]
}

export function ScoreRisco({ score, fatores }: ScoreRiscoProps) {
  const radius = 80
  const circunferencia = 2 * Math.PI * radius
  const offset = circunferencia - (score / 100) * circunferencia

  const getScoreColor = (valor: number) => {
    if (valor >= 80) return '#ef4444' // red-500
    if (valor >= 60) return '#f59e0b' // amber-500
    if (valor >= 40) return '#eab308' // yellow-500
    if (valor >= 20) return '#84cc16' // lime-500
    return '#10b981' // green-500
  }

  const getScoreLabel = (valor: number) => {
    if (valor >= 80) return 'Crítico'
    if (valor >= 60) return 'Alto'
    if (valor >= 40) return 'Médio'
    if (valor >= 20) return 'Baixo'
    return 'Muito Baixo'
  }

  const getScoreDescription = (valor: number) => {
    if (valor >= 80) return 'Ação imediata necessária. Múltiplos fatores de risco elevados.'
    if (valor >= 60) return 'Atenção requerida. Considere estratégias de mitigação.'
    if (valor >= 40) return 'Monitoramento ativo. Alguns fatores necessitam atenção.'
    if (valor >= 20) return 'Situação controlada. Mantenha o monitoramento regular.'
    return 'Excelente situação. Continue com as práticas atuais.'
  }

  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)
  const scoreDescription = getScoreDescription(score)

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Score de Risco
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Gauge Circular */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <div className="relative w-52 h-52">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r={radius}
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-neutral-100 dark:text-neutral-800"
              />
              {/* Progress circle */}
              <motion.circle
                cx="104"
                cy="104"
                r={radius}
                stroke={scoreColor}
                strokeWidth="16"
                fill="transparent"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circunferencia }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                style={{
                  strokeDasharray: circunferencia,
                }}
              />
            </svg>

            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-center"
              >
                <div className="text-5xl font-bold" style={{ color: scoreColor }}>
                  {score}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  / 100
                </div>
              </motion.div>
            </div>
          </div>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-center"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: `${scoreColor}20`,
                color: scoreColor,
              }}
            >
              <AlertTriangle className="w-4 h-4" />
              Risco {scoreLabel}
            </div>
          </motion.div>
        </div>

        {/* Breakdown dos fatores */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Fatores de Risco
          </h4>
          
          <div className="space-y-4">
            {fatores.map((fator, index) => (
              <motion.div
                key={fator.nome}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${fator.cor}20`, color: fator.cor }}
                    >
                      {fator.icone}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {fator.nome}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: fator.cor }}
                  >
                    {fator.valor}%
                  </span>
                </div>
                
                {/* Barra de progresso */}
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fator.valor}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: fator.cor }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700"
          >
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {scoreDescription}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Função helper para criar fatores de risco padrão
export const criarFatoresRisco = (dados?: {
  clima?: number
  mercado?: number
  pragas?: number
  hidrico?: number
}): RiskFactor[] => {
  return [
    {
      nome: 'Risco Climático',
      valor: dados?.clima ?? 45,
      icone: <Cloud className="w-4 h-4" />,
      cor: '#3b82f6', // blue-500
    },
    {
      nome: 'Volatilidade de Preços',
      valor: dados?.mercado ?? 72,
      icone: <TrendingUp className="w-4 h-4" />,
      cor: '#f59e0b', // amber-500
    },
    {
      nome: 'Pragas & Doenças',
      valor: dados?.pragas ?? 38,
      icone: <Bug className="w-4 h-4" />,
      cor: '#ec4899', // pink-500
    },
    {
      nome: 'Risco Hídrico',
      valor: dados?.hidrico ?? 55,
      icone: <Droplet className="w-4 h-4" />,
      cor: '#06b6d4', // cyan-500
    },
  ]
}
