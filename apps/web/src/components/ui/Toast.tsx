'use client'

import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastProps {
    message: string
    isVisible: boolean
    onClose: () => void
    duration?: number
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
            <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 shadow-lg rounded-lg p-4 flex items-center gap-3 pr-10 relative">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
