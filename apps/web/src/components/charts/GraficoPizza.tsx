'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'

interface GraficoPizzaProps {
  data: Record<string, unknown>[]
  dataKey: string
  nameKey: string
  cores: string[]
  altura?: number
  className?: string
  mostrarLegenda?: boolean
}

export function GraficoPizza({
  data,
  dataKey,
  nameKey,
  cores,
  altura = 300,
  className,
  mostrarLegenda = true,
}: GraficoPizzaProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={altura}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
            }}
          />
          {mostrarLegenda && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
