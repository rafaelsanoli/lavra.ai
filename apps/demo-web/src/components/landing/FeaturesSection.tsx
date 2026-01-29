'use client'

import { useIdioma, useAnimateOnScroll } from '@/hooks'
import {
  CloudSun,
  TrendingUp,
  Tractor,
  Bell,
  Calculator
} from 'lucide-react'
import { cn } from '@/lib/utils'

const icones = [CloudSun, TrendingUp, Tractor, Bell, Calculator]

import Link from 'next/link'

function FeatureCard({
  feature,
  index,
  Icone
}: {
  feature: { titulo: string; descricao: string }
  index: number
  Icone: typeof CloudSun
}) {
  const { ref, isVisible } = useAnimateOnScroll<HTMLAnchorElement>({ threshold: 0.2 })

  return (
    <Link
      href="/docs/funcionalidades"
      ref={ref}
      className={cn(
        'group card opacity-0 block',
        'hover:shadow-lg hover:border-brand-500/30 hover:-translate-y-1',
        'transition-all duration-500',
        isVisible && 'animate-fade-in-up'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon with glow effect on hover */}
      <div className="relative w-12 h-12 bg-brand-50 dark:bg-brand-950/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-all duration-300">
        <div className="absolute inset-0 rounded-xl bg-brand-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icone className="relative w-6 h-6 text-brand-900 dark:text-brand-400 group-hover:scale-110 transition-transform" />
      </div>

      {/* Content */}
      <h3 className="text-h3 text-neutral-900 dark:text-white mb-2 group-hover:text-brand-900 dark:group-hover:text-brand-400 transition-colors">
        {feature.titulo}
      </h3>
      <p className="text-body-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {feature.descricao}
      </p>

      {/* Subtle arrow on hover */}
      <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1">
        <span className="text-sm font-medium">Saiba mais</span>
        <span>→</span>
      </div>
    </Link>
  )
}

export function FeaturesSection() {
  const { t } = useIdioma()
  const { ref: headerRef, isVisible: headerVisible } = useAnimateOnScroll<HTMLDivElement>()

  return (
    <section id="produto" className="py-20 lg:py-32 bg-white dark:bg-[#0A0A0A]">
      <div className="container-main">
        {/* Header with scroll animation */}
        <div
          ref={headerRef}
          className={cn(
            'text-center max-w-3xl mx-auto mb-16 opacity-0',
            headerVisible && 'animate-fade-in-up'
          )}
        >
          <p className="text-overline text-brand-900 dark:text-brand-400 uppercase tracking-wider mb-4">
            {t.features.badge}
          </p>
          <h2 className="text-display-md md:text-display-lg text-neutral-900 dark:text-white mb-6">
            {t.features.titulo}{' '}
            <span className="text-gradient-brand">{t.features.tituloDestaque}</span>
          </h2>
          <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
            {t.features.subtitulo}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feature, index) => {
            const Icone = icones[index] || CloudSun
            return (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                Icone={Icone}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
