'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AnimatedGradient, GlassCard, Logo } from '@/components/ui'
import { Mail, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [focusedInput, setFocusedInput] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)

    // Simula envio de email
    setTimeout(() => {
      setCarregando(false)
      setEnviado(true)
    }, 1500)
  }

  return (
    <AnimatedGradient>
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8">
            {/* Logo */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <Logo />
            </motion.div>

            {!enviado ? (
              <>
                {/* Header */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Recuperar senha
                  </h1>
                  <p className="text-white/60">
                    Digite seu email e enviaremos um link para redefinir sua senha
                  </p>
                </motion.div>

                {/* Ilustração SVG */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center mb-8"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Envelope base */}
                        <rect
                          x="20"
                          y="40"
                          width="80"
                          height="50"
                          rx="4"
                          fill="url(#gradient1)"
                          stroke="white"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        {/* Envelope flap */}
                        <path
                          d="M20 40 L60 65 L100 40"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.8"
                        />
                        {/* Lock icon */}
                        <motion.g
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <rect
                            x="50"
                            y="60"
                            width="20"
                            height="15"
                            rx="2"
                            fill="#10b981"
                          />
                          <path
                            d="M54 60 V54 C54 50 56 48 60 48 C64 48 66 50 66 54 V60"
                            stroke="#10b981"
                            strokeWidth="2"
                            fill="none"
                          />
                        </motion.g>
                        <defs>
                          <linearGradient
                            id="gradient1"
                            x1="20"
                            y1="40"
                            x2="100"
                            y2="90"
                          >
                            <stop offset="0%" stopColor="#047857" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                    
                    {/* Particles ao redor */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-brand-400 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                        }}
                        animate={{
                          x: [0, Math.cos((i * Math.PI) / 3) * 40],
                          y: [0, Math.sin((i * Math.PI) / 3) * 40],
                          opacity: [1, 0],
                          scale: [1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="relative group">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedInput ? 'text-brand-400' : 'text-white/40'
                      }`} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput(true)}
                        onBlur={() => setFocusedInput(false)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                          focusedInput
                            ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={carregando}
                    className="relative w-full py-4 bg-gradient-to-r from-brand-600 to-green-600 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      {carregando ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar link de recuperação
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Voltar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6"
                >
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-brand-400 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para login
                  </Link>
                </motion.div>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Check icon animado */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                  }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(16, 185, 129, 0.4)",
                          "0 0 0 20px rgba(16, 185, 129, 0)",
                        ]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    >
                      <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-3"
                >
                  Email enviado!
                </motion.h1>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60 mb-8"
                >
                  Enviamos um link de recuperação para <br />
                  <span className="text-brand-400 font-medium">{email}</span>
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-white/50">
                    Não recebeu o email? Verifique sua caixa de spam ou
                  </p>
                  
                  <button
                    onClick={() => setEnviado(false)}
                    className="text-brand-400 hover:text-brand-300 font-medium text-sm transition-colors"
                  >
                    Tentar novamente
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-brand-400 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para login
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {/* Demo notice */}
            {!enviado && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-white/70">
                    <span className="font-semibold text-brand-400">Demo Mode:</span> Qualquer email será aceito para demonstração.
                  </p>
                </div>
              </motion.div>
            )}
          </GlassCard>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center text-sm text-white/40 mt-8"
          >
            © 2026 Lavra.ai · O Bloomberg do Agro Brasileiro
          </motion.p>
        </motion.div>
      </div>
    </AnimatedGradient>
  )
}
