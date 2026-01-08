'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CardMetrica, Botao } from '@/components/ui'
import { mockAlertasData } from '@/lib/mock-data/alertas'
import { Bell, BellOff, Filter, Settings, AlertTriangle, Info, AlertCircle, Check, X, Clock } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

export default function AlertasPage() {
  const { alertas, estatisticas, configuracoes } = mockAlertasData
  const [filtro, setFiltro] = useState<'todos' | 'naoLidos' | 'critico' | 'atencao' | 'informativo'>('todos')

  const tipoIcons = {
    critico: <AlertCircle className="w-5 h-5" />,
    atencao: <AlertTriangle className="w-5 h-5" />,
    informativo: <Info className="w-5 h-5" />,
  }

  const tipoColors = {
    critico: {
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    },
    atencao: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    },
    informativo: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    },
  }

  const alertasFiltrados = alertas.filter((alerta) => {
    if (filtro === 'todos') return true
    if (filtro === 'naoLidos') return !alerta.lido
    return alerta.tipo === filtro
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Central de Alertas</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Monitore notificações e configure alertas inteligentes
            </p>
          </div>
          <Botao variante="secundario" tamanho="md">
            <Settings className="w-4 h-4" />
            Configurações
          </Botao>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <CardMetrica
            titulo="Total"
            valor={estatisticas.total}
            icone={<Bell className="w-5 h-5" />}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Não Lidos"
            valor={estatisticas.naoLidos}
            icone={<BellOff className="w-5 h-5" />}
            tipo="negativo"
          />
          <CardMetrica
            titulo="Críticos"
            valor={estatisticas.criticos}
            icone={<AlertCircle className="w-5 h-5" />}
            tipo="negativo"
          />
          <CardMetrica
            titulo="Atenção"
            valor={estatisticas.atencao}
            icone={<AlertTriangle className="w-5 h-5" />}
            tipo="negativo"
          />
          <CardMetrica
            titulo="Informativos"
            valor={estatisticas.informativos}
            icone={<Info className="w-5 h-5" />}
            tipo="positivo"
          />
        </div>

        {/* Filtros */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filtrar:</span>
            <div className="flex gap-2">
              {['todos', 'naoLidos', 'critico', 'atencao', 'informativo'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f as typeof filtro)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filtro === f
                      ? 'bg-brand-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {f === 'todos' && 'Todos'}
                  {f === 'naoLidos' && 'Não Lidos'}
                  {f === 'critico' && 'Crítico'}
                  {f === 'atencao' && 'Atenção'}
                  {f === 'informativo' && 'Informativo'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Alertas */}
        <div className="space-y-3">
          {alertasFiltrados.map((alerta) => {
            const colors = tipoColors[alerta.tipo as keyof typeof tipoColors]
            return (
              <div
                key={alerta.id}
                className={`p-4 rounded-xl border ${colors.border} ${alerta.lido ? 'bg-white dark:bg-[#1A1A1A]' : colors.bg}`}
              >
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div className={`p-2 rounded-lg ${colors.badge}`}>
                    <div className={colors.icon}>
                      {tipoIcons[alerta.tipo as keyof typeof tipoIcons]}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-neutral-900 dark:text-white">{alerta.titulo}</h4>
                          {!alerta.lido && (
                            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                          )}
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                            {alerta.categoria}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{alerta.descricao}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                          <Check className="w-4 h-4 text-neutral-500" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                          <X className="w-4 h-4 text-neutral-500" />
                        </button>
                      </div>
                    </div>

                    {/* Metadados */}
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(alerta.dataHora, { addSuffix: true, locale: ptBR })}
                      </span>
                      {alerta.fazenda && <span>• {alerta.fazenda}</span>}
                      {alerta.talhoes.length > 0 && (
                        <span>• {alerta.talhoes.join(', ')}</span>
                      )}
                    </div>

                    {/* Ações */}
                    {alerta.acoes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {alerta.acoes.map((acao, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          >
                            {acao}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Alertas por Categoria */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Alertas por Categoria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estatisticas.porCategoria.map((cat) => (
              <div
                key={cat.categoria}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-neutral-900 dark:text-white">{cat.categoria}</h4>
                  {cat.criticos > 0 && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      {cat.criticos} crítico{cat.criticos > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{cat.total}</p>
                <p className="text-xs text-neutral-500 mt-1">alertas ativos</p>
              </div>
            ))}
          </div>
        </div>

        {/* Configurações de Notificação */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categorias */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Categorias de Alertas
            </h3>
            <div className="space-y-3">
              {configuracoes.categorias.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={cat.ativo}
                      className="w-4 h-4 text-brand-600 rounded"
                      readOnly
                    />
                    <span className="font-medium text-neutral-900 dark:text-white">{cat.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className={`w-4 h-4 ${cat.notificar ? 'text-brand-600' : 'text-neutral-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Níveis */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Níveis de Notificação
            </h3>
            <div className="space-y-3">
              {configuracoes.niveis.map((nivel) => (
                <div
                  key={nivel.id}
                  className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={nivel.ativo}
                        className="w-4 h-4 text-brand-600 rounded"
                        readOnly
                      />
                      <span className="font-medium text-neutral-900 dark:text-white">{nivel.nome}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 ml-7 text-xs">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={nivel.email} className="w-3 h-3" readOnly />
                      <span className="text-neutral-600 dark:text-neutral-400">E-mail</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={nivel.push} className="w-3 h-3" readOnly />
                      <span className="text-neutral-600 dark:text-neutral-400">Push</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
