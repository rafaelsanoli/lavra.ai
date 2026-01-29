'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                'fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300',
                'bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800',
                'text-neutral-600 dark:text-neutral-400 hover:text-brand-900 dark:hover:text-brand-400',
                'hover:-translate-y-1 hover:shadow-xl',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            )}
            aria-label="Voltar ao topo"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    )
}
