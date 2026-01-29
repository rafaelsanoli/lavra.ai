import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes do Tailwind de forma inteligente
 * Evita conflitos e duplicações
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata valores monetários em Real brasileiro
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

/**
 * Formata números grandes de forma abreviada
 * Ex: 1.500.000 -> 1,5M
 */
export function formatarNumeroAbreviado(valor: number): string {
  if (valor >= 1000000) {
    return `${(valor / 1000000).toFixed(1).replace('.', ',')}M`
  }
  if (valor >= 1000) {
    return `${(valor / 1000).toFixed(1).replace('.', ',')}K`
  }
  return valor.toString()
}

/**
 * Formata porcentagem
 */
export function formatarPorcentagem(valor: number, casasDecimais = 1): string {
  return `${valor >= 0 ? '+' : ''}${valor.toFixed(casasDecimais).replace('.', ',')}%`
}
