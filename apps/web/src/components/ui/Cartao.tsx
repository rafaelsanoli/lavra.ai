import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CartaoProps extends HTMLAttributes<HTMLDivElement> {
  comHover?: boolean
  status?: 'sucesso' | 'alerta' | 'erro'
}

const Cartao = forwardRef<HTMLDivElement, CartaoProps>(
  ({ className, comHover = false, status, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'bg-white dark:bg-[#1A1A1A]',
          'border border-neutral-200 dark:border-neutral-800',
          'rounded-lg p-6',
          'shadow-sm',
          'transition-all duration-normal',
          comHover && 'hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5 cursor-pointer',
          status === 'sucesso' && 'border-l-4 border-l-green-500',
          status === 'alerta' && 'border-l-4 border-l-yellow-500',
          status === 'erro' && 'border-l-4 border-l-red-500',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Cartao.displayName = 'Cartao'

export { Cartao }
