'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Tema = 'light' | 'dark'

interface TemaContextType {
  tema: Tema
  setTema: (tema: Tema) => void
  alternarTema: () => void
}

const TemaContext = createContext<TemaContextType | undefined>(undefined)

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTemaState] = useState<Tema>('light')

  useEffect(() => {
    // Verificar localStorage ou preferência do sistema
    const temaArmazenado = localStorage.getItem('lavra-tema') as Tema | null
    if (temaArmazenado) {
      setTemaState(temaArmazenado)
      document.documentElement.classList.toggle('dark', temaArmazenado === 'dark')
    } else {
      // Detectar preferência do sistema
      const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTemaState(prefereDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', prefereDark)
    }
  }, [])

  const setTema = (novoTema: Tema) => {
    setTemaState(novoTema)
    localStorage.setItem('lavra-tema', novoTema)
    document.documentElement.classList.toggle('dark', novoTema === 'dark')
  }

  const alternarTema = () => {
    setTema(tema === 'light' ? 'dark' : 'light')
  }

  return (
    <TemaContext.Provider value={{ tema, setTema, alternarTema }}>
      {children}
    </TemaContext.Provider>
  )
}

export function useTema() {
  const context = useContext(TemaContext)
  if (!context) {
    throw new Error('useTema deve ser usado dentro de TemaProvider')
  }
  return context
}
