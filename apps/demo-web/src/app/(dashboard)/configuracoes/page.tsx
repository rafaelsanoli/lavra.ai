'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Botao } from '@/components/ui'
import { useAuthStore } from '@/stores/useAuthStore'
import { User, Bell, Shield, CreditCard, Settings, Save } from 'lucide-react'
import { useState } from 'react'

export default function ConfiguracoesPage() {
  const usuario = useAuthStore((state) => state.usuario)
  const [abaAtiva, setAbaAtiva] = useState<'perfil' | 'notificacoes' | 'seguranca' | 'assinatura' | 'integracao'>('perfil')

  const abas = [
    { id: 'perfil', nome: 'Perfil', icone: <User className="w-4 h-4" /> },
    { id: 'notificacoes', nome: 'Notificações', icone: <Bell className="w-4 h-4" /> },
    { id: 'seguranca', nome: 'Segurança', icone: <Shield className="w-4 h-4" /> },
    { id: 'assinatura', nome: 'Assinatura', icone: <CreditCard className="w-4 h-4" /> },
    { id: 'integracao', nome: 'Integrações', icone: <Settings className="w-4 h-4" /> },
  ]

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">Configurações</h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-1">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        {/* Navegação por Abas */}
        <div className="-mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto">
          <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 min-w-max">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id as typeof abaAtiva)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-sm md:text-base ${
                  abaAtiva === aba.id
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {aba.icone}
                {aba.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="max-w-4xl">
          {/* Perfil */}
          {abaAtiva === 'perfil' && (
            <div className="space-y-6">
              <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Informações Pessoais
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        defaultValue={usuario?.nome}
                        className="w-full px-3 md:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        defaultValue={usuario?.email}
                        className="w-full px-3 md:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className="w-full px-3 md:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Conte um pouco sobre você..."
                      className="w-full px-3 md:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Botao variante="primario" tamanho="md">
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </Botao>
                </div>
              </div>

              <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Localização
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Estado
                      </label>
                      <select className="w-full px-3 md:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm md:text-base">
                        <option>Paraná</option>
                        <option>São Paulo</option>
                        <option>Rio Grande do Sul</option>
                        <option>Mato Grosso</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        placeholder="Sua cidade"
                        className="w-full px-3 md:px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notificações */}
          {abaAtiva === 'notificacoes' && (
            <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Preferências de Notificação
              </h3>
              <div className="space-y-4">
                {[
                  { titulo: 'Alertas de Clima', descricao: 'Receba notificações sobre condições climáticas adversas' },
                  { titulo: 'Alertas de Mercado', descricao: 'Notificações sobre variações significativas de preços' },
                  { titulo: 'Pragas e Doenças', descricao: 'Alertas sobre detecção de pragas nas lavouras' },
                  { titulo: 'Atividades', descricao: 'Lembretes sobre atividades agendadas' },
                  { titulo: 'Relatórios Semanais', descricao: 'Resumo semanal das operações' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 dark:text-white">{item.titulo}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{item.descricao}</p>
                    </div>
                    <div className="flex gap-4 ml-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">E-mail</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">Push</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Segurança */}
          {abaAtiva === 'seguranca' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Alterar Senha
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Botao variante="primario" tamanho="md">
                    Atualizar Senha
                  </Botao>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Autenticação de Dois Fatores
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Adicione uma camada extra de segurança à sua conta
                </p>
                <Botao variante="secundario" tamanho="md">
                  Ativar 2FA
                </Botao>
              </div>
            </div>
          )}

          {/* Assinatura */}
          {abaAtiva === 'assinatura' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Plano Professional</h3>
                    <p className="text-brand-100">Acesso completo a todas as funcionalidades</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                    Ativo
                  </span>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ 499</span>
                  <span className="text-brand-100">/mês</span>
                </div>
                <p className="text-sm text-brand-100 mt-2">Renovação automática em 15 de julho de 2024</p>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Recursos Incluídos
                </h3>
                <ul className="space-y-3">
                  {[
                    'Monitoramento climático em tempo real',
                    'Análises de mercado com IA',
                    'Gestão de operações ilimitada',
                    'Alertas inteligentes personalizados',
                    'Simulador de cenários avançado',
                    'Integrações com equipamentos agrícolas',
                    'Suporte prioritário 24/7',
                  ].map((recurso, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300">{recurso}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Botao variante="secundario" tamanho="md">
                  Gerenciar Assinatura
                </Botao>
                <Botao variante="outline" tamanho="md">
                  Ver Outros Planos
                </Botao>
              </div>
            </div>
          )}

          {/* Integrações */}
          {abaAtiva === 'integracao' && (
            <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Integrações Disponíveis
              </h3>
              <div className="space-y-4">
                {[
                  { nome: 'John Deere Operations Center', status: 'conectado', descricao: 'Sincronize dados de máquinas e operações' },
                  { nome: 'Climate FieldView', status: 'disponivel', descricao: 'Integração com mapas e análises de campo' },
                  { nome: 'AgLeader SMS', status: 'disponivel', descricao: 'Gestão de dados de fazenda e mapas' },
                  { nome: 'Trimble Ag Software', status: 'disponivel', descricao: 'Precisão e gestão agrícola' },
                ].map((integracao, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-white">{integracao.nome}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{integracao.descricao}</p>
                    </div>
                    {integracao.status === 'conectado' ? (
                      <Botao variante="outline" tamanho="sm">
                        Desconectar
                      </Botao>
                    ) : (
                      <Botao variante="primario" tamanho="sm">
                        Conectar
                      </Botao>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
