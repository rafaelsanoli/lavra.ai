'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { cn } from '@/lib/utils'

interface GraficoLinhaProps {
  data: Record<string, unknown>[]
  linhas: {
    dataKey: string
    nome: string
    cor: string
  }[]
  altura?: number
  xAxisKey?: string
  className?: string
  mostrarLegenda?: boolean
  mostrarGrid?: boolean
}

export function GraficoLinha({
  data,
  linhas,
  altura = 300,
  xAxisKey = 'mes',
  className,
  mostrarLegenda = true,
  mostrarGrid = true,
}: GraficoLinhaProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={altura}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {mostrarGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
          )}
          <XAxis
            dataKey={xAxisKey}
            className="text-xs text-neutral-600 dark:text-neutral-400"
            stroke="currentColor"
          />
          <YAxis
            className="text-xs text-neutral-600 dark:text-neutral-400"
            stroke="currentColor"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
              color: 'var(--tooltip-text)',
            }}
          />
          {mostrarLegenda && <Legend />}
          {linhas.map((linha) => (
            <Line
              key={linha.dataKey}
              type="monotone"
              dataKey={linha.dataKey}
              name={linha.nome}
              stroke={linha.cor}
              strokeWidth={2}
              dot={{ fill: linha.cor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
