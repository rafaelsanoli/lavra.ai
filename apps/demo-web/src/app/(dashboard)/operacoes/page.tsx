'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CardMetrica, Botao } from '@/components/ui'
import { GraficoBarra } from '@/components/charts'
import { ScoreRisco, criarFatoresRisco } from '@/components/risk'
import { MapaInterativo } from '@/components/maps'
import { mockOperacoesData, mockProdutividadeMensal, mockTalhoesMap } from '@/lib/mock-data/operacoes'
import { MapPin, Sprout, Users, Package, Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function OperacoesPage() {
  const { fazendas, talhoes, atividades, insumos, equipe } = mockOperacoesData

  const statusIcons = {
    concluida: <CheckCircle className="w-4 h-4 text-green-600" />,
    pendente: <Clock className="w-4 h-4 text-yellow-600" />,
    agendada: <Calendar className="w-4 h-4 text-blue-600" />,
  }

  const statusColors = {
    concluida: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300',
    pendente: 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300',
    agendada: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
  }

  const totalArea = fazendas.reduce((acc, f) => acc + f.area, 0)
  const totalTalhoes = fazendas.reduce((acc, f) => acc + f.talhoesTotal, 0)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Operações</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Gerencie fazendas, talhões e atividades
            </p>
          </div>
          <Botao variante="primario" tamanho="md">
            <Plus className="w-4 h-4" />
            Nova Fazenda
          </Botao>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardMetrica
            titulo="Área Total"
            valor={`${totalArea.toLocaleString()} ha`}
            icone={<MapPin className="w-5 h-5" />}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Talhões"
            valor={totalTalhoes}
            icone={<Sprout className="w-5 h-5" />}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Colaboradores"
            valor={equipe.length}
            icone={<Users className="w-5 h-5" />}
            tipo="neutro"
          />
          <CardMetrica
            titulo="Insumos Ativos"
            valor={insumos.length}
            icone={<Package className="w-5 h-5" />}
            tipo="neutro"
          />
        </div>

        {/* Score de Risco */}
        <ScoreRisco
          score={68}
          fatores={criarFatoresRisco({
            clima: 45,
            mercado: 72,
            pragas: 38,
            hidrico: 55,
          })}
        />

        {/* Mapa Interativo dos Talhões */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Mapa de Talhões</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Visualização geoespacial com níveis de risco por área
              </p>
            </div>
          </div>

          <MapaInterativo
            talhoes={mockTalhoesMap}
            centro={[-12.9075, -55.7055]}
            zoom={14}
            altura="500px"
          />
        </div>

        {/* Fazendas */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Minhas Fazendas</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {fazendas.map((fazenda) => (
              <div
                key={fazenda.id}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white">{fazenda.nome}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {fazenda.localizacao}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    {fazenda.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div>
                    <p className="text-xs text-neutral-500">Área</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{fazenda.area} ha</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Talhões</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{fazenda.talhoesProdutivos}/{fazenda.talhoesTotal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Cultura</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{fazenda.culturaAtual}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talhões e Produtividade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Talhões */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Talhões Ativos</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {talhoes.map((talhao) => (
                <div
                  key={talhao.id}
                  className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-white">{talhao.nome}</h4>
                      <p className="text-xs text-neutral-500">{talhao.fazenda}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                      {talhao.estagio}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-neutral-500">Área:</span>
                      <span className="ml-1 font-medium text-neutral-900 dark:text-white">{talhao.area}ha</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Cultura:</span>
                      <span className="ml-1 font-medium text-neutral-900 dark:text-white">{talhao.cultura}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Produt:</span>
                      <span className="ml-1 font-medium text-neutral-900 dark:text-white">{talhao.produtividadeEsperada}sc</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Produtividade */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Produtividade Média (sc/ha)
            </h3>
            <GraficoBarra
              data={mockProdutividadeMensal}
              barras={[
                { dataKey: 'soja', nome: 'Soja', cor: '#17522C' },
                { dataKey: 'milho', nome: 'Milho', cor: '#FCD34D' },
              ]}
              altura={280}
            />
          </div>
        </div>

        {/* Atividades e Insumos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atividades */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Atividades</h3>
              <Botao variante="secundario" tamanho="sm">
                <Plus className="w-4 h-4" />
                Nova
              </Botao>
            </div>
            <div className="space-y-3">
              {atividades.map((atividade) => (
                <div
                  key={atividade.id}
                  className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      {statusIcons[atividade.status as keyof typeof statusIcons]}
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-white">{atividade.tipo}</h4>
                        <p className="text-xs text-neutral-500">{atividade.talhao}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[atividade.status as keyof typeof statusColors]}`}>
                      {atividade.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
                    <span>{atividade.responsavel}</span>
                    <span>{format(atividade.data, 'dd/MM/yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insumos */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Estoque de Insumos</h3>
            </div>
            <div className="space-y-3">
              {insumos.map((insumo) => {
                const percentualEstoque = (insumo.estoque / insumo.quantidade) * 100
                const baixoEstoque = insumo.estoque < insumo.estoqueMinimo
                
                return (
                  <div
                    key={insumo.id}
                    className={`p-3 rounded-lg border ${
                      baixoEstoque
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'
                        : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-white">{insumo.nome}</h4>
                        <p className="text-xs text-neutral-500 mt-1">
                          R$ {insumo.valorUnitario.toFixed(2)}/{insumo.unidade}
                        </p>
                      </div>
                      {baixoEstoque && (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-neutral-500">Estoque</span>
                        <span className={`font-medium ${baixoEstoque ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>
                          {insumo.estoque} / {insumo.quantidade} {insumo.unidade}
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${baixoEstoque ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${percentualEstoque}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Equipe */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Equipe</h3>
            <Botao variante="secundario" tamanho="sm">
              <Plus className="w-4 h-4" />
              Adicionar
            </Botao>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipe.map((membro) => (
              <div
                key={membro.id}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-white text-sm">{membro.nome}</h4>
                    <p className="text-xs text-neutral-500">{membro.cargo}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{membro.contato}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
