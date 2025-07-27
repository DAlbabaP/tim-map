'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useMapStore } from '@/stores/mapStore'
import { useSearchStore } from '@/stores/searchStore'
import { usePanelStore } from '@/stores/panelStore'
import { usePoiSearch } from '@/hooks/usePoiSearch'
import { PoiMenu } from './PoiMenu'
import { FloorPlanSlider } from './FloorPlanSlider'
import { hasFloorPlan, getFloorPlanByLayer } from '@/config/layers'

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

  // Функция поиска POI внутри здания (без использования hook)
  const findPoisInBuilding = (buildingFeature: any, mapInst: any) => {
    if (!mapInst || !buildingFeature) {
      return []
    }

    const buildingGeometry = buildingFeature.getGeometry()
    if (!buildingGeometry) {
      return []
    }

    const nearbyPois: any[] = []
    
    // POI слои для поиска
    const POI_LAYERS = [
      'atm', 'cafe', 'deanery', 'departments', 'lab', 'museum',
      'metro_stations', 'tram_stops', 'bus_stops'
    ]
    
    // Проходим по всем слоям карты
    mapInst.getLayers().forEach((layer: any) => {
      if (!layer.getSource || typeof layer.getSource !== 'function') return

      const layerName = layer.get('name') || ''
      
      // Пропускаем слои зданий
      if (layerName.includes('building') || layerName.includes('buildings')) {
        return
      }

      // Проверяем только POI слои
      if (!POI_LAYERS.includes(layerName)) {
        return
      }

      const source = layer.getSource()
      if (!source || !source.getFeatures) return

      const features = source.getFeatures()
      
      features.forEach((feature: any) => {
        const geometry = feature.getGeometry()
        if (!geometry) return

        // Проверяем, находится ли POI внутри геометрии здания
        try {
          const coordinates = geometry.getCoordinates()
          let isInside = false

          // Проверяем пересечение координат POI с геометрией здания
          if (buildingGeometry.intersectsCoordinate && coordinates) {
            isInside = buildingGeometry.intersectsCoordinate(coordinates)
          } else {
            // Fallback: проверяем пересечение геометрий
            if (buildingGeometry.intersectsExtent && geometry.getExtent) {
              const poiExtent = geometry.getExtent()
              isInside = buildingGeometry.intersectsExtent(poiExtent)
            }
          }

          if (isInside) {
            const properties = feature.getProperties()
            const id = feature.getId() || feature.get('id') || `${layerName}_${Math.random()}`
            
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
          console.error(`Ошибка проверки пересечения для POI в слое ${layerName}:`, error)
        }
      })
    })

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
        
        // Очистка контейнера
        mapRef.current.innerHTML = ''

        // Создание карты без базового тайлового слоя
        const map = new Map({
          target: mapRef.current,
          layers: [], // Начинаем с пустого массива слоев
          view: new View({
            center: fromLonLat([37.556241, 55.833967]), // Координаты университета
            zoom: 16,
            minZoom: 10,
            maxZoom: 22
          }),
          controls: [] // Убираем стандартные контролы
        })

        if (!mounted) return

        // Обработка кликов по карте
        map.on('click', (event) => {
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
              
              if (isBuilding) {
                // Сначала проверяем, есть ли поэтажный план
                if (hasFloorPlan(interactiveLayerName)) {
                  // Показываем поэтажный план
                  const floorPlanConfig = getFloorPlanByLayer(interactiveLayerName)
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
                    
                    setPoiMenuVisible(false)
                  }
                } else {
                  // Закрываем поэтажный план если кликнули на здание без планов
                  const { hideFloorPlan } = useMapStore.getState()
                  hideFloorPlan()
                  
                  // Обычная логика для POI Menu если нет поэтажного плана
                  const nearbyPois = findPoisInBuilding(interactiveFeature, map)
                  
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
                }
              } else {
                // Клик на не-здание - закрываем поэтажный план
                const { hideFloorPlan } = useMapStore.getState()
                hideFloorPlan()
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
      const layerConfig = LAYERS_CONFIG.interactive[layerName as keyof typeof LAYERS_CONFIG.interactive]
      
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
      mapInstance.getLayers().forEach((layer: any) => {
        if (layer.get('name') === layerName) {
          const source = layer.getSource()
          if (source && source.getFeatures) {
            const features = source.getFeatures()
            const targetFeature = features.find((f: any) => 
              String(f.getId() || f.get('id')) === String(id)
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