'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { traducoes, Idioma, Traducao } from '@/lib/traducoes'

interface IdiomaContextType {
  idioma: Idioma
  setIdioma: (idioma: Idioma) => void
  t: Traducao
}

const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined)

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>('pt')

  useEffect(() => {
    // Verificar localStorage ou preferência do navegador
    const idiomaArmazenado = localStorage.getItem('lavra-idioma') as Idioma | null
    if (idiomaArmazenado && (idiomaArmazenado === 'pt' || idiomaArmazenado === 'en')) {
      setIdiomaState(idiomaArmazenado)
    } else {
      // Detectar idioma do navegador
      const idiomaNavegador = navigator.language.startsWith('pt') ? 'pt' : 'en'
      setIdiomaState(idiomaNavegador)
    }
  }, [])

  const setIdioma = (novoIdioma: Idioma) => {
    setIdiomaState(novoIdioma)
    localStorage.setItem('lavra-idioma', novoIdioma)
  }

  const t = traducoes[idioma]

  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  )
}

export function useIdioma() {
  const context = useContext(IdiomaContext)
  if (!context) {
    throw new Error('useIdioma deve ser usado dentro de IdiomaProvider')
  }
  return context
}
