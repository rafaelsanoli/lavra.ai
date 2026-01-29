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
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-600 to-green-600 rounded-full shadow-xl flex items-center justify-center group"
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
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" />
            
            {/* Notification badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
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
            className="fixed inset-x-4 bottom-4 md:bottom-6 md:right-6 md:left-auto z-50 w-[calc(100%-2rem)] md:w-96 h-[calc(100vh-2rem)] md:h-[600px] max-h-[700px] bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-green-600 p-3 md:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-white"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-sm md:text-base truncate">Assistente Lavra.ia</h3>
                  <p className="text-white/80 text-xs">Online • Respondendo em ~2s</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50 dark:bg-[#0F0F0F]">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                      message.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-white rounded-bl-md shadow-sm border border-gray-100 dark:border-neutral-700'
                    }`}
                  >
                    <p className="text-xs md:text-sm whitespace-pre-line break-words">{message.text}</p>
                    <p
                      className={`text-[10px] md:text-xs mt-1 ${
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
                  <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-bl-md px-3 py-2 md:px-4 md:py-3 shadow-sm border border-gray-100 dark:border-neutral-700">
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
                          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"
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
              <div className="p-3 md:p-4 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-neutral-800 flex-shrink-0">
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-2">Perguntas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q.key}
                      onClick={() => handleQuickQuestion(q.key)}
                      className="flex items-center gap-1 px-2 py-1.5 md:px-3 md:py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg text-xs md:text-sm transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <q.icon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 md:p-4 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-neutral-800 flex-shrink-0">
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
                  className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-xs md:text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:bg-white dark:focus:bg-neutral-800 transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-brand-600 to-green-600 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
