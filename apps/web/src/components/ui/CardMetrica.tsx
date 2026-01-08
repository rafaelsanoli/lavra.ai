'use client'

import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface CardMetricaProps {
  titulo: string
  valor: string | number
  variacao?: string
  tipo?: 'positivo' | 'negativo' | 'neutro'
  icone?: React.ReactNode
  className?: string
  descricao?: string
}

export function CardMetrica({
  titulo,
  valor,
  variacao,
  tipo = 'neutro',
  icone,
  className,
  descricao,
}: CardMetricaProps) {
  const cores = {
    positivo: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
    negativo: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
    neutro: 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/30',
  }

  const IconeVariacao = tipo === 'positivo' ? ArrowUp : tipo === 'negativo' ? ArrowDown : Minus

  return (
    <div
      className={cn(
        'p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800',
        'hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{titulo}</p>
        {icone && (
          <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400">
            {icone}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-neutral-900 dark:text-white font-mono">{valor}</p>

        {variacao && (
          <div className="flex items-center gap-2">
            <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', cores[tipo])}>
              <IconeVariacao className="w-3 h-3" />
              {variacao}
            </span>
            {descricao && <span className="text-xs text-neutral-500">{descricao}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
