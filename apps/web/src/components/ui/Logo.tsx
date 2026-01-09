'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  tamanho?: 'sm' | 'md' | 'lg'
  apenasIcone?: boolean
}

export function Logo({ className, tamanho = 'md', apenasIcone = false }: LogoProps) {
  const tamanhos = {
    sm: { icone: 32, texto: 'text-lg' },
    md: { icone: 40, texto: 'text-xl' },
    lg: { icone: 52, texto: 'text-2xl' },
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Logo PNG com estilo */}
      <div className="relative">
        <Image 
          src="/logo.png" 
          alt="Lavra.ia" 
          width={tamanhos[tamanho].icone} 
          height={tamanhos[tamanho].icone}
          className="object-contain rounded-xl"
        />
      </div>
      
      {/* Texto */}
      {!apenasIcone && (
        <span className={cn('font-bold tracking-tight text-neutral-900 dark:text-white', tamanhos[tamanho].texto)}>
          lavra<span className="text-brand-600 dark:text-brand-400">.ia</span>
        </span>
      )}
    </div>
  )
}
