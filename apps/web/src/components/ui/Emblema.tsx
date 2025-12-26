import { cn } from '@/lib/utils'

export interface EmblemaProps {
  variante?: 'brand' | 'sucesso' | 'alerta' | 'erro' | 'gold'
  children: React.ReactNode
  className?: string
}

export function Emblema({ variante = 'brand', children, className }: EmblemaProps) {
  const estilos = {
    brand: 'bg-brand-900 text-white',
    sucesso: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    alerta: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    erro: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    gold: 'bg-gold text-white',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5',
        'text-xs font-medium rounded-full',
        estilos[variante],
        className
      )}
    >
      {children}
    </span>
  )
}
