'use client'

import { useState } from 'react'
import { Botao, CampoTexto, Toast } from '@/components/ui'
import { useIdioma, useAnimateOnScroll, useCountUp } from '@/hooks'
import { ArrowRight, CheckCircle, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WaitlistSection() {
  const { t, idioma } = useIdioma()
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const { ref: sectionRef, isVisible } = useAnimateOnScroll<HTMLDivElement>()

  // Contador de pessoas na waitlist (número fictício para prova social)
  const { formattedCount: waitlistCount, ref: countRef } = useCountUp({
    end: 847,
    duration: 2500,
    prefix: '',
    suffix: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)

    // Simular envio (depois integrar com Resend/Mailchimp)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setEnviado(true)
    setCarregando(false)
    setShowToast(true)
  }

  return (
    <section id="waitlist" className="py-20 lg:py-32 bg-brand-900 relative overflow-hidden">
      <Toast
        message={t.waitlist.sucessoTitulo}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-brand-400/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-brand-600/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="container-main relative z-10">
        <div
          ref={sectionRef}
          className={cn(
            'max-w-2xl mx-auto text-center opacity-0',
            isVisible && 'animate-fade-in-up'
          )}
        >
          {enviado ? (
            <div className="animate-scale-in">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <CheckCircle className="w-8 h-8 text-brand-300" />
              </div>
              <h2 className="text-display-md text-white mb-4">
                {t.waitlist.sucessoTitulo}
              </h2>
              <p className="text-body-lg text-brand-100">
                {t.waitlist.sucessoMsg}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-display-md md:text-display-lg text-white mb-6">
                {t.waitlist.titulo}
              </h2>
              <p className="text-body-lg text-brand-100 mb-6">
                {t.waitlist.subtitulo}
              </p>

              {/* Social proof counter */}
              <div
                ref={countRef as React.RefObject<HTMLDivElement>}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-10 border border-white/20"
              >
                <Users className="w-4 h-4 text-brand-300" />
                <span className="text-sm font-medium text-white">
                  <span className="font-mono">{waitlistCount}</span>
                  {' '}
                  {idioma === 'pt' ? 'produtores na lista' : 'farmers on the list'}
                </span>
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <CampoTexto
                  type="email"
                  placeholder={t.waitlist.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                />
                <Botao
                  type="submit"
                  variante="secundario"
                  carregando={carregando}
                  className="bg-white text-brand-900 dark:text-brand-900 hover:bg-brand-50 border-0 whitespace-nowrap hover:scale-[1.02] transition-transform"
                >
                  {t.waitlist.botao}
                  <ArrowRight className="w-4 h-4" />
                </Botao>
              </form>

              <p className="text-sm text-brand-200 mt-4">
                {t.waitlist.spam}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
