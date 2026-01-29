'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}
    >
      {/* Brilho no topo */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Conteúdo */}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}
