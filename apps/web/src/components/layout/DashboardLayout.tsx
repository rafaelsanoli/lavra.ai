'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { ChatWidget } from '@/components/widgets'
import {
  LayoutDashboard,
  CloudSun,
  TrendingUp,
  Tractor,
  Bell,
  Calculator,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Moon,
  Sun,
  Shield,
  LineChart,
} from 'lucide-react'
import { useTema } from '@/hooks'

const menuItems = [
  { nome: 'Dashboard', href: '/dashboard', icone: LayoutDashboard },
  { nome: 'Clima', href: '/clima', icone: CloudSun },
  { nome: 'Mercado', href: '/mercado', icone: TrendingUp },
  { nome: 'Operações', href: '/operacoes', icone: Tractor },
  { nome: 'Seguros', href: '/seguros', icone: Shield },
  { nome: 'Hedge', href: '/hedge', icone: LineChart },
  { nome: 'Alertas', href: '/alertas', icone: Bell },
  { nome: 'Cenários', href: '/cenarios', icone: Calculator },
  { nome: 'Configurações', href: '/configuracoes', icone: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const pathname = usePathname()
  const { usuario, logout } = useAuthStore()
  const { tema, alternarTema } = useTema()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-[#0F0F0F] border-r border-neutral-200 dark:border-neutral-800">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-neutral-200 dark:border-neutral-800">
            <Link href="/dashboard">
              <Logo tamanho="md" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icone = item.icone
              const ativo = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    ativo
                      ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-400'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  )}
                >
                  <Icone className="w-5 h-5" />
                  {item.nome}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                  {usuario?.nome}
                </p>
                <p className="text-xs text-neutral-500 truncate">{usuario?.email}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={alternarTema}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
              >
                {tema === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <button
                onClick={logout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-white dark:bg-[#0F0F0F] border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/dashboard">
          <Logo tamanho="sm" />
        </Link>
        <button
          onClick={() => setSidebarAberta(!sidebarAberta)}
          className="p-2 text-neutral-600 dark:text-neutral-400"
        >
          {sidebarAberta ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarAberta && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarAberta(false)}>
          <aside className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0F0F0F]" onClick={(e) => e.stopPropagation()}>
            <nav className="px-4 py-6 mt-16 space-y-1">
              {menuItems.map((item) => {
                const Icone = item.icone
                const ativo = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarAberta(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      ativo
                        ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-400'
                        : 'text-neutral-600 dark:text-neutral-400'
                    )}
                  >
                    <Icone className="w-5 h-5" />
                    {item.nome}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
