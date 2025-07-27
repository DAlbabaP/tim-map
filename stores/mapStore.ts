import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { OLFeature } from '@/types'

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
  
  // Утилиты
  reset: () => void
}

// Начальные видимые слои из конфигурации
const getInitialVisibleLayers = () => {
  const layers = [
    // Базовые слои всегда включены
    'podlozka',
    'water',
    'forest',
    'parks',
    'grassland',
    'fields',
    'beach',
    'greenhouse',
    'orchdeal',
    'pitch',
    'running_tracks',
    'roads',
    'railways',
    'buildings_in_university',
    'buildings_for_map',
    
    // Интерактивные слои по умолчанию
    'main_building',
    'university_buildings',
    'dormitory_buildings',
    'metro_stations',
    'bus_stops'
  ]
  
  return new Set(layers)
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
        // Если все слои видимы, скрываем все интерактивные
        // Если есть скрытые слои, показываем все
        const interactiveLayers = [
          'main_building', 'university_buildings', 'dormitory_buildings',
          'lab_buildings', 'library_buildings', 'sport_buildings',
          'museum_buildings', 'cafe_buildings',
          'metro_stations', 'tram_stops', 'bus_stops', 'parking',
          'cafe', 'atm', 'lab', 'museum', 'deanery', 'departments'
        ]
        
        const visibleInteractiveLayers = interactiveLayers.filter(layer => 
          state.visibleLayers.has(layer)
        )
        
        const newVisibleLayers = new Set(state.visibleLayers)
        
        if (visibleInteractiveLayers.length === interactiveLayers.length) {
          // Все слои видимы - скрываем интерактивные
          interactiveLayers.forEach(layer => newVisibleLayers.delete(layer))
        } else {
          // Есть скрытые слои - показываем все
          interactiveLayers.forEach(layer => newVisibleLayers.add(layer))
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
        
        const newVisibleLayers = new Set(state.visibleLayers)
        
        // Скрываем все слои этажей
        state.floorPlan.availableFloors.forEach(floorInfo => {
          newVisibleLayers.delete(floorInfo.layerName)
        })
        
        // Показываем обратно обычные слои зданий (восстанавливаем видимость всех базовых слоев)
        const defaultLayers = [
          'main_building', 'university_buildings', 'dormitory_buildings',
          'lab_buildings', 'library_buildings', 'sport_buildings',
          'museum_buildings', 'cafe_buildings'
        ]
        
        defaultLayers.forEach(layerName => {
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