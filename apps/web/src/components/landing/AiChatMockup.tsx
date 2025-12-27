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
                    <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm">
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 mb-3">
                            Analisei seu cenário. <strong>Não recomendo vender hoje.</strong>
                        </p>

                        {/* Data Card */}
                        <div className="bg-neutral-50 dark:bg-[#141414] rounded-lg p-3 mb-3 border border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-neutral-500">Tendência (5 dias)</span>
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Alta Forte
                                </span>
                            </div>
                            <div className="h-16 flex items-end gap-1 justify-between px-1">
                                {[40, 45, 42, 55, 68, 85].map((h, i) => (
                                    <div key={i} className="w-full bg-brand-200 dark:bg-brand-900/30 rounded-t relative group">
                                        <div
                                            className="absolute bottom-0 w-full bg-brand-500 rounded-t transition-all duration-1000"
                                            style={{ height: `${h}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded border border-yellow-100 dark:border-yellow-900/20">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                Previsão de chuva no RS vai pressionar preços para cima em 48h.
                            </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <p className="text-xs text-neutral-500">
                                Lucro projetado se esperar: <span className="text-green-600 font-bold">+ R$ 12.400</span>
                            </p>
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
