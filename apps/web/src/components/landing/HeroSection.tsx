'use client'

import { Botao, Emblema } from '@/components/ui'
import { useIdioma } from '@/hooks'
import { ArrowRight, Play } from 'lucide-react'

export function HeroSection() {
  const { t } = useIdioma()
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-950/20 dark:via-[#0A0A0A] dark:to-[#0A0A0A]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 dark:opacity-10" />
      
      <div className="container-main relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Copy */}
          <div className="animate-fade-in">
            {/* Badge estilo Vercel */}
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-neutral-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 cursor-default backdrop-blur-sm">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/20 to-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <span className="relative text-lg">🦄</span>
                <span className="relative text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  {t.hero.emblema}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
              </div>
            </div>
            
            <h1 className="text-display-lg md:text-display-xl lg:text-display-2xl text-neutral-900 dark:text-white mb-6">
              {t.hero.titulo}{' '}
              <span className="text-gradient-brand">{t.hero.tituloDestaque}</span>
            </h1>
            
            <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl">
              {t.hero.subtitulo}
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              <div>
                <p className="text-display-md font-mono text-brand-900 dark:text-brand-400">{t.hero.estatisticas.lucro.valor}</p>
                <p className="text-body-sm text-neutral-500">{t.hero.estatisticas.lucro.label}</p>
              </div>
              <div>
                <p className="text-display-md font-mono text-brand-900 dark:text-brand-400">{t.hero.estatisticas.previsao.valor}</p>
                <p className="text-body-sm text-neutral-500">{t.hero.estatisticas.previsao.label}</p>
              </div>
              <div>
                <p className="text-display-md font-mono text-brand-900 dark:text-brand-400">{t.hero.estatisticas.precisao.valor}</p>
                <p className="text-body-sm text-neutral-500">{t.hero.estatisticas.precisao.label}</p>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Botao variante="primario" tamanho="lg">
                {t.hero.cta}
                <ArrowRight className="w-4 h-4" />
              </Botao>
              <Botao variante="secundario" tamanho="lg">
                <Play className="w-4 h-4" />
                {t.hero.ctaSecundario}
              </Botao>
            </div>
          </div>
          
          {/* Right Column - Dashboard Preview */}
          <div className="relative lg:pl-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-400/20 to-brand-600/20 blur-3xl rounded-3xl" />
            
            {/* Dashboard mockup */}
            <div className="relative bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 dark:bg-[#141414] border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-neutral-200 dark:bg-neutral-700 rounded-md h-6 flex items-center px-3">
                    <span className="text-xs text-neutral-500">app.lavra.ai/dashboard</span>
                  </div>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-overline text-neutral-500 uppercase tracking-wider">Lucro Projetado</p>
                    <p className="text-display-md font-mono text-green-600 dark:text-green-400">
                      R$ 2.847.000
                    </p>
                  </div>
                  <Emblema variante="sucesso">+12,4% ↑</Emblema>
                </div>
                
                {/* Chart placeholder */}
                <div className="h-40 bg-gradient-to-t from-brand-100/50 to-transparent dark:from-brand-900/20 rounded-lg flex items-end justify-around px-4 pb-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                    <div
                      key={i}
                      className="w-4 bg-brand-500 dark:bg-brand-400 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                
                {/* Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-50 dark:bg-[#141414] rounded-lg">
                    <p className="text-caption text-neutral-500">Clima</p>
                    <p className="text-h4 text-neutral-900 dark:text-white">☀️ 28°C</p>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-[#141414] rounded-lg">
                    <p className="text-caption text-neutral-500">Soja @</p>
                    <p className="text-h4 text-neutral-900 dark:text-white">R$ 142</p>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-[#141414] rounded-lg">
                    <p className="text-caption text-neutral-500">Alerta</p>
                    <p className="text-h4 text-yellow-600">⚠️ 1</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">Janela ideal</p>
                  <p className="text-xs text-neutral-500">Venda de soja em 3 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
