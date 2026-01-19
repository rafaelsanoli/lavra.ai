'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useTema } from '@/hooks/useTema'

interface LogoProps {
  className?: string
  tamanho?: 'sm' | 'md' | 'lg'
  apenasIcone?: boolean
}

export function Logo({ className, tamanho = 'md', apenasIcone = false }: LogoProps) {
  const { tema } = useTema()
  
  const tamanhos = {
    sm: { icone: 32, texto: 'text-lg' },
    md: { icone: 40, texto: 'text-xl' },
    lg: { icone: 52, texto: 'text-2xl' },
  }

  // Seleciona a logo baseada no tema atual
  const logoSrc = tema === 'dark' ? '/logo-dark.png' : '/logo-light.png'

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Logo PNG adaptativa ao tema */}
      <div className="relative">
        <Image 
          src={logoSrc} 
          alt="Lavra" 
          width={tamanhos[tamanho].icone} 
          height={tamanhos[tamanho].icone}
          className="object-contain"
          priority
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
