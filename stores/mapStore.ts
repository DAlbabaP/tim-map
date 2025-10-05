import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { OLFeature, AllLayersConfig } from '@/types'

interface FloorPlan {
  buildingId: string
  buildingName: string
  currentFloor: number
  availableFloors: FloorInfo[]
  isVisible: boolean
}

interface FloorInfo {
  level: number
  name: string
  layerName: string
}

interface MapState {
  // Состояние инициализации
  isInitialized: boolean
  isLoading: boolean
  error: string | null

  // Экземпляр карты
  mapInstance: any | null

  // Выбранный объект
  selectedFeature: OLFeature | null
  selectedLayer: string | null

  // Видимые слои
  visibleLayers: Set<string>

  // Поэтажные планы
  floorPlan: FloorPlan | null

  // Местоположение пользователя
  userLocation: [number, number] | null
  isLocating: boolean

  // Состояние карты
  center: [number, number]
  zoom: number
  extent: [number, number, number, number] | null

  // Навигация/маршрут
  isRouting: boolean
  routeStart: [number, number] | null // в проекции EPSG:3857
  routeEnd: [number, number] | null   // в проекции EPSG:3857
  routeGeometry: any | null

  // Действия
  setInitialized: (initialized: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setMapInstance: (instance: any | null) => void
  
  setSelectedFeature: (feature: OLFeature | null, layer?: string | null) => void
  
  toggleLayerVisibility: (layerName: string) => void
  setLayerVisibility: (layerName: string, visible: boolean) => void
  toggleAllLayers: () => void
  
  // Поэтажные планы
  setFloorPlan: (floorPlan: FloorPlan | null) => void
  setCurrentFloor: (floor: number) => void
  hideFloorPlan: () => void
  
  setUserLocation: (location: [number, number] | null) => void
  setLocating: (locating: boolean) => void
  
  setMapView: (center: [number, number], zoom: number) => void
  setMapExtent: (extent: [number, number, number, number] | null) => void

  // Навигация/маршрут
  toggleRouting: (enabled?: boolean) => void
  setRouteStart: (coord3857: [number, number] | null) => void
  setRouteEnd: (coord3857: [number, number] | null) => void
  setRouteGeometry: (geometry: any | null) => void
  clearRoute: () => void
  
  // Утилиты
  reset: () => void
}

// Начальные видимые слои из конфигурации
const getInitialVisibleLayers = () => {
  // Импортируем конфигурацию слоев
  const { LAYERS_CONFIG } = require('@/config/layers')

  const visibleLayers = new Set<string>()

  // Добавляем все базовые слои (они всегда видимы)
  Object.keys(LAYERS_CONFIG.base).forEach(layerName => {
    visibleLayers.add(layerName)
  })

  // Добавляем все интерактивные слои (все видимы по умолчанию)
  Object.keys(LAYERS_CONFIG.interactive).forEach(layerName => {
    visibleLayers.add(layerName)
  })

  return visibleLayers
}

export const useMapStore = create<MapState>()(
  subscribeWithSelector((set, get) => ({
    // Начальное состояние
    isInitialized: false,
    isLoading: false,
    error: null,
    
    mapInstance: null,
    
    selectedFeature: null,
    selectedLayer: null,
    
    visibleLayers: getInitialVisibleLayers(),
    
    floorPlan: null,
    
    userLocation: null,
    isLocating: false,

    // Навигация/маршрут
    isRouting: false,
    routeStart: null,
    routeEnd: null,
    routeGeometry: null,
    
    center: [4180050.855075, 7525234.989304], // Центр университета
    zoom: 16,
    extent: null,

    // Действия
    setInitialized: (initialized) => {
      set({ isInitialized: initialized })
    },

    setLoading: (loading) => {
      set({ isLoading: loading })
    },

    setError: (error) => {
      set({ error })
    },

    setMapInstance: (instance) => {
      set({ mapInstance: instance })
    },

    setSelectedFeature: (feature, layer = null) => {
      set({ 
        selectedFeature: feature,
        selectedLayer: layer
      })
    },

    toggleLayerVisibility: (layerName) => {
      set((state) => {
        const newVisibleLayers = new Set(state.visibleLayers)
        if (newVisibleLayers.has(layerName)) {
          newVisibleLayers.delete(layerName)
        } else {
          newVisibleLayers.add(layerName)
        }
        return { visibleLayers: newVisibleLayers }
      })
    },

    setLayerVisibility: (layerName, visible) => {
      set((state) => {
        const newVisibleLayers = new Set(state.visibleLayers)
        if (visible) {
          newVisibleLayers.add(layerName)
        } else {
          newVisibleLayers.delete(layerName)
        }
        return { visibleLayers: newVisibleLayers }
      })
    },

    toggleAllLayers: () => {
      set((state) => {
        const { LAYERS_CONFIG } = require('@/config/layers')

        // Получаем все интерактивные слои из конфигурации
        const allInteractiveLayers = Object.keys(LAYERS_CONFIG.interactive)
        const allBaseLayers = Object.keys(LAYERS_CONFIG.base)

        // Объединяем все слои (кроме базовых, которые всегда должны быть видимы)
        const allTogglableLayers = [...allInteractiveLayers]

        const visibleTogglableLayers = allTogglableLayers.filter(layer =>
          state.visibleLayers.has(layer)
        )

        const newVisibleLayers = new Set(state.visibleLayers)

        if (visibleTogglableLayers.length === allTogglableLayers.length) {
          // Все интерактивные слои видимы - скрываем их
          allTogglableLayers.forEach(layer => newVisibleLayers.delete(layer))
        } else {
          // Есть скрытые слои - показываем все интерактивные
          allTogglableLayers.forEach(layer => newVisibleLayers.add(layer))
        }

        return { visibleLayers: newVisibleLayers }
      })
    },

    // Поэтажные планы
    setFloorPlan: (floorPlan) => {
      set({ floorPlan })
    },

    setCurrentFloor: (floor) => {
      set((state) => {
        if (!state.floorPlan) return state
        
        const newVisibleLayers = new Set(state.visibleLayers)
        
        // Скрываем все слои этажей текущего здания
        state.floorPlan.availableFloors.forEach(floorInfo => {
          newVisibleLayers.delete(floorInfo.layerName)
        })
        
        // Показываем только выбранный этаж
        const selectedFloor = state.floorPlan.availableFloors.find(f => f.level === floor)
        if (selectedFloor) {
          newVisibleLayers.add(selectedFloor.layerName)
        }
        
        return {
          floorPlan: {
            ...state.floorPlan,
            currentFloor: floor
          },
          visibleLayers: newVisibleLayers
        }
      })
    },

    hideFloorPlan: () => {
      set((state) => {
        if (!state.floorPlan) return state

        const { LAYERS_CONFIG } = require('@/config/layers')
        const newVisibleLayers = new Set(state.visibleLayers)

        // Скрываем все слои этажей
        state.floorPlan.availableFloors.forEach(floorInfo => {
          newVisibleLayers.delete(floorInfo.layerName)
        })

        // Показываем обратно обычные слои зданий (все интерактивные слои по умолчанию)
        Object.keys(LAYERS_CONFIG.interactive).forEach(layerName => {
          newVisibleLayers.add(layerName)
        })

        return {
          floorPlan: null,
          visibleLayers: newVisibleLayers
        }
      })
    },

    setUserLocation: (location) => {
      set({ userLocation: location })
    },

    setLocating: (locating) => {
      set({ isLocating: locating })
    },

    setMapView: (center, zoom) => {
      set({ center, zoom })
    },

    setMapExtent: (extent) => {
      set({ extent })
    },

    // Навигация/маршрут
    toggleRouting: (enabled) => {
      set((state) => ({
        isRouting: enabled !== undefined ? enabled : !state.isRouting,
        // При включении режима маршрута — сбрасываем текущий маршрут
        routeStart: enabled ?? !state.isRouting ? null : state.routeStart,
        routeEnd: enabled ?? !state.isRouting ? null : state.routeEnd,
        routeGeometry: enabled ?? !state.isRouting ? null : state.routeGeometry,
      }))
    },

    setRouteStart: (coord3857) => set({ routeStart: coord3857 }),
    setRouteEnd: (coord3857) => set({ routeEnd: coord3857 }),
    setRouteGeometry: (geometry) => set({ routeGeometry: geometry }),
    clearRoute: () => set({ routeStart: null, routeEnd: null, routeGeometry: null }),

    reset: () => {
      set({
        isInitialized: false,
        isLoading: false,
        error: null,
        mapInstance: null,
        selectedFeature: null,
        selectedLayer: null,
        visibleLayers: getInitialVisibleLayers(),
        floorPlan: null,
        userLocation: null,
        isLocating: false,
        // Навигация/маршрут
        isRouting: false,
        routeStart: null,
        routeEnd: null,
        routeGeometry: null,
        center: [4180050.855075, 7525234.989304],
        zoom: 16,
        extent: null,
      })
    }
  }))
)

// Селекторы для удобства
export const useSelectedFeature = () => useMapStore(state => ({
  feature: state.selectedFeature,
  layer: state.selectedLayer
}))

export const useMapInitialization = () => useMapStore(state => ({
  isInitialized: state.isInitialized,
  isLoading: state.isLoading,
  error: state.error
}))

export const useVisibleLayers = () => useMapStore(state => state.visibleLayers)

export const useUserLocation = () => useMapStore(state => ({
  location: state.userLocation,
  isLocating: state.isLocating
}))

export const useMapView = () => useMapStore(state => ({
  center: state.center,
  zoom: state.zoom,
  extent: state.extent
}))

export const useFloorPlan = () => useMapStore(state => ({
  floorPlan: state.floorPlan,
  setFloorPlan: state.setFloorPlan,
  setCurrentFloor: state.setCurrentFloor,
  hideFloorPlan: state.hideFloorPlan
})) 