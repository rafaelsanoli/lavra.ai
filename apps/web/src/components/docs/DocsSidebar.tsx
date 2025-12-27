'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Book, Cpu, Layers, Rocket } from 'lucide-react'

const menuItems = [
    {
        title: 'Comece aqui',
        items: [
            {
                label: 'Introdução',
                href: '/docs/introducao',
                icon: Rocket
            },
        ]
    },
    {
        title: 'Produto',
        items: [
            {
                label: 'Funcionalidades',
                href: '/docs/funcionalidades',
                icon: Layers
            },
            {
                label: 'Tecnologia',
                href: '/docs/tecnologia',
                icon: Cpu
            },
        ]
    }
]

export function DocsSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0A0A0A] hidden lg:block h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
            <div className="p-6">
                <div className="mb-6 flex items-center gap-2 px-2">
                    <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
                        <Book className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm text-neutral-900 dark:text-white">Documentação</span>
                </div>

                <nav className="space-y-6">
                    {menuItems.map((section, i) => (
                        <div key={i}>
                            <h3 className="px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href
                                    const Icon = item.icon

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                                                isActive
                                                    ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium"
                                                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                                            )}
                                        >
                                            <Icon className={cn("w-4 h-4", isActive ? "text-brand-600 dark:text-brand-400" : "text-neutral-400")} />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Card de Ajuda */}
                <div className="mt-8 p-4 bg-brand-50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/20">
                    <p className="text-xs font-medium text-brand-900 dark:text-brand-100 mb-1">Precisa de ajuda?</p>
                    <p className="text-xs text-brand-700 dark:text-brand-300/80 mb-3">
                        Fale com nosso time de suporte especializado.
                    </p>
                    <a
                        href="mailto:suporte@lavra.ai"
                        className="text-xs font-semibold text-brand-700 dark:text-brand-300 hover:underline"
                    >
                        Falar com suporte →
                    </a>
                </div>
            </div>
        </aside>
    )
}
