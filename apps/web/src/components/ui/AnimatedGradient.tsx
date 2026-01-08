'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedGradientProps {
  children: ReactNode
  className?: string
}

export function AnimatedGradient({ children, className = '' }: AnimatedGradientProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Gradient animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-brand-950 to-black"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Orbs flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
