'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/useAuthStore'
import { AnimatedGradient, GlassCard, Logo } from '@/components/ui'
import { Mail, Lock, User, Briefcase, MapPin, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const register = useAuthStore((state) => state.register)
  const [step, setStep] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    nome: '',
    email: '',
    fazenda: '',
    cidade: '',
    senha: '',
    confirmarSenha: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (form.senha !== form.confirmarSenha) {
      alert('As senhas não coincidem')
      return
    }

    setCarregando(true)
    
    await register({
      nome: form.nome,
      email: form.email,
      senha: form.senha,
    })

    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  const nextStep = () => {
    if (step === 1 && (!form.nome || !form.email)) {
      alert('Preencha todos os campos')
      return
    }
    if (step === 2 && (!form.fazenda || !form.cidade)) {
      alert('Preencha todos os campos')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

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
              className="flex justify-center mb-6"
            >
              <Logo />
            </motion.div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">Passo {step} de 3</span>
                <span className="text-xs text-white/60">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-600 to-green-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Header */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                {step === 1 && 'Crie sua conta'}
                {step === 2 && 'Sua fazenda'}
                {step === 3 && 'Defina sua senha'}
              </h1>
              <p className="text-white/60">
                {step === 1 && 'Comece gratuitamente hoje mesmo'}
                {step === 2 && 'Conte-nos sobre sua operação'}
                {step === 3 && 'Proteja sua conta'}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1 - Dados Pessoais */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="relative group">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedInput === 'nome' ? 'text-brand-400' : 'text-white/40'
                      }`} />
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        onFocus={() => setFocusedInput('nome')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                          focusedInput === 'nome'
                            ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        placeholder="Nome completo"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedInput === 'email' ? 'text-brand-400' : 'text-white/40'
                      }`} />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
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

                    <motion.button
                      type="button"
                      onClick={nextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative w-full py-4 bg-gradient-to-r from-brand-600 to-green-600 rounded-xl font-semibold text-white overflow-hidden group"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        Próximo
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2 - Fazenda */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="relative group">
                      <Briefcase className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedInput === 'fazenda' ? 'text-brand-400' : 'text-white/40'
                      }`} />
                      <input
                        type="text"
                        value={form.fazenda}
                        onChange={(e) => setForm({ ...form, fazenda: e.target.value })}
                        onFocus={() => setFocusedInput('fazenda')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                          focusedInput === 'fazenda'
                            ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        placeholder="Nome da fazenda"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedInput === 'cidade' ? 'text-brand-400' : 'text-white/40'
                      }`} />
                      <input
                        type="text"
                        value={form.cidade}
                        onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                        onFocus={() => setFocusedInput('cidade')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                          focusedInput === 'cidade'
                            ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        placeholder="Cidade - Estado"
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ArrowLeft className="w-5 h-5" />
                          Voltar
                        </span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-[2] relative py-4 bg-gradient-to-r from-brand-600 to-green-600 rounded-xl font-semibold text-white overflow-hidden group"
                      >
                        <span className="relative flex items-center justify-center gap-2">
                          Próximo
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 - Senha */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="relative group">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedInput === 'senha' ? 'text-brand-400' : 'text-white/40'
                      }`} />
                      <input
                        type="password"
                        value={form.senha}
                        onChange={(e) => setForm({ ...form, senha: e.target.value })}
                        onFocus={() => setFocusedInput('senha')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                          focusedInput === 'senha'
                            ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        placeholder="Senha (mínimo 6 caracteres)"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="relative group">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedInput === 'confirmarSenha' ? 'text-brand-400' : 'text-white/40'
                      }`} />
                      <input
                        type="password"
                        value={form.confirmarSenha}
                        onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
                        onFocus={() => setFocusedInput('confirmarSenha')}
                        onBlur={() => setFocusedInput(null)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 transition-all duration-300 ${
                          focusedInput === 'confirmarSenha'
                            ? 'border-brand-400 bg-white/10 shadow-lg shadow-brand-500/20'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        placeholder="Confirme sua senha"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-white/60">
                        Ao criar uma conta, você concorda com nossos Termos e Política de Privacidade
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ArrowLeft className="w-5 h-5" />
                          Voltar
                        </span>
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={carregando}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-[2] relative py-4 bg-gradient-to-r from-brand-600 to-green-600 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50"
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
                              Criando...
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5" />
                              Criar Conta
                            </>
                          )}
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Login */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-white/60 mt-8"
            >
              Já tem uma conta?{' '}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Fazer login
              </Link>
            </motion.p>

            {/* Demo notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/70">
                  <span className="font-semibold text-brand-400">Demo Mode:</span> Use qualquer informação para criar uma conta mockada.
                </p>
              </div>
            </motion.div>
          </GlassCard>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-white/40 mt-8"
          >
            © 2026 Lavra.ai · O Bloomberg do Agro Brasileiro
          </motion.p>
        </motion.div>
      </div>
    </AnimatedGradient>
  )
}
