'use client'

import { useState, useEffect } from 'react'
import { useAnimateOnScroll } from '@/hooks'
import { Bot, User, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AiChatMockup() {
    const { ref, isVisible } = useAnimateOnScroll<HTMLDivElement>({ threshold: 0.5 })
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (isVisible) {
            const timers = [
                setTimeout(() => setStep(1), 500),  // User message appears
                setTimeout(() => setStep(2), 1500), // AI typing starts
                setTimeout(() => setStep(3), 3500), // AI message appears
            ]
            return () => timers.forEach(clearTimeout)
        }
    }, [isVisible])

    return (
        <div
            ref={ref}
            className="relative w-full max-w-md mx-auto bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-[#141414] border-b border-neutral-200 dark:border-neutral-800">
                <div className="w-8 h-8 bg-brand-900 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">LAVRA AI</p>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Online
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 space-y-4 min-h-[320px] bg-neutral-50/50 dark:bg-[#0A0A0A]">

                {/* User Message */}
                <div className={cn(
                    "flex justify-end transition-all duration-500 transform",
                    step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                    <div className="bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                        <p className="text-sm">Devo vender minha soja hoje? O preço subiu um pouco.</p>
                    </div>
                    <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-700 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                        <User className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                    </div>
                </div>

                {/* AI Typing Indicator */}
                {step === 2 && (
                    <div className="flex items-center gap-2 text-neutral-400 text-xs ml-10 animate-pulse">
                        <Bot className="w-4 h-4" />
                        <span>LAVRA AI está digitando...</span>
                    </div>
                )}

                {/* AI Response */}
                <div className={cn(
                    "flex justify-start transition-all duration-500 transform",
                    step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                    <div className="w-8 h-8 bg-brand-900 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl rounded-tl-sm max-w-[95%] shadow-sm">
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 mb-4">
                            Analisei seu cenário. <strong className="text-red-600 dark:text-red-400">Não recomendo vender hoje.</strong>
                        </p>

                        {/* Data Card */}
                        <div className="bg-neutral-50 dark:bg-[#141414] rounded-xl p-4 mb-4 border border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">Tendência (Próx. 5 dias)</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-neutral-900 dark:text-white">R$ 142,50</span>
                                        <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> +4.2%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SVG Chart */}
                            <div className="h-24 w-full relative">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800/50 border-dashed border-t border-neutral-200 dark:border-neutral-800" />
                                    <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800/50 border-dashed border-t border-neutral-200 dark:border-neutral-800" />
                                    <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800/50 border-dashed border-t border-neutral-200 dark:border-neutral-800" />
                                </div>

                                {/* Chart Line */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="-10 0 260 100">
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0,80 C20,75 40,70 60,65 C80,60 100,62 120,50 C140,38 160,45 180,30 C200,15 220,20 240,10"
                                        fill="url(#gradient)"
                                        stroke="none"
                                        className="w-full"
                                    />
                                    <path
                                        d="M0,80 C20,75 40,70 60,65 C80,60 100,62 120,50 C140,38 160,45 180,30 C200,15 220,20 240,10"
                                        fill="none"
                                        stroke="#16a34a"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="drop-shadow-sm"
                                    />
                                    {/* Points */}
                                    <circle cx="0" cy="80" r="3" className="fill-brand-500" />
                                    <circle cx="60" cy="65" r="3" className="fill-brand-500" />
                                    <circle cx="120" cy="50" r="3" className="fill-brand-500" />
                                    <circle cx="180" cy="30" r="3" className="fill-brand-500" />
                                    <circle cx="240" cy="10" r="3" className="fill-brand-500 animate-pulse" />
                                </svg>
                            </div>

                            {/* X Axis Labels */}
                            <div className="flex justify-between mt-2 text-[10px] text-neutral-400 font-mono">
                                <span>Hoje</span>
                                <span>+1d</span>
                                <span>+2d</span>
                                <span>+3d</span>
                                <span>+4d</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/20">
                            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex-shrink-0">
                                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-0.5">
                                    Oportunidade de Alta
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed">
                                    Previsão de chuva no RS vai pressionar preços para cima em 48h.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                            <p className="text-xs text-neutral-500">
                                Lucro projetado:
                            </p>
                            <span className="text-sm font-bold text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-100 dark:border-green-900/30">
                                + R$ 12.400
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Input Area (Mock) */}
            <div className="p-3 bg-white dark:bg-[#1A1A1A] border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                    +
                </div>
                <div className="flex-1 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
                <div className="w-8 h-8 bg-brand-900 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                </div>
            </div>
        </div>
    )
}
