'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/useAuthStore'
import { AnimatedGradient, GlassCard, Logo } from '@/components/ui'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)

    await login(email, senha)

    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
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
            {/* Logo animado */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <Logo />
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-white/60">
                Acesse sua conta e maximize seus resultados
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedInput === 'email' ? 'text-brand-400' : 'text-white/40'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                      focusedInput === 'email'
                        ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Senha */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedInput === 'senha' ? 'text-brand-400' : 'text-white/40'
                  }`} />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onFocus={() => setFocusedInput('senha')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                      focusedInput === 'senha'
                        ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>

              {/* Esqueci senha */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end"
              >
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-white/60 hover:text-brand-400 transition-colors"
                >
                  Esqueceu sua senha?
                </Link>
              </motion.div>

              {/* Botão */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={carregando}
                className="relative w-full py-4 bg-gradient-to-r from-brand-600 to-green-600 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                <span className="relative flex items-center justify-center gap-2">
                  {carregando ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative my-8"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-white/40 bg-transparent">ou continue com</span>
              </div>
            </motion.div>

            {/* Social Login */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 gap-4"
            >
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:border-white/20 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:border-white/20 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </motion.div>

            {/* Cadastro */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-sm text-white/60 mt-8"
            >
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Criar conta grátis
              </Link>
            </motion.p>

            {/* Demo notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-6 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/70">
                  <span className="font-semibold text-brand-400">Demo Mode:</span> Use qualquer email e senha para acessar a plataforma mockada.
                </p>
              </div>
            </motion.div>
          </GlassCard>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-sm text-white/40 mt-8"
          >
            © 2026 Lavra.ia · O Bloomberg do Agro Brasileiro
          </motion.p>
        </motion.div>
      </div>
    </AnimatedGradient>
  )
}
