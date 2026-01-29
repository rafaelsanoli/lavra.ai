'use client'

import { useState } from 'react'
import { useIdioma, useAnimateOnScroll } from '@/hooks'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AiChatMockup } from './AiChatMockup'

function FaqItem({
    pergunta,
    resposta,
    index
}: {
    pergunta: string
    resposta: string
    index: number
}) {
    const [isOpen, setIsOpen] = useState(false)
    const { ref, isVisible } = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.2 })

    return (
        <div
            ref={ref}
            className={cn(
                'border-b border-neutral-200 dark:border-neutral-800 last:border-0 opacity-0',
                isVisible && 'animate-fade-in-up'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-6 text-left group"
            >
                <span className="text-lg font-medium text-neutral-900 dark:text-white group-hover:text-brand-900 dark:group-hover:text-brand-400 transition-colors">
                    {pergunta}
                </span>
                <span className={cn(
                    'p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 transition-all duration-300',
                    isOpen ? 'rotate-180 bg-brand-100 dark:bg-brand-900/30 text-brand-900 dark:text-brand-400' : 'group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                )}>
                    <ChevronDown className="w-5 h-5" />
                </span>
            </button>

            <div
                className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'
                )}
            >
                <p className="text-body-md text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {resposta}
                </p>
            </div>
        </div>
    )
}

export function FaqSection() {
    const { t } = useIdioma()
    const { ref: headerRef, isVisible: headerVisible } = useAnimateOnScroll<HTMLDivElement>()

    return (
        <section id="faq" className="py-20 lg:py-32 bg-white dark:bg-[#0A0A0A]">
            <div className="container-main">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Chat Mockup (Left) */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="sticky top-32">
                            <AiChatMockup />
                        </div>
                    </div>

                    {/* Content (Right) */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div
                            ref={headerRef}
                            className={cn(
                                'mb-12 opacity-0',
                                headerVisible && 'animate-fade-in-up'
                            )}
                        >
                            <p className="text-overline text-brand-900 dark:text-brand-400 uppercase tracking-wider mb-4">
                                {t.faq.badge}
                            </p>
                            <h2 className="text-display-md text-neutral-900 dark:text-white mb-6">
                                {t.faq.titulo}{' '}
                                <span className="text-gradient-brand">{t.faq.tituloDestaque}</span>
                            </h2>
                            <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
                                {t.faq.subtitulo}
                            </p>
                        </div>

                        <div className="bg-neutral-50 dark:bg-[#141414] rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
                            {t.faq.items.map((item, index) => (
                                <FaqItem
                                    key={index}
                                    pergunta={item.pergunta}
                                    resposta={item.resposta}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
