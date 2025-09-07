'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useMapStore } from '@/stores/mapStore'
import { useSearchStore } from '@/stores/searchStore'
import { usePanelStore } from '@/stores/panelStore'
import { usePoiSearch } from '@/hooks/usePoiSearch'
import { PoiMenu } from './PoiMenu'
import { FloorPlanSlider } from './FloorPlanSlider'
import { hasFloorPlan, getFloorPlanByLayer, getBuildingByFeature } from '@/config/layers'

// Зоны корпусов для определения принадлежности POI
// Расширяем зону для корпуса 1 (главного здания)
const BUILDING_ZONES = {
  korpus1: {
    minLon: 37.550, maxLon: 37.562,  // Расширили зону
    minLat: 55.830, maxLat: 55.838   // Расширили зону
  },
  // Добавьте зоны для других корпусов по мере необходимости
}

/**
 * Функция для определения корпуса по координатам POI
 */
function getBuildingByPoiCoordinates(lon: number, lat: number): string | null {
  console.log(`🔍 getBuildingByPoiCoordinates: проверяем координаты [${lon}, ${lat}]`)
  
  for (const [buildingId, zone] of Object.entries(BUILDING_ZONES)) {
    console.log(`  🏢 Проверяем зону ${buildingId}:`, zone)
    const inLonRange = lon >= zone.minLon && lon <= zone.maxLon
    const inLatRange = lat >= zone.minLat && lat <= zone.maxLat
    console.log(`    📍 Lon в диапазоне: ${inLonRange} (${lon} между ${zone.minLon} и ${zone.maxLon})`)
    console.log(`    📍 Lat в диапазоне: ${inLatRange} (${lat} между ${zone.minLat} и ${zone.maxLat})`)
    
    if (inLonRange && inLatRange) {
      console.log(`  ✅ Координаты принадлежат корпусу: ${buildingId}`)
      return buildingId
    }
  }
  console.log(`  ❌ Координаты не принадлежат ни одному корпусу`)
  return null
}

/**
 * Функция для определения корпуса здания по его геометрии
 */
function getBuildingByGeometry(geometry: any): string | null {
  if (!geometry) {
    console.log(`❌ getBuildingByGeometry: геометрия отсутствует`)
    return null
  }

  try {
    if (!('getCoordinates' in geometry)) {
      console.log(`❌ getBuildingByGeometry: у геометрии нет метода getCoordinates`)
      return null
    }
    
    const coordinates = geometry.getCoordinates()
    console.log(`📍 getBuildingByGeometry: координаты геометрии:`, coordinates)
    
    if (coordinates && coordinates.length > 0) {
      let x: number | undefined, y: number | undefined
      
      // Обрабатываем разные типы геометрии
      if (coordinates[0] && Array.isArray(coordinates[0])) {
        // Для MultiPolygon: coordinates[0][0][0] - первая точка первого полигона
        if (coordinates[0][0] && Array.isArray(coordinates[0][0]) && coordinates[0][0][0] && Array.isArray(coordinates[0][0][0])) {
          [x, y] = coordinates[0][0][0]
          console.log(`📍 getBuildingByGeometry: MultiPolygon, первая точка [${x}, ${y}]`)
        }
        // Для Polygon: coordinates[0][0] - первая точка
        else if (coordinates[0][0] && typeof coordinates[0][0][0] === 'number') {
          [x, y] = coordinates[0][0]
          console.log(`📍 getBuildingByGeometry: Polygon, первая точка [${x}, ${y}]`)
        }
      }
      
      if (x !== undefined && y !== undefined) {
        console.log(`📍 getBuildingByGeometry: координаты в EPSG:3857 [${x}, ${y}]`)
        
        // Конвертируем из EPSG:3857 в WGS84 используя OpenLayers
        try {
          // Динамически импортируем функцию конвертации
          import('ol/proj').then(({ toLonLat }) => {
            const [lon, lat] = toLonLat([x, y])
            console.log(`📍 getBuildingByGeometry: точные конвертированные координаты [${lon}, ${lat}]`)
            const result = getBuildingByPoiCoordinates(lon, lat)
            console.log(`🏢 getBuildingByGeometry: точный результат определения корпуса: ${result}`)
          })
          
          // Используем приблизительную конвертацию для синхронного результата
          const lon = x * 180 / 20037508.34
          const lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90
          console.log(`📍 getBuildingByGeometry: приблизительные координаты [${lon}, ${lat}]`)
          
          const result = getBuildingByPoiCoordinates(lon, lat)
          console.log(`🏢 getBuildingByGeometry: результат определения корпуса: ${result}`)
          return result
        } catch (error) {
          console.warn('Ошибка конвертации координат:', error)
        }
      } else {
        console.log(`❌ getBuildingByGeometry: не удалось извлечь координаты из структуры:`, coordinates)
      }
    }
  } catch (error) {
    console.warn('Ошибка определения корпуса по геометрии:', error)
  }

  console.log(`❌ getBuildingByGeometry: не удалось определить корпус`)
  return null
}

// Динамический импорт OpenLayers для избежания SSR проблем
const MapView = dynamic(() => import('./MapView'), { ssr: false })

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  
  // Состояние POI Menu
  const [poiMenuVisible, setPoiMenuVisible] = useState(false)
  const [poiMenuPosition, setPoiMenuPosition] = useState<[number, number] | null>(null)
  const [poiMenuBuilding, setPoiMenuBuilding] = useState<any>(null)
  const [poiMenuBuildingLayer, setPoiMenuBuildingLayer] = useState('')
  const [poiMenuItems, setPoiMenuItems] = useState<any[]>([])
  // Геометрия активного здания для контроля закрытия поэтажного плана
  const [activeFloorGeometry, setActiveFloorGeometry] = useState<any>(null)
  const activeFloorGeometryRef = useRef<any>(null)
  
  const { 
    setInitialized, 
    setError,
    setSelectedFeature,
    setMapInstance: setStoreMapInstance,
    visibleLayers,
    setFloorPlan
  } = useMapStore()
  
  const { initializeSearchData } = useSearchStore()
  const { setInfoPanelOpen } = usePanelStore()
  const { checkIfBuilding } = usePoiSearch()

  // Функция поиска POI внутри границ конкретного здания (геометрическое включение)
  const findPoisInBuilding = async (buildingFeature: any, mapInst: any) => {
    if (!mapInst || !buildingFeature) {
      return []
    }

    const buildingGeometry = buildingFeature.getGeometry()
    if (!buildingGeometry || typeof (buildingGeometry as any).intersectsCoordinate !== 'function') {
      return []
    }

    const nearbyPois: any[] = []

    // POI слои для поиска (только те, которые могут быть внутри зданий)
    const POI_LAYERS = ['atm', 'cafe', 'deanery', 'departments', 'lab', 'museum']

    try {
      // Динамический импорт модулей OpenLayers
      const { GeoJSON } = await import('ol/format')
      const { LAYERS_CONFIG } = await import('@/config/layers')
      const { toLonLat } = await import('ol/proj')

      // Проходим по всем POI слоям и загружаем их данные
      for (const layerName of POI_LAYERS) {
        const layerConfig = LAYERS_CONFIG.interactive[layerName as keyof typeof LAYERS_CONFIG.interactive]
        if (!layerConfig) continue

        try {
          const response = await fetch(`/${layerConfig.url}`)
          if (!response.ok) continue

          const geojsonData = await response.json()
          const features = new GeoJSON().readFeatures(geojsonData, {
            featureProjection: 'EPSG:3857'
          })

          for (const feature of features) {
            const geometry = feature.getGeometry()
            if (!geometry || !('getCoordinates' in geometry)) continue

            try {
              const coordinates = (geometry as any).getCoordinates()
              if (!coordinates || typeof coordinates[0] !== 'number') continue

              // Проверяем попадание точки POI внутрь геометрии здания (все в EPSG:3857)
              const isInside = (buildingGeometry as any).intersectsCoordinate(coordinates)

              // Логи только для отладки
              const [lon, lat] = toLonLat(coordinates)
              console.log(`  📍 Проверяем POI координаты: [${lon}, ${lat}] → внутри здания: ${isInside}`)

              if (isInside) {
                const properties = feature.getProperties()
                const featureId = feature.getId() || feature.get('id') || ''
                const uniqueId = `${layerName}_${featureId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

                nearbyPois.push({
                  id: uniqueId,
                  layerName,
                  name: properties.name || properties.title || `Объект ${layerName}`,
                  type: layerName,
                  geometry,
                  feature,
                  originalId: featureId
                })
              }
            } catch (error) {
              console.error(`Ошибка проверки POI ${layerName}:`, error)
            }
          }
        } catch (error) {
          console.warn(`Ошибка загрузки POI слоя ${layerName}:`, error)
        }
      }
    } catch (error) {
      console.error('Ошибка при поиске POI в здании:', error)
    }

    return nearbyPois
  }

  // Функция поиска POI для корпуса по имени с возможностью точной геометрической фильтрации
  const findPoisInBuildingByName = async (buildingId: string, mapInst: any, buildingGeometry?: any) => {
    console.log(`🔍 findPoisInBuildingByName: ищем POI для корпуса ${buildingId}`)
    
    const nearbyPois: any[] = []
    const POI_LAYERS = ['atm', 'cafe', 'deanery', 'departments', 'lab', 'museum']

    try {
      const { GeoJSON } = await import('ol/format')
      const { LAYERS_CONFIG } = await import('@/config/layers')
      const { toLonLat } = await import('ol/proj')

      // Проходим по всем POI слоям и загружаем их данные
      for (const layerName of POI_LAYERS) {
        const layerConfig = LAYERS_CONFIG.interactive[layerName as keyof typeof LAYERS_CONFIG.interactive]
        if (!layerConfig) continue

        try {
          const response = await fetch(`/${layerConfig.url}`)
          if (!response.ok) continue

          const geojsonData = await response.json()
          const features = new GeoJSON().readFeatures(geojsonData, {
            featureProjection: 'EPSG:3857'
          })

          for (const feature of features) {
            const geometry = feature.getGeometry()
            if (!geometry || !('getCoordinates' in geometry)) continue

            try {
              const coordinates = (geometry as any).getCoordinates()
              if (!coordinates || typeof coordinates[0] !== 'number') continue

              // Если передали геометрию здания — используем точную проверку попадания
              if (buildingGeometry && typeof (buildingGeometry as any).intersectsCoordinate === 'function') {
                const isInside = (buildingGeometry as any).intersectsCoordinate(coordinates)
                const [lon, lat] = toLonLat(coordinates)
                console.log(`  📍 Проверяем POI координаты: [${lon}, ${lat}] геометрически → ${isInside}`)
                if (!isInside) continue
              } else {
                // Fallback: старая логика по прямоугольной зоне
                const [lon, lat] = toLonLat(coordinates)
                console.log(`  📍 Проверяем POI координаты: [${lon}, ${lat}] для корпуса ${buildingId}`)
                const poiBuildingId = getBuildingByPoiCoordinates(lon, lat)
                if (poiBuildingId !== buildingId) {
                  console.log(`  ❌ POI не принадлежит корпусу ${buildingId}, пропускаем`)
                  continue
                }
              }

              const properties = feature.getProperties()
              const featureId = feature.getId() || feature.get('id') || ''
              const uniqueId = `${layerName}_${featureId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

              console.log(`  ✅ Добавляем POI в корпус ${buildingId}: ${properties.name || properties.title || 'Объект ' + layerName}`)

              nearbyPois.push({
                id: uniqueId,
                layerName,
                name: properties.name || properties.title || `Объект ${layerName}`,
                type: layerName,
                geometry,
                feature,
                originalId: featureId
              })
            } catch (error) {
              console.error(`Ошибка проверки POI ${layerName}:`, error)
            }
          }
        } catch (error) {
          console.warn(`Ошибка загрузки POI слоя ${layerName}:`, error)
        }
      }
    } catch (error) {
      console.error('Ошибка при принудительном поиске POI в здании:', error)
    }

    console.log(`🎉 findPoisInBuildingByName: найдено POI для корпуса ${buildingId}: ${nearbyPois.length}`)
    return nearbyPois
  }

  // Инициализация карты
  useEffect(() => {
    let mounted = true

    const initializeMap = async () => {
      try {
        if (!mapRef.current) return

                 // Динамический импорт OpenLayers
         const { Map } = await import('ol')
         const { View } = await import('ol')
         const { Tile: TileLayer } = await import('ol/layer')
         const { Vector: VectorLayer } = await import('ol/layer') 
         const { Vector: VectorSource } = await import('ol/source')
         const { XYZ } = await import('ol/source')
         const { GeoJSON } = await import('ol/format')
         const { fromLonLat } = await import('ol/proj')
         const { MAP_Z_INDEX, MAP_CONFIG } = await import('@/config/map')
        
        // Очистка контейнера
        mapRef.current.innerHTML = ''

        // Создание карты
        const map = new Map({
          target: mapRef.current,
          layers: [], // Начинаем с пустого массива слоев
          view: new View({
            center: fromLonLat([37.556241, 55.833967]), // Координаты университета
            zoom: 16,
            minZoom: 10,
            maxZoom: 22,
            extent: MAP_CONFIG?.extent
          }),
          controls: [] // Убираем стандартные контролы
        })

        if (!mounted) return

        // Базовый тайловый слой (OSM fallback) под всеми векторами, чтобы не было «дырок» за пределами подложки
        const osmBase = new TileLayer({
          source: new XYZ({
            url: MAP_CONFIG.tileLayer.fallbackUrl,
            crossOrigin: 'anonymous'
          }),
          preload: Infinity,
          zIndex: MAP_Z_INDEX.BASE_LAYERS - 10,
          properties: { name: 'osm_base', interactive: false }
        })
        map.addLayer(osmBase)

        // Обработка кликов по карте
        map.on('click', (event) => {
          // Если поэтажный план открыт и клик пришёл вне активного здания — закрываем
          const currentPlan = useMapStore.getState().floorPlan
          const activeGeom = activeFloorGeometryRef.current
          if (currentPlan?.isVisible && activeGeom && typeof (activeGeom as any).intersectsCoordinate === 'function') {
            const inside = (activeGeom as any).intersectsCoordinate(event.coordinate)
            if (!inside) {
              const { hideFloorPlan } = useMapStore.getState()
              hideFloorPlan()
              setActiveFloorGeometry(null)
              activeFloorGeometryRef.current = null
              setPoiMenuVisible(false)
            }
          }
          const features = map.getFeaturesAtPixel(event.pixel)

          if (features && features.length > 0) {
            // Находим первый интерактивный объект
            let interactiveFeature = null
            let interactiveLayerName = 'unknown'

            for (const feature of features) {
              // Находим слой, к которому принадлежит feature
              for (const layer of map.getLayers().getArray()) {
                // Проверяем, что это векторный слой
                const vectorLayer = layer as any
                if (vectorLayer.getSource && typeof vectorLayer.getSource === 'function') {
                  const source = vectorLayer.getSource()
                  if (source && source.getFeatures && source.getFeatures().includes(feature)) {
                    const layerName = vectorLayer.get('name') || 'unknown'
                    const layerProperties = vectorLayer.getProperties()

                    // Проверяем, является ли слой интерактивным
                    if (layerProperties.interactive === true) {
                      interactiveFeature = feature
                      interactiveLayerName = layerName
                      break
                    }
                  }
                }
              }
              if (interactiveFeature) break
            }

            if (interactiveFeature) {
              setSelectedFeature(interactiveFeature, interactiveLayerName)
              setInfoPanelOpen(true)

              // Проверяем, является ли кликнутый слой частью активного поэтажного плана
              const currentFloorPlan = useMapStore.getState().floorPlan
              const isFloorPlanLayer = currentFloorPlan?.availableFloors.some(
                floor => floor.layerName === interactiveLayerName
              )

              if (isFloorPlanLayer) {
                // Клик по комнате в поэтажном плане - не закрываем план, только скрываем POI menu
                setPoiMenuVisible(false)
                return
              }

              // Если кликнули на здание, проверяем есть ли поэтажный план или POI
              const isBuilding = checkIfBuilding(interactiveLayerName)
              console.log(`🏢 Клик по слою: ${interactiveLayerName}, это здание: ${isBuilding}`)

              if (isBuilding) {
                // Проверяем, есть ли поэтажный план для этого конкретного здания
                const floorPlanConfig = getBuildingByFeature(interactiveFeature, interactiveLayerName)
                console.log(`🏗️ Поэтажный план найден:`, !!floorPlanConfig, floorPlanConfig)
                
                // Дополнительная отладка для university_buildings
                if (interactiveLayerName === 'university_buildings') {
                  const properties = interactiveFeature.getProperties()
                  console.log(`🏫 Свойства здания university_buildings:`, properties)
                  
                  // Альтернативная логика: определяем корпус по свойствам здания
                  const buildingName = properties.name || properties.title || ''
                  const buildingNumber = properties.building_number || ''
                  console.log(`🏫 Название здания: "${buildingName}", номер: "${buildingNumber}"`)
                  
                  // Если это корпус 1, принудительно устанавливаем поэтажный план
                  if (buildingName.includes('Корпус № 1') || buildingNumber === '1') {
                    console.log(`🎯 Обнаружен корпус 1 по свойствам! Принудительно загружаем поэтажный план`)
                    
                    // Принудительно устанавливаем поэтажный план для корпуса 1
                    import('@/config/layers').then(({ FLOOR_PLANS }) => {
                      const korpus1Config = FLOOR_PLANS.find(config => config.buildingId === 'korpus1')
                      
                      if (korpus1Config) {
                        const firstFloor = korpus1Config.floors.find(f => f.level === 1) ||
                                         korpus1Config.floors.reduce((min, floor) =>
                                           floor.level < min.level ? floor : min
                                         )

                        setFloorPlan({
                          buildingId: korpus1Config.buildingId,
                          buildingName: korpus1Config.buildingName,
                          currentFloor: firstFloor.level,
                          availableFloors: korpus1Config.floors.map(floor => ({
                            level: floor.level,
                            name: floor.name,
                            layerName: floor.layerName
                          })),
                          isVisible: true
                        })
                        // Запоминаем геометрию активного здания
                        const geomForced = interactiveFeature.getGeometry()
                        setActiveFloorGeometry(geomForced)
                        activeFloorGeometryRef.current = geomForced
                        
                        console.log(`✅ Поэтажный план для корпуса 1 установлен принудительно!`)
                      }
                    })
                  }
                }
                
                if (floorPlanConfig) {
                  // Ищем первый этаж (level: 1), если нет - берем минимальный уровень
                  const firstFloor = floorPlanConfig.floors.find(f => f.level === 1) ||
                                   floorPlanConfig.floors.reduce((min, floor) =>
                                     floor.level < min.level ? floor : min
                                   )

                  setFloorPlan({
                    buildingId: floorPlanConfig.buildingId,
                    buildingName: floorPlanConfig.buildingName,
                    currentFloor: firstFloor.level, // Начинаем с первого этажа (level: 1)
                    availableFloors: floorPlanConfig.floors.map(floor => ({
                      level: floor.level,
                      name: floor.name,
                      layerName: floor.layerName
                    })),
                    isVisible: true
                  })
                  // Запоминаем геометрию активного здания
                  const geom = interactiveFeature.getGeometry()
                  setActiveFloorGeometry(geom)
                  activeFloorGeometryRef.current = geom
                }

                // Асинхронно ищем POI внутри здания
                console.log(`🔍 Начинаем поиск POI в здании...`)
                
                // Альтернативный поиск POI для корпуса 1 по свойствам
                if (interactiveLayerName === 'university_buildings') {
                  const properties = interactiveFeature.getProperties()
                  const buildingName = properties.name || properties.title || ''
                  const buildingNumber = properties.building_number || ''
                  
                  if (buildingName.includes('Корпус № 1') || buildingNumber === '1') {
                    console.log(`🎯 Ищем POI для корпуса 1 принудительно...`)
                    // Принудительно ищем POI с buildingId = 'korpus1'
                    const clickedBuildingGeometry = interactiveFeature.getGeometry()
                    findPoisInBuildingByName('korpus1', map, clickedBuildingGeometry).then((nearbyPois) => {
                      console.log(`🎯 Найдено POI в корпусе 1 принудительно:`, nearbyPois.length, nearbyPois)
                      if (nearbyPois.length > 0) {
                        const pixel = event.pixel
                        const rect = mapRef.current?.getBoundingClientRect()
                        if (rect) {
                          const screenX = rect.left + pixel[0]
                          const screenY = rect.top + pixel[1]

                          setPoiMenuPosition([screenX, screenY])
                          setPoiMenuBuilding(interactiveFeature)
                          setPoiMenuBuildingLayer(interactiveLayerName)
                          setPoiMenuItems(nearbyPois)
                          setPoiMenuVisible(true)
                        }
                      } else {
                        setPoiMenuVisible(false)
                      }
                    }).catch((error) => {
                      console.error('Ошибка принудительного поиска POI для корпуса 1:', error)
                      setPoiMenuVisible(false)
                    })
                    return // Выходим, чтобы не запускать обычный поиск
                  }
                }
                
                findPoisInBuilding(interactiveFeature, map).then((nearbyPois) => {
                  console.log(`🎯 Найдено POI в здании:`, nearbyPois.length, nearbyPois)
                  // Показываем POI меню если есть POI в здании
                  if (nearbyPois.length > 0) {
                    // Конвертируем координаты клика в экранные
                    const pixel = event.pixel
                    const rect = mapRef.current?.getBoundingClientRect()
                    if (rect) {
                      const screenX = rect.left + pixel[0]
                      const screenY = rect.top + pixel[1]

                      setPoiMenuPosition([screenX, screenY])
                      setPoiMenuBuilding(interactiveFeature)
                      setPoiMenuBuildingLayer(interactiveLayerName)
                      setPoiMenuItems(nearbyPois)
                      setPoiMenuVisible(true)
                    }
                  } else {
                    setPoiMenuVisible(false)
                  }
                }).catch((error) => {
                  console.error('Ошибка поиска POI в здании:', error)
                  setPoiMenuVisible(false)
                })

                // Если нет поэтажного плана - закрываем его
                if (!floorPlanConfig) {
                  const { hideFloorPlan } = useMapStore.getState()
                  hideFloorPlan()
                  setActiveFloorGeometry(null)
                  activeFloorGeometryRef.current = null
                }
              } else {
                // Клик на не-здание - закрываем поэтажный план
                const { hideFloorPlan } = useMapStore.getState()
                hideFloorPlan()
                setActiveFloorGeometry(null)
                activeFloorGeometryRef.current = null
                setPoiMenuVisible(false)
              }
            } else {
              // Нет интерактивных объектов под курсором - плавно закрываем панели
              setInfoPanelOpen(false)
              setPoiMenuVisible(false)

              // Очищаем выбранную фичу с задержкой для анимации
              setTimeout(() => {
                setSelectedFeature(null, null)
              }, 300)
            }
          } else {
            // Клик по пустой области карты - плавно закрываем все панели
            setInfoPanelOpen(false)
            setPoiMenuVisible(false)

            // Закрываем поэтажный план при клике по карте
            const { hideFloorPlan } = useMapStore.getState()
            hideFloorPlan()
            setActiveFloorGeometry(null)
            activeFloorGeometryRef.current = null

            // Очищаем выбранную фичу с задержкой для анимации
            setTimeout(() => {
              setSelectedFeature(null, null)
            }, 300)
          }
        })

        // Изменение курсора при наведении на объекты
        map.on('pointermove', (event) => {
          const pixel = map.getEventPixel(event.originalEvent)
          const features = map.getFeaturesAtPixel(pixel)
          
          let hasInteractiveFeature = false
          if (features && features.length > 0) {
            // Проверяем, есть ли интерактивные объекты под курсором
            for (const feature of features) {
              for (const layer of map.getLayers().getArray()) {
                const vectorLayer = layer as any
                if (vectorLayer.getSource && typeof vectorLayer.getSource === 'function') {
                  const source = vectorLayer.getSource()
                  if (source && source.getFeatures && source.getFeatures().includes(feature)) {
                    const layerProperties = vectorLayer.getProperties()
                    if (layerProperties.interactive === true) {
                      hasInteractiveFeature = true
                      break
                    }
                  }
                }
              }
              if (hasInteractiveFeature) break
            }
          }
          
          const target = map.getTarget()
          if (target && typeof target !== 'string') {
            target.style.cursor = hasInteractiveFeature ? 'pointer' : ''
          }
        })

        setMapInstance(map)
        setStoreMapInstance(map)
        setInitialized(true)

      } catch (error) {
        console.error('❌ Ошибка инициализации карты:', error)
        if (mounted) {
          setError(`Ошибка инициализации карты: ${error}`)
        }
      }
    }

    initializeMap()

    return () => {
      mounted = false
    }
  }, [setInitialized, setError, setSelectedFeature, setInfoPanelOpen])

  // Загрузка данных карты
  useEffect(() => {
    if (!mapInstance) return

    const loadMapData = async () => {
      try {
        
                 // Динамический импорт модулей OpenLayers
         const { Vector: VectorLayer } = await import('ol/layer')
         const { Vector: VectorSource } = await import('ol/source')
         const { GeoJSON } = await import('ol/format')
         const { Style } = await import('ol/style')
         const { Fill } = await import('ol/style')
         const { Stroke } = await import('ol/style')
         const { Circle } = await import('ol/style')
         const { Icon } = await import('ol/style')

        // Загрузка слоев из конфигурации
        const { LAYERS_CONFIG } = await import('@/config/layers')
        
        // Функция получения иконки для POI
        const getIconForLayer = (layerName: string): string | null => {
          const iconMap: Record<string, string> = {
            'cafe': 'mug-saucer-solid.png',
            'atm': 'money-bills-solid.png',
            'lab': 'flask-solid.png',
            'museum': 'landmark-solid.png',
            'deanery': 'building-columns-solid.png',
            'departments': 'building-columns-solid.png',
            'bus_stops': 'bus-solid.png',
            'tram_stops': 'train-tram-solid.png',
            'metro_stations': 'train-tram-solid.png'
          }
          return iconMap[layerName] || null
        }
        
        const allFeatures: Array<{ feature: any, layer: string, category: string }> = []

        // Функция для загрузки слоя
        const loadLayer = async (layerName: string, layerConfig: any) => {
          try {
            const response = await fetch(`/${layerConfig.url}`)
            if (!response.ok) {
              console.warn(`⚠️ Не удалось загрузить слой ${layerName}:`, response.status)
              return
            }

            const geojsonData = await response.json()
            
            // Создание источника данных
            let features = new GeoJSON().readFeatures(geojsonData, {
              featureProjection: 'EPSG:3857'
            })

            // Для POI слоев фильтруем точки, которые находятся внутри зданий
            const POI_LAYERS = ['atm', 'cafe', 'deanery', 'departments', 'lab', 'museum']
            if (POI_LAYERS.includes(layerName)) {
              // Временно отключаем фильтрацию для отладки
              console.log(`🔍 Загружаем POI слой ${layerName} с ${features.length} объектами`)
              
              // features = features.filter((feature: any) => {
              //   const geometry = feature.getGeometry()
              //   if (!geometry) return true

              //   try {
              //     const coordinates = geometry.getCoordinates()
              //     if (!coordinates || typeof coordinates[0] !== 'number') return true

              //     // Координаты в проекции EPSG:3857, нужно конвертировать обратно в WGS84
              //     const { toLonLat } = await import('ol/proj')
              //     const [lon, lat] = toLonLat(coordinates)
                  
              //     // Проверяем, находится ли POI внутри зоны корпуса
              //     const buildingId = getBuildingByPoiCoordinates(lon, lat)
                  
              //     // Если POI находится в зоне корпуса, скрываем его на карте
              //     // (но оставляем доступным для POI меню)
              //     return !buildingId
              //   } catch (error) {
              //     console.warn(`Ошибка фильтрации POI ${layerName}:`, error)
              //     return true
              //   }
              // })
            }

            const source = new VectorSource({
              features: features as any
            })

            // Добавляем метаданные к каждой фиче
            source.getFeatures().forEach(feature => {
              if ('set' in feature) {
                feature.set('layer', layerName)
                feature.set('category', layerConfig.category)
                
                // Добавляем в allFeatures только интерактивные слои
                if (layerConfig.interactive) {
                  allFeatures.push({
                    feature: feature as any,
                    layer: layerName,
                    category: layerConfig.category
                  })
                }
              }
            })

            // Если это POI слой — не отрисовываем его на карте, но данные уже загружены и добавлены в allFeatures
            if (POI_LAYERS.includes(layerName)) {
              console.log(`👁️  Скрываем отрисовку POI слоя ${layerName} (данные доступны для поиска/меню)`)
              return
            }

            // Создание стиля
            const createStyle = () => {
              if (typeof layerConfig.style === 'function') {
                const styleFunction = layerConfig.style as (feature: any) => any
                return (feature: any) => {
                  const styleConfig = styleFunction(feature)
                  const hexOpacity = Math.round(styleConfig.fillOpacity * 255).toString(16).padStart(2, '0')
                  const geometry = feature.getGeometry()
                  const geometryType = geometry?.getType()
                  
                  const styleOptions: any = {
                    fill: new Fill({
                      color: `${styleConfig.fillColor}${hexOpacity}`
                    }),
                    stroke: new Stroke({
                      color: styleConfig.strokeColor,
                      width: styleConfig.strokeWidth
                    })
                  }
                  
                  // Добавляем image только для точечных объектов
                  if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                    const iconPath = getIconForLayer(layerName)
                    if (iconPath) {
                      // Используем иконку для POI и транспорта
                      styleOptions.image = new Icon({
                        src: `/images/icons/${iconPath}`,
                        scale: 0.03,
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction'
                      })
                    } else {
                      // Используем кружок для остальных точечных объектов
                      styleOptions.image = new Circle({
                        radius: 6,
                        fill: new Fill({
                          color: `${styleConfig.fillColor}${hexOpacity}`
                        }),
                        stroke: new Stroke({
                          color: styleConfig.strokeColor,
                          width: styleConfig.strokeWidth
                        })
                      })
                    }
                  }
                  
                  return new Style(styleOptions)
                }
              } else {
                const styleConfig = layerConfig.style
                const hexOpacity = Math.round(styleConfig.fillOpacity * 255).toString(16).padStart(2, '0')
                
                return (feature: any) => {
                  const geometry = feature.getGeometry()
                  const geometryType = geometry?.getType()
                  
                  const styleOptions: any = {
                    fill: new Fill({
                      color: `${styleConfig.fillColor}${hexOpacity}`
                    }),
                    stroke: new Stroke({
                      color: styleConfig.strokeColor,
                      width: styleConfig.strokeWidth
                    })
                  }
                  
                  // Добавляем image только для точечных объектов
                  if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                    const iconPath = getIconForLayer(layerName)
                    if (iconPath) {
                      // Используем иконку для POI и транспорта
                      styleOptions.image = new Icon({
                        src: `/images/icons/${iconPath}`,
                        scale: 0.03,
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction'
                      })
                    } else {
                      // Используем кружок для остальных точечных объектов
                      styleOptions.image = new Circle({
                        radius: 6,
                        fill: new Fill({
                          color: `${styleConfig.fillColor}${hexOpacity}`
                        }),
                        stroke: new Stroke({
                          color: styleConfig.strokeColor,
                          width: styleConfig.strokeWidth
                        })
                      })
                    }
                  }
                  
                  return new Style(styleOptions)
                }
              }
            }

            // Создание слоя
            const vectorLayer = new VectorLayer({
              source,
              style: createStyle(),
              zIndex: layerConfig.zIndex || 100,
              properties: {
                name: layerName,
                title: layerConfig.name,
                category: layerConfig.category,
                interactive: layerConfig.interactive
              }
            })

            mapInstance.addLayer(vectorLayer)

          } catch (layerError) {
            console.error(`❌ Ошибка загрузки слоя ${layerName}:`, layerError)
          }
        }

        // Загружаем все базовые слои
        for (const [layerName, layerConfig] of Object.entries(LAYERS_CONFIG.base)) {
          await loadLayer(layerName, layerConfig)
        }

        // Загружаем все интерактивные слои
        for (const [layerName, layerConfig] of Object.entries(LAYERS_CONFIG.interactive)) {
          await loadLayer(layerName, layerConfig)
        }

        // Инициализируем данные для поиска
        initializeSearchData(allFeatures)

      } catch (error) {
        console.error('❌ Ошибка загрузки данных карты:', error)
        setError(`Ошибка загрузки данных: ${error}`)
      }
    }

    loadMapData()
  }, [mapInstance, initializeSearchData, setError])

  // Функция для загрузки слоя этажа, если он еще не загружен
  const loadFloorLayer = async (layerName: string) => {
    if (!mapInstance) return

    // Проверяем, есть ли уже такой слой на карте
    const existingLayer = mapInstance.getLayers().getArray().find(
      (layer: any) => layer.get('name') === layerName
    )
    
    if (existingLayer) {
      return // Слой уже загружен
    }

    try {
      // Динамический импорт модулей OpenLayers
      const { Vector: VectorLayer } = await import('ol/layer')
      const { Vector: VectorSource } = await import('ol/source')
      const { GeoJSON } = await import('ol/format')
      const { Style, Fill, Stroke } = await import('ol/style')

      // Загружаем конфигурацию слоя
      const { LAYERS_CONFIG } = await import('@/config/layers')
      const layerConfig = LAYERS_CONFIG.floorPlans[layerName as keyof typeof LAYERS_CONFIG.floorPlans]
      
      if (!layerConfig) {
        console.warn(`⚠️ Конфигурация для слоя ${layerName} не найдена`)
        return
      }

      const response = await fetch(`/${layerConfig.url}`)
      if (!response.ok) {
        console.warn(`⚠️ Не удалось загрузить слой ${layerName}:`, response.status)
        return
      }

      const geojsonData = await response.json()
      
      // Создание источника данных
      const features = new GeoJSON().readFeatures(geojsonData, {
        featureProjection: 'EPSG:3857'
      })
      const source = new VectorSource({
        features: features as any
      })

      // Добавляем метаданные к каждой фиче
      source.getFeatures().forEach(feature => {
        if ('set' in feature) {
          feature.set('layer', layerName)
          feature.set('category', layerConfig.category)
        }
      })

      // Создание стиля
      const createStyle = () => {
        if (typeof layerConfig.style === 'function') {
          const styleFunction = layerConfig.style as (feature: any) => any
          return (feature: any) => {
            const styleConfig = styleFunction(feature)
            const hexOpacity = Math.round(styleConfig.fillOpacity * 255).toString(16).padStart(2, '0')
            
            return new Style({
              fill: new Fill({
                color: `${styleConfig.fillColor}${hexOpacity}`
              }),
              stroke: new Stroke({
                color: styleConfig.strokeColor,
                width: styleConfig.strokeWidth
              })
            })
          }
        } else {
          const styleConfig = layerConfig.style
          const hexOpacity = Math.round(styleConfig.fillOpacity * 255).toString(16).padStart(2, '0')
          
          return new Style({
            fill: new Fill({
              color: `${styleConfig.fillColor}${hexOpacity}`
            }),
            stroke: new Stroke({
              color: styleConfig.strokeColor,
              width: styleConfig.strokeWidth
            })
          })
        }
      }

      // Создание слоя
      const vectorLayer = new VectorLayer({
        source,
        style: createStyle(),
        zIndex: layerConfig.zIndex || 300, // Высокий z-index для этажей
        properties: {
          name: layerName,
          title: layerConfig.name,
          category: layerConfig.category,
          interactive: layerConfig.interactive
        }
      })

      // Добавляем слой на карту, но делаем его невидимым по умолчанию
      vectorLayer.setVisible(false)
      mapInstance.addLayer(vectorLayer)

    } catch (error) {
      console.error(`❌ Ошибка загрузки слоя этажа ${layerName}:`, error)
    }
  }

  // Управление видимостью слоев
  useEffect(() => {
    if (!mapInstance) return

    mapInstance.getLayers().forEach((layer: any) => {
      const layerName = layer.get('name')
      if (layerName) {
        layer.setVisible(visibleLayers.has(layerName))
      }
    })
  }, [mapInstance, visibleLayers])

  // Загружаем слои этажей при активации поэтажного плана
  const { floorPlan } = useMapStore()
  useEffect(() => {
    if (!mapInstance || !floorPlan) return

    const loadAllFloorLayers = async () => {
      // Загружаем все слои этажей для текущего здания
      for (const floor of floorPlan.availableFloors) {
        await loadFloorLayer(floor.layerName)
      }
      
      // После загрузки всех слоев показываем текущий этаж
      const currentFloorLayer = mapInstance.getLayers().getArray().find(
        (layer: any) => layer.get('name') === floorPlan.availableFloors.find(f => f.level === floorPlan.currentFloor)?.layerName
      )
      
      if (currentFloorLayer) {
        currentFloorLayer.setVisible(true)
      }
    }

    loadAllFloorLayers()
  }, [mapInstance, floorPlan])

  // Обработчики POI Menu
  const handlePoiItemClick = (id: string, layerName: string) => {
    // Найти и выбрать соответствующий объект
    if (mapInstance) {
      // Сначала попробуем найти среди текущих poiItems
      const poiItem = poiMenuItems.find(item => item.id === id)
      if (poiItem && poiItem.feature) {
        setSelectedFeature(poiItem.feature, layerName)
        setInfoPanelOpen(true)
        return
      }

      // Специальная обработка для клика по зданию
      if (layerName === poiMenuBuildingLayer && poiMenuBuilding) {
        const buildingId = poiMenuBuilding.getId?.() || poiMenuBuilding.get?.('id') || ''
        if (String(buildingId) === String(id)) {
          setSelectedFeature(poiMenuBuilding, layerName)
          setInfoPanelOpen(true)
          return
        }
      }

      // Fallback: поиск по слоям (для обратной совместимости)
      mapInstance.getLayers().forEach((layer: any) => {
        if (layer.get('name') === layerName) {
          const source = layer.getSource()
          if (source && source.getFeatures) {
            const features = source.getFeatures()
            // Ищем по originalId если он есть в ID, иначе по полному совпадению
            const originalId = id.includes('_') ? id.split('_')[1] : id
            const targetFeature = features.find((f: any) =>
              String(f.getId() || f.get('id')) === originalId ||
              String(f.getId() || f.get('id')) === id
            )
            if (targetFeature) {
              setSelectedFeature(targetFeature, layerName)
              setInfoPanelOpen(true)
            }
          }
        }
      })
    }
  }

  const handlePoiMenuClose = () => {
    setPoiMenuVisible(false)
  }

  return (
    <>
      <div 
        ref={mapRef}
        className="h-full w-full bg-blue-100"
        style={{ minHeight: '400px' }}
      >
        {/* Fallback контент пока карта загружается */}
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner h-8 w-8 mx-auto mb-4" />
            <p className="text-gray-600">Загрузка карты...</p>
          </div>
        </div>
      </div>
      
      {/* POI Menu Overlay */}
      <PoiMenu
        isVisible={poiMenuVisible}
        position={poiMenuPosition}
        buildingFeature={poiMenuBuilding}
        buildingLayer={poiMenuBuildingLayer}
        poiItems={poiMenuItems}
        onItemClick={handlePoiItemClick}
        onClose={handlePoiMenuClose}
      />
      
      {/* Floor Plan Slider */}
      <FloorPlanSlider />
    </>
  )
} 