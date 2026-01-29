'use client'

import { CardMetrica } from '@/components/ui'
import { GraficoLinha, GraficoPizza } from '@/components/charts'
import { mockDashboardData, mockLucroMensal, mockCulturas } from '@/lib/mock-data/dashboard'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AlertaDecisaoLista, useAlertasDecisao } from '@/components/widgets'
import { TrendingUp, MapPin, Target, Zap, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DashboardPage() {
  const { estatisticas, alertas, atividadesRecentes } = mockDashboardData
  const { alertas: alertasDecisao } = useAlertasDecisao()

  const iconesAlerta: Record<string, JSX.Element> = {
    oportunidade: <CheckCircle className="w-5 h-5" />,
    risco: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const coresAlerta: Record<string, string> = {
    alta: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20',
    média: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20',
    baixa: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20',
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Visão geral da sua operação
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {estatisticas.map((stat, index) => (
            <CardMetrica
              key={index}
              titulo={stat.titulo}
              valor={stat.valor}
              variacao={stat.variacao}
              tipo={stat.tipo as 'positivo' | 'negativo' | 'neutro'}
              icone={
                index === 0 ? <TrendingUp className="w-5 h-5" /> :
                index === 1 ? <MapPin className="w-5 h-5" /> :
                index === 2 ? <Target className="w-5 h-5" /> :
                <Zap className="w-5 h-5" />
              }
            />
          ))}
        </div>

        {/* Alertas de Decisão */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Alertas de Decisão
          </h2>
          <AlertaDecisaoLista alertas={alertasDecisao} maxVisible={2} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolução do Lucro */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Evolução do Lucro
            </h3>
            <GraficoLinha
              data={mockLucroMensal}
              linhas={[
                { dataKey: 'valor', nome: 'Real', cor: '#17522C' },
                { dataKey: 'projetado', nome: 'Projetado', cor: '#86EFAC' },
              ]}
              altura={300}
            />
          </div>

          {/* Distribuição de Culturas */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Distribuição de Culturas
            </h3>
            <GraficoPizza
              data={mockCulturas}
              dataKey="percentual"
              nameKey="nome"
              cores={['#17522C', '#22C55E', '#86EFAC']}
              altura={300}
            />
          </div>
        </div>

        {/* Alertas e Atividades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas Ativos */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Alertas Ativos
            </h3>
            <div className="space-y-3">
              {alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-lg border ${coresAlerta[alerta.severidade]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      ${alerta.tipo === 'oportunidade' ? 'text-green-600 dark:text-green-400' : ''}
                      ${alerta.tipo === 'risco' ? 'text-red-600 dark:text-red-400' : ''}
                      ${alerta.tipo === 'info' ? 'text-blue-600 dark:text-blue-400' : ''}
                    `}>
                      {iconesAlerta[alerta.tipo]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 dark:text-white">
                        {alerta.titulo}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {alerta.descricao}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2">
                        {format(alerta.data, 'dd MMM yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Atividades Recentes
            </h3>
            <div className="space-y-4">
              {atividadesRecentes.map((atividade) => (
                <div key={atividade.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand-500" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {atividade.descricao}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-neutral-500">{atividade.usuario}</p>
                      <span className="text-neutral-300 dark:text-neutral-700">•</span>
                      <p className="text-xs text-neutral-500">
                        {format(atividade.data, "dd MMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
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
