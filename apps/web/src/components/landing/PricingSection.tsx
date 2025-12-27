'use client'

import { Botao, Emblema } from '@/components/ui'
import { useIdioma, useAnimateOnScroll } from '@/hooks'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function PricingCard({
  plano,
  index,
  isDestaque,
  isSobConsulta,
  t
}: {
  plano: {
    nome: string
    preco: string
    periodo: string
    descricao: string
    recursos: readonly string[]
  }
  index: number
  isDestaque: boolean
  isSobConsulta: boolean
  t: {
    maisPopular: string
    comecarAgora: string
    falarVendas: string
  }
}) {
  const { ref, isVisible } = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-2xl p-8 opacity-0',
        'transition-all duration-500',
        'hover:-translate-y-2',
        isDestaque
          ? 'bg-brand-900 text-white ring-4 ring-brand-400/30 hover:ring-brand-400/50 hover:shadow-2xl hover:shadow-brand-500/20'
          : 'bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:border-brand-500/30',
        isVisible && 'animate-fade-in-up'
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {isDestaque && (
        <Emblema variante="gold" className="absolute -top-3 left-1/2 -translate-x-1/2">
          {t.maisPopular}
        </Emblema>
      )}

      {/* Plan name */}
      <h3 className={`text-h3 mb-2 ${isDestaque ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
        {plano.nome}
      </h3>
      <p className={`text-body-sm mb-6 ${isDestaque ? 'text-brand-100' : 'text-neutral-500'}`}>
        {plano.descricao}
      </p>

      {/* Price */}
      <div className="mb-6">
        <span className={`text-display-md font-mono ${isDestaque ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
          {plano.preco}
        </span>
        <span className={`text-body-sm ${isDestaque ? 'text-brand-100' : 'text-neutral-500'}`}>
          {plano.periodo}
        </span>
      </div>

      {/* CTA */}
      <Botao
        variante={isDestaque ? 'secundario' : 'primario'}
        tamanho="md"
        className={cn(
          'w-full mb-8 transition-transform hover:scale-[1.02]',
          isDestaque && 'bg-white text-brand-900 dark:text-brand-900 hover:bg-brand-50 border-0'
        )}
      >
        {isSobConsulta ? t.falarVendas : t.comecarAgora}
      </Botao>

      {/* Features */}
      <ul className="space-y-3">
        {plano.recursos.map((recurso, i) => (
          <li
            key={recurso}
            className="flex items-start gap-3 group/item"
            style={{ animationDelay: `${(index * 150) + (i * 50)}ms` }}
          >
            <Check className={cn(
              'w-5 h-5 mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110',
              isDestaque ? 'text-brand-300' : 'text-brand-500'
            )} />
            <span className={cn(
              'text-body-sm transition-colors',
              isDestaque ? 'text-brand-100' : 'text-neutral-600 dark:text-neutral-400'
            )}>
              {recurso}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PricingSection() {
  const { t } = useIdioma()
  const { ref: headerRef, isVisible: headerVisible } = useAnimateOnScroll<HTMLDivElement>()

  return (
    <section id="precos" className="py-20 lg:py-32 bg-neutral-50 dark:bg-[#0A0A0A]">
      <div className="container-main">
        {/* Header */}
        <div
          ref={headerRef}
          className={cn(
            'text-center max-w-3xl mx-auto mb-16 opacity-0',
            headerVisible && 'animate-fade-in-up'
          )}
        >
          <p className="text-overline text-brand-900 dark:text-brand-400 uppercase tracking-wider mb-4">
            {t.pricing.badge}
          </p>
          <h2 className="text-display-md md:text-display-lg text-neutral-900 dark:text-white mb-6">
            {t.pricing.titulo}{' '}
            <span className="text-gradient-brand">{t.pricing.tituloDestaque}</span>
          </h2>
          <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
            {t.pricing.subtitulo}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {t.pricing.planos.map((plano, index) => {
            const isDestaque = index === 1 // Profissional plan
            const isSobConsulta = plano.periodo === ''

            return (
              <PricingCard
                key={plano.nome}
                plano={plano}
                index={index}
                isDestaque={isDestaque}
                isSobConsulta={isSobConsulta}
                t={{
                  maisPopular: t.pricing.maisPopular,
                  comecarAgora: t.pricing.comecarAgora,
                  falarVendas: t.pricing.falarVendas,
                }}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
