'use client'

import { useIdioma } from '@/hooks'
import { 
  CloudSun, 
  TrendingUp, 
  Tractor, 
  Bell, 
  Calculator 
} from 'lucide-react'

const icones = [CloudSun, TrendingUp, Tractor, Bell, Calculator]

export function FeaturesSection() {
  const { t } = useIdioma()

  return (
    <section id="produto" className="py-20 lg:py-32 bg-white dark:bg-[#0A0A0A]">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
              <div
                key={index}
                className="group card card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                  <Icone className="w-6 h-6 text-brand-900 dark:text-brand-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-h3 text-neutral-900 dark:text-white mb-2">
                  {feature.titulo}
                </h3>
                <p className="text-body-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {feature.descricao}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
