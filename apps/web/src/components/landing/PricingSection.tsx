'use client'

import { Botao, Emblema } from '@/components/ui'
import { useIdioma } from '@/hooks'
import { Check } from 'lucide-react'

export function PricingSection() {
  const { t } = useIdioma()

  return (
    <section id="precos" className="py-20 lg:py-32 bg-neutral-50 dark:bg-[#0A0A0A]">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
              <div
                key={plano.nome}
                className={`relative rounded-2xl p-8 ${
                  isDestaque
                    ? 'bg-brand-900 text-white ring-4 ring-brand-400/30'
                    : 'bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {isDestaque && (
                  <Emblema variante="gold" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {t.pricing.maisPopular}
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
                  className={`w-full mb-8 ${isDestaque ? 'bg-white text-brand-900 hover:bg-brand-50 border-0' : ''}`}
                >
                  {isSobConsulta ? t.pricing.falarVendas : t.pricing.comecarAgora}
                </Botao>
                
                {/* Features */}
                <ul className="space-y-3">
                  {plano.recursos.map((recurso) => (
                    <li key={recurso} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDestaque ? 'text-brand-300' : 'text-brand-500'}`} />
                      <span className={`text-body-sm ${isDestaque ? 'text-brand-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        {recurso}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
