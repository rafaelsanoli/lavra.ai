'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, TrendingUp, Cloud, Bug } from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

// Respostas mockadas inteligentes sobre agro
const mockResponses: Record<string, string> = {
  clima: '🌤️ Segundo dados do INMET, a previsão para sua região indica chuvas moderadas nos próximos 5 dias (40-60mm). Recomendo avaliar a janela de colheita e considerar adiar pulverizações.',
  soja: '📊 A soja está cotada a R$ 153,80/saca em Chicago (+2,3% hoje). O cenário é favorável devido à quebra de safra na Argentina. Considere travar 30% da produção estimada.',
  preco: '💰 Os preços do milho subiram 5,2% na última semana devido à alta demanda de exportação. Momento favorável para comercialização antecipada.',
  pragas: '🐛 Detectamos alertas de ferrugem asiática em 3 fazendas próximas. Recomendo monitoramento preventivo e aplicação de fungicida caso identifique sintomas.',
  mercado: '📈 O mercado de grãos está aquecido: Soja +2.3%, Milho +5.2%, Trigo -1.1%. Dólar a R$ 5,42 favorece exportações.',
  risco: '⚠️ Seu score de risco atual está em 68/100 (Médio). Principais fatores: volatilidade de preços (alta) e risco climático (moderado). Recomendo hedge parcial.',
  hedge: '🛡️ Para proteção, sugiro travas de 40% da safra em contratos futuros + seguro agrícola para 60% da área. Isso equilibra proteção e flexibilidade.',
  default: '🤖 Sou seu assistente de IA especializado em agronegócio. Posso ajudar com: preços de commodities, previsão climática, análise de riscos, alertas de pragas e recomendações de hedge.',
}

const quickQuestions = [
  { icon: Cloud, text: 'Como está o clima?', key: 'clima' },
  { icon: TrendingUp, text: 'Preços hoje', key: 'mercado' },
  { icon: Bug, text: 'Alertas de pragas', key: 'pragas' },
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! 👋 Sou seu assistente IA especializado em agronegócio. Como posso ajudar hoje?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    
    return mockResponses.default
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simula delay de resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getMockResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleQuickQuestion = (key: string) => {
    const question = quickQuestions.find((q) => q.key === key)
    if (!question) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: question.text,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: mockResponses[key] || mockResponses.default,
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-brand-600 to-green-600 rounded-full shadow-xl flex items-center justify-center group"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(4, 120, 87, 0.4)',
                  '0 0 0 20px rgba(4, 120, 87, 0)',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full"
            />
            <MessageCircle className="w-6 h-6 text-white relative z-10" />
            
            {/* Notification badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-green-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Assistente Lavra.ai</h3>
                  <p className="text-white/80 text-xs">Online • Respondendo em ~2s</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/60' : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions (only show initially) */}
            {messages.length === 1 && (
              <div className="p-4 bg-white border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Perguntas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q.key}
                      onClick={() => handleQuickQuestion(q.key)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-sm transition-colors"
                    >
                      <q.icon className="w-4 h-4" />
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 focus:bg-white transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim()}
                  className="w-12 h-12 bg-gradient-to-r from-brand-600 to-green-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
