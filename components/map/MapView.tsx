'use client'

import { useEffect, useRef } from 'react'

interface MapViewProps {
  onMapReady?: (map: any) => void
  className?: string
}

export default function MapView({ onMapReady, className }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: any = null

    const initMap = async () => {
      if (!mapRef.current) return

      try {
        // Динамический импорт OpenLayers
        const { Map } = await import('ol')
        const { View } = await import('ol')
        const { fromLonLat } = await import('ol/proj')

        map = new Map({
          target: mapRef.current,
          layers: [], // Пустой массив слоев - слои будут добавлены в MapContainer
          view: new View({
            center: fromLonLat([37.556241, 55.833967]),
            zoom: 16,
            minZoom: 10,
            maxZoom: 22
          })
        })

        onMapReady?.(map)
      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
      }
    }

    initMap()

    return () => {
      if (map) {
        map.setTarget(null)
      }
    }
  }, [onMapReady])

  return (
    <div 
      ref={mapRef} 
      className={className || "h-full w-full"}
    />
  )
} 