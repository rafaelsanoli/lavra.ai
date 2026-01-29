'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { cn } from '@/lib/utils'

interface GraficoBarraProps {
  data: Record<string, unknown>[]
  barras: {
    dataKey: string
    nome: string
    cor: string
  }[]
  altura?: number
  className?: string
  mostrarLegenda?: boolean
}

export function GraficoBarra({
  data,
  barras,
  altura = 300,
  className,
  mostrarLegenda = true,
}: GraficoBarraProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
          <XAxis
            dataKey="nome"
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
            }}
          />
          {mostrarLegenda && <Legend />}
          {barras.map((barra) => (
            <Bar
              key={barra.dataKey}
              dataKey={barra.dataKey}
              name={barra.nome}
              fill={barra.cor}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
