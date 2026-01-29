import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string
  erro?: string
  ajuda?: string
}

const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  ({ className, rotulo, erro, ajuda, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {rotulo && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {rotulo}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full h-12 px-4',
            'bg-white dark:bg-[#1A1A1A]',
            'border border-neutral-200 dark:border-neutral-700',
            'rounded-lg',
            'text-base text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-500',
            'transition-all duration-fast',
            'focus:outline-none focus:border-brand-900 dark:focus:border-brand-400',
            'focus:ring-2 focus:ring-brand-900/10 dark:focus:ring-brand-400/20',
            erro && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {erro && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{erro}</p>
        )}
        {ajuda && !erro && (
          <p className="mt-1.5 text-sm text-neutral-500">{ajuda}</p>
        )}
      </div>
    )
  }
)

CampoTexto.displayName = 'CampoTexto'

export { CampoTexto }
