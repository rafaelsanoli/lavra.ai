'use client'

import { useState } from 'react'
import { Botao, CampoTexto } from '@/components/ui'
import { useIdioma } from '@/hooks'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function WaitlistSection() {
  const { t } = useIdioma()
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    
    // Simular envio (depois integrar com Resend/Mailchimp)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setEnviado(true)
    setCarregando(false)
  }

  return (
    <section id="waitlist" className="py-20 lg:py-32 bg-brand-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
      </div>
      
      <div className="container-main relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {enviado ? (
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
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
              <p className="text-body-lg text-brand-100 mb-10">
                {t.waitlist.subtitulo}
              </p>
              
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
                  className="bg-white text-brand-900 hover:bg-brand-50 border-0 whitespace-nowrap"
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
