'use client'

import { useEffect, useState, useRef } from 'react'

interface UseCountUpOptions {
    start?: number
    end: number
    duration?: number
    delay?: number
    decimals?: number
    prefix?: string
    suffix?: string
    startOnView?: boolean
}

export function useCountUp(options: UseCountUpOptions) {
    const {
        start = 0,
        end,
        duration = 2000,
        delay = 0,
        decimals = 0,
        prefix = '',
        suffix = '',
        startOnView = true,
    } = options

    const [count, setCount] = useState(start)
    const [hasStarted, setHasStarted] = useState(false)
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!startOnView) {
            setHasStarted(true)
            return
        }

        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [startOnView, hasStarted])

    useEffect(() => {
        if (!hasStarted) return

        const timeout = setTimeout(() => {
            const startTime = performance.now()
            const difference = end - start

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Easing function (ease-out-cubic)
                const easeOut = 1 - Math.pow(1 - progress, 3)
                const currentValue = start + difference * easeOut

                setCount(currentValue)

                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    setCount(end)
                }
            }

            requestAnimationFrame(animate)
        }, delay)

        return () => clearTimeout(timeout)
    }, [hasStarted, start, end, duration, delay])

    const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`

    return { count, formattedCount, ref, hasStarted }
}
