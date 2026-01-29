import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Usuario {
  id: string
  nome: string
  email: string
  avatar?: string
  cargo: string
  fazendas: string[]
}

interface AuthState {
  usuario: Usuario | null
  autenticado: boolean
  carregando: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  cadastrar: (dados: { nome: string; email: string; senha: string }) => Promise<void>
  register: (data: { nome: string; email: string; senha: string }) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      autenticado: false,
      carregando: false,

      login: async (email: string) => {
        set({ carregando: true })
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Mock user
        set({
          usuario: {
            id: '1',
            nome: 'Rafael Sanoli',
            email,
            avatar: '/avatar-placeholder.png',
            cargo: 'Produtor Rural',
            fazendas: ['Fazenda Santa Maria', 'Fazenda Boa Vista'],
          },
          autenticado: true,
          carregando: false,
        })
      },

      logout: () => {
        set({ usuario: null, autenticado: false })
        // Redirecionar para landing page
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      },

      register: async (data: { nome: string; email: string; senha: string }) => {
        set({ carregando: true })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        set({
          usuario: {
            id: Date.now().toString(),
            nome: data.nome,
            email: data.email,
            cargo: 'Produtor Rural',
            fazendas: [],
          },
          autenticado: true,
          carregando: false,
        })
      },

      cadastrar: async (dados: { nome: string; email: string; senha: string }) => {
        set({ carregando: true })
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        set({
          usuario: {
            id: '1',
            nome: dados.nome,
            email: dados.email,
            cargo: 'Produtor Rural',
            fazendas: [],
          },
          autenticado: true,
          carregando: false,
        })
      },
    }),
    {
      name: 'lavra-auth-storage',
    }
  )
)
