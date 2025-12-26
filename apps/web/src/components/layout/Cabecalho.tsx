'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui'
import { useIdioma, useTema } from '@/hooks'
import { Menu, X, Sun, Moon, Globe } from 'lucide-react'

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { idioma, setIdioma, t } = useIdioma()
  const { tema, alternarTema } = useTema()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linksNavegacao = [
    { nome: t.nav.produto, href: '#produto' },
    { nome: t.nav.precos, href: '#precos' },
    { nome: t.nav.sobre, href: '#sobre' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-normal',
        scrolled || menuAberto
          ? 'bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800'
          : 'bg-transparent'
      )}
    >
      <nav className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <Logo tamanho="md" />
          </Link>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {linksNavegacao.map((link) => (
              <Link
                key={link.nome}
                href={link.href}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {link.nome}
              </Link>
            ))}
          </div>

          {/* CTAs Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Seletor de Idioma */}
            <button
              onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')}
              className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title={idioma === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-medium">{idioma}</span>
            </button>

            {/* Toggle Tema */}
            <button
              onClick={alternarTema}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title={tema === 'light' ? 'Modo escuro' : 'Modo claro'}
            >
              {tema === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Toggle Tema Mobile */}
            <button
              onClick={alternarTema}
              className="p-2 text-neutral-600 dark:text-neutral-400"
            >
              {tema === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button
              className="p-2 text-neutral-600 dark:text-neutral-400"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuAberto && (
          <div className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col gap-4">
              {linksNavegacao.map((link) => (
                <Link
                  key={link.nome}
                  href={link.href}
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
                  onClick={() => setMenuAberto(false)}
                >
                  {link.nome}
                </Link>
              ))}

              {/* Seletor de Idioma Mobile */}
              <button
                onClick={() => setIdioma(idioma === 'pt' ? 'en' : 'pt')}
                className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <Globe className="w-4 h-4" />
                {idioma === 'pt' ? 'English' : 'Português'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
