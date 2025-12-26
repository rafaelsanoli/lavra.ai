import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'fantasma'
  tamanho?: 'sm' | 'md' | 'lg'
  carregando?: boolean
}

const Botao = forwardRef<HTMLButtonElement, BotaoProps>(
  ({ className, variante = 'primario', tamanho = 'md', carregando, children, disabled, ...props }, ref) => {
    const estilosBase = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed'
    
    const estilosVariante = {
      primario: 'bg-brand-900 hover:bg-brand-950 active:bg-brand-950 text-white shadow-sm hover:shadow-md hover:-translate-y-px',
      secundario: 'bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800',
      fantasma: 'bg-transparent text-brand-900 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20',
    }
    
    const estilosTamanho = {
      sm: 'px-4 py-2 text-sm rounded-md',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    return (
      <button
        className={cn(
          estilosBase,
          estilosVariante[variante],
          estilosTamanho[tamanho],
          className
        )}
        ref={ref}
        disabled={disabled || carregando}
        {...props}
      >
        {carregando ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Botao.displayName = 'Botao'

export { Botao }
