'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CardMetrica } from '@/components/ui'
import { GraficoLinha } from '@/components/charts'
import { mockClimaData, mockTemperaturaHistorico } from '@/lib/mock-data/clima'
import { CloudRain, Droplets, Wind, Thermometer, AlertTriangle, Cloud } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ClimaPage() {
  const { atual, previsao15Dias, alertasAtivos, indicesAgricolas } = mockClimaData

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Inteligência Climática</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Previsões precisas para suas decisões
          </p>
        </div>

        {/* Condições Atuais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardMetrica
            titulo="Temperatura Atual"
            valor={`${atual.temperatura}°C`}
            descricao={`Sensação: ${atual.sensacao}°C`}
            icone={<Thermometer className="w-5 h-5" />}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Umidade"
            valor={`${atual.umidade}%`}
            icone={<Droplets className="w-5 h-5" />}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Vento"
            valor={`${atual.vento} km/h`}
            icone={<Wind className="w-5 h-5" />}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Condição"
            valor={atual.condicao}
            icone={<Cloud className="w-5 h-5" />}
            tipo="neutro"
          />
        </div>

        {/* Alertas Ativos */}
        {alertasAtivos.length > 0 && (
          <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
                  Alertas Climáticos Ativos
                </h3>
                <div className="space-y-3">
                  {alertasAtivos.map((alerta) => (
                    <div key={alerta.id} className="p-4 rounded-lg bg-white/50 dark:bg-black/20">
                      <h4 className="font-medium text-red-900 dark:text-red-100">{alerta.titulo}</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{alerta.descricao}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-red-600 dark:text-red-400">
                        <span>Início: {format(alerta.dataInicio, "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
                        <span>Fim: {format(alerta.dataFim, "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
                        <span>Regiões: {alerta.regioes.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gráfico de Temperatura */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Temperatura nas Últimas 24h
          </h3>
          <GraficoLinha
            data={mockTemperaturaHistorico}
            linhas={[
              { dataKey: 'temperatura', nome: 'Temperatura', cor: '#17522C' },
              { dataKey: 'sensacao', nome: 'Sensação', cor: '#86EFAC' },
            ]}
            altura={300}
          />
        </div>

        {/* Previsão 15 Dias */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Previsão para os Próximos 15 Dias
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {previsao15Dias.slice(0, 10).map((dia, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {format(dia.data, 'EEE', { locale: ptBR })}
                </p>
                <p className="text-xs text-neutral-500">
                  {format(dia.data, 'dd/MM')}
                </p>
                <p className="text-3xl my-2">{dia.condicao === 'Ensolarado' ? '☀️' : dia.condicao === 'Chuva' ? '🌧️' : '☁️'}</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {Math.round(dia.temperaturaMax)}°
                  </p>
                  <p className="text-xs text-neutral-500">
                    {Math.round(dia.temperaturaMin)}°
                  </p>
                </div>
                {dia.precipitacao > 20 && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <CloudRain className="w-3 h-3" />
                    {Math.round(dia.precipitacao)}mm
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Índices Agrícolas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardMetrica
            titulo="Evapotranspiração"
            valor={`${indicesAgricolas.evapotranspiracao} mm/dia`}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Déficit Hídrico"
            valor={`${indicesAgricolas.deficitHidrico} mm`}
            tipo="negativo"
            variacao="-12%"
          />
          <CardMetrica
            titulo="Próxima Chuva"
            valor={`${indicesAgricolas.diasAteProximaChuva} dias`}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Acumulado Mês"
            valor={`${indicesAgricolas.acumuladoMes} mm`}
            tipo="positivo"
            variacao="+8%"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
