'use client'

import { useIdioma, useAnimateOnScroll } from '@/hooks'
import { Database, BrainCircuit, LineChart, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

const icons = [Database, BrainCircuit, LineChart, Wallet]

function StepCard({
    step,
    index,
    Icone
}: {
    step: { titulo: string; descricao: string }
    index: number
    Icone: typeof Database
}) {
    const { ref, isVisible } = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.3 })
    const isLast = index === 3

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex flex-col items-center text-center opacity-0',
                isVisible && 'animate-fade-in-up'
            )}
            style={{ animationDelay: `${index * 150}ms` }}
        >
            {/* Connector Line (Desktop) */}
            {!isLast && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-[2px] bg-gradient-to-r from-brand-200 to-neutral-200 dark:from-brand-900 dark:to-neutral-800 -z-10" />
            )}

            {/* Icon Circle */}
            <div className="relative w-20 h-20 mb-6 group">
                <div className="absolute inset-0 bg-white dark:bg-[#1A1A1A] rounded-full border-2 border-brand-100 dark:border-brand-900/30 shadow-sm group-hover:border-brand-500 dark:group-hover:border-brand-400 transition-colors duration-500" />
                <div className="absolute inset-2 bg-brand-50 dark:bg-brand-950/30 rounded-full flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors duration-500">
                    <Icone className="w-8 h-8 text-brand-900 dark:text-brand-400 group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Step Number Badge */}
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-brand-900 dark:bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]">
                    {index + 1}
                </div>
            </div>

            {/* Content */}
            <h3 className="text-h4 text-neutral-900 dark:text-white mb-3">
                {step.titulo}
            </h3>
            <p className="text-body-sm text-neutral-600 dark:text-neutral-400 max-w-[250px]">
                {step.descricao}
            </p>
        </div>
    )
}

export function HowItWorksSection() {
    const { t } = useIdioma()
    const { ref: headerRef, isVisible: headerVisible } = useAnimateOnScroll<HTMLDivElement>()

    return (
        <section className="py-20 lg:py-32 bg-neutral-50 dark:bg-[#0A0A0A] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
            </div>

            <div className="container-main relative z-10">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={cn(
                        'text-center max-w-3xl mx-auto mb-20 opacity-0',
                        headerVisible && 'animate-fade-in-up'
                    )}
                >
                    <p className="text-overline text-brand-900 dark:text-brand-400 uppercase tracking-wider mb-4">
                        {t.howItWorks.badge}
                    </p>
                    <h2 className="text-display-md md:text-display-lg text-neutral-900 dark:text-white mb-6">
                        {t.howItWorks.titulo}{' '}
                        <span className="text-gradient-brand">{t.howItWorks.tituloDestaque}</span>
                    </h2>
                    <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
                        {t.howItWorks.subtitulo}
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {t.howItWorks.steps.map((step, index) => {
                        const Icone = icons[index] || Database
                        return (
                            <StepCard
                                key={index}
                                step={step}
                                index={index}
                                Icone={Icone}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
