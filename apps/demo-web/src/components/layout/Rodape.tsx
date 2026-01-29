'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui'
import { useIdioma } from '@/hooks'

export function Rodape() {
  const { t } = useIdioma()

  return (
    <footer className="bg-neutral-50 dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-neutral-800">
      <div className="container-main py-12 lg:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo e descrição */}
          <div className="max-w-md">
            <Link href="/">
              <Logo tamanho="md" />
            </Link>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              {t.footer.descricao}
            </p>
          </div>

          {/* Links internos que funcionam */}
          <div className="flex flex-wrap gap-6">
            <Link
              href="#produto"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-900 dark:hover:text-brand-400 transition-colors"
            >
              {t.footer.links.funcionalidades}
            </Link>
            <Link
              href="#precos"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-900 dark:hover:text-brand-400 transition-colors"
            >
              {t.footer.links.precos}
            </Link>
            <Link
              href="#waitlist"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-brand-900 dark:hover:text-brand-400 transition-colors"
            >
              Waitlist
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Lavra.ia. {t.footer.direitos}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
