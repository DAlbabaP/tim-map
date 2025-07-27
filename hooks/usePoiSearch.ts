import { useMemo } from 'react'
import { useMapStore } from '@/stores/mapStore'

interface PoiItem {
  id: string
  layerName: string
  name: string
  type: string
  geometry: any
  feature: any
}

// Утилитарная функция для вычисления расстояния между двумя точками
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const dx = coord1[0] - coord2[0]
  const dy = coord1[1] - coord2[1]
  return Math.sqrt(dx * dx + dy * dy)
}

// Утилитарная функция для получения центра геометрии
function getGeometryCenter(geometry: any): [number, number] {
  if (!geometry) return [0, 0]
  
  try {
    const extent = geometry.getExtent()
    const centerX = (extent[0] + extent[2]) / 2
    const centerY = (extent[1] + extent[3]) / 2
    return [centerX, centerY]
  } catch (error) {
    console.error('Ошибка вычисления центра геометрии:', error)
    return [0, 0]
  }
}

// Слои, которые считаются зданиями
const BUILDING_LAYER_KEYWORDS = ['building', 'buildings']

// Слои POI (точки интереса)
const POI_LAYERS = [
  'atm',
  'cafe', 
  'deanery',
  'departments',
  'lab',
  'museum',
  'metro_stations',
  'tram_stops',
  'bus_stops'
]

export function usePoiSearch() {
  const mapInstance = useMapStore(state => state.mapInstance)

  const findNearbyPois = useMemo(() => {
    return (buildingFeature: any): PoiItem[] => {
      console.log('🔍 usePoiSearch - mapInstance:', !!mapInstance, 'buildingFeature:', !!buildingFeature)
      
      if (!mapInstance) {
        console.log('❌ mapInstance отсутствует в store')
        return []
      }
      
      if (!buildingFeature) {
        console.log('❌ buildingFeature не передан')
        return []
      }

      const buildingGeometry = buildingFeature.getGeometry()
      if (!buildingGeometry) {
        console.log('❌ У здания нет геометрии')
        return []
      }

      console.log('🏢 Ищем POI внутри геометрии здания')
      const nearbyPois: PoiItem[] = []
      
      // Сначала покажем все доступные слои на карте
      const allLayers: string[] = []
      mapInstance.getLayers().forEach((layer: any) => {
        const layerName = layer.get('name') || 'unnamed'
        allLayers.push(layerName)
      })
      console.log('🗺️ Все слои на карте:', allLayers)
      console.log('🎯 Ищем среди POI слоев:', POI_LAYERS)
      
      // Проходим по всем слоям карты
      mapInstance.getLayers().forEach((layer: any) => {
        if (!layer.getSource || typeof layer.getSource !== 'function') return

        const layerName = layer.get('name') || ''
        
        // Пропускаем слои зданий
        if (BUILDING_LAYER_KEYWORDS.some(keyword => layerName.includes(keyword))) {
          return
        }

        // Проверяем только POI слои
        if (!POI_LAYERS.includes(layerName)) {
          console.log(`⏭️ Пропускаем слой ${layerName} (не POI)`)
          return
        }

        console.log(`🔍 Проверяем POI слой: ${layerName}`)

        const source = layer.getSource()
        if (!source || !source.getFeatures) return

        const features = source.getFeatures()
        console.log(`  📊 В слое ${layerName} найдено ${features.length} объектов`)
        
        features.forEach((feature: any) => {
          const geometry = feature.getGeometry()
          if (!geometry) return

          // Проверяем, находится ли POI внутри геометрии здания
          try {
            const coordinates = geometry.getCoordinates()
            let isInside = false

            // Проверяем пересечение координат POI с геометрией здания (как в старой версии)
            if (buildingGeometry.intersectsCoordinate && coordinates) {
              isInside = buildingGeometry.intersectsCoordinate(coordinates)
              console.log(`  🎯 Проверяем координаты ${coordinates} внутри здания: ${isInside}`)
            } else {
              // Fallback: проверяем пересечение геометрий
              if (buildingGeometry.intersectsExtent && geometry.getExtent) {
                const poiExtent = geometry.getExtent()
                isInside = buildingGeometry.intersectsExtent(poiExtent)
                console.log(`  🎯 Проверяем extent пересечение: ${isInside}`)
              }
            }

            if (isInside) {
              const properties = feature.getProperties()
              const id = feature.getId() || feature.get('id') || `${layerName}_${Math.random()}`
              
              console.log(`  ✅ Найден POI внутри здания: ${properties.name || id} (${layerName})`)
              
              nearbyPois.push({
                id: String(id),
                layerName,
                name: properties.name || properties.title || `Объект ${layerName}`,
                type: layerName,
                geometry,
                feature
              })
            }
          } catch (error) {
            console.error(`❌ Ошибка проверки пересечения для POI в слое ${layerName}:`, error)
          }
        })
      })

      console.log(`🎉 Итого найдено POI внутри здания: ${nearbyPois.length}`)
      return nearbyPois
    }
  }, [mapInstance])

  const checkIfBuilding = useMemo(() => {
    return (layerName: string): boolean => {
      return BUILDING_LAYER_KEYWORDS.some(keyword => layerName.includes(keyword))
    }
  }, [])

  return {
    findNearbyPois,
    checkIfBuilding
  }
} 