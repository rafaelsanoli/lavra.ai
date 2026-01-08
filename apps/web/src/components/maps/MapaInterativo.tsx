'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, Maximize2, Minimize2, Layers } from 'lucide-react'

// Importação dinâmica do Leaflet (só carrega no client-side)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Polygon = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polygon),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

type Talhao = {
  id: string
  nome: string
  coordenadas: [number, number][]
  scoreRisco: number
  cultura: string
  area: number
  status: 'saudavel' | 'atencao' | 'critico'
}

type MapaInterativoProps = {
  talhoes: Talhao[]
  centro?: [number, number]
  zoom?: number
  altura?: string
  className?: string
}

export function MapaInterativo({
  talhoes,
  centro = [-15.7939, -47.8828], // Brasília como padrão
  zoom = 13,
  altura = '600px',
  className = '',
}: MapaInterativoProps) {
  const [isClient, setIsClient] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'satellite' | 'street'>('satellite')

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getCorPorRisco = (score: number) => {
    if (score >= 80) return '#ef4444' // Crítico - vermelho
    if (score >= 60) return '#f59e0b' // Alto - laranja
    if (score >= 40) return '#eab308' // Médio - amarelo
    if (score >= 20) return '#84cc16' // Baixo - lime
    return '#10b981' // Muito baixo - verde
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'critico':
        return { cor: '#ef4444', label: 'Crítico', bg: 'bg-red-500' }
      case 'atencao':
        return { cor: '#f59e0b', label: 'Atenção', bg: 'bg-amber-500' }
      case 'saudavel':
        return { cor: '#10b981', label: 'Saudável', bg: 'bg-green-500' }
      default:
        return { cor: '#6b7280', label: 'Desconhecido', bg: 'bg-gray-500' }
    }
  }

  if (!isClient) {
    return (
      <div
        className={`relative w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center ${className}`}
        style={{ height: altura }}
      >
        <div className="text-center">
          <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-2 animate-pulse" />
          <p className="text-neutral-600 dark:text-neutral-400">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  const tileLayerUrl =
    viewMode === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${fullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}
    >
      {/* Controles */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Toggle View Mode */}
        <button
          onClick={() => setViewMode(viewMode === 'satellite' ? 'street' : 'satellite')}
          className="p-3 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          title={viewMode === 'satellite' ? 'Ver mapa de ruas' : 'Ver satélite'}
        >
          <Layers className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="p-3 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          title={fullscreen ? 'Sair de tela cheia' : 'Tela cheia'}
        >
          {fullscreen ? (
            <Minimize2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          ) : (
            <Maximize2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          )}
        </button>
      </div>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Nível de Risco
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Baixo (0-40)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Médio (40-60)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Alto (60-80)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Crítico (80-100)
            </span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div
        className="w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
        style={{ height: fullscreen ? '100vh' : altura }}
      >
        <MapContainer
          center={centro}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url={tileLayerUrl}
            attribution={
              viewMode === 'satellite'
                ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA'
                : '&copy; OpenStreetMap contributors'
            }
          />

          {/* Talhões */}
          {talhoes.map((talhao) => {
            const statusInfo = getStatusInfo(talhao.status)
            const cor = getCorPorRisco(talhao.scoreRisco)

            return (
              <Polygon
                key={talhao.id}
                positions={talhao.coordenadas}
                pathOptions={{
                  color: cor,
                  fillColor: cor,
                  fillOpacity: 0.4,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-base mb-2">{talhao.nome}</h3>
                    
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Cultura:</span>
                        <span className="font-medium">{talhao.cultura}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Área:</span>
                        <span className="font-medium">{talhao.area} ha</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Status:</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-neutral-600">Score Risco:</span>
                        <span className="font-bold text-lg" style={{ color: cor }}>
                          {talhao.scoreRisco}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            )
          })}
        </MapContainer>
      </div>
    </motion.div>
  )
}
