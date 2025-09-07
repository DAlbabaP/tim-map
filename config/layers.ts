import { AllLayersConfig } from '@/types'
import { MAP_Z_INDEX } from './map'

/**
 * Конфигурация всех слоев карты
 */
export const LAYERS_CONFIG: AllLayersConfig = {
  // Базовые (фоновые) слои - всегда видимы, не интерактивны
  base: {
    // === ПОДЛОЖКА ===
    podlozka: {
      url: 'data/buildings/podlozka_for_map.geojson',
      name: 'Базовая подложка',
      category: 'infrastructure',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS,
      style: {
        fillColor: '#f5f5f5',
        fillOpacity: 1,
        strokeColor: '#d0d0d0',
        strokeWidth: 1
      }
    },

    // === НАТУРАЛЬНЫЕ СЛОИ ===
    water: {
      url: 'data/nature/water.geojson',
      name: 'Водоемы',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 10,
      style: {
        fillColor: '#4fc3f7',
        fillOpacity: 0.8,
        strokeColor: '#4fc3f7',
        strokeWidth: 0
      }
    },

    forest: {
      url: 'data/nature/forest.geojson',
      name: 'Лес',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 11,
      style: {
        fillColor: '#66bb6a',
        fillOpacity: 0.7,
        strokeColor: '#66bb6a',
        strokeWidth: 0
      }
    },

    parks: {
      url: 'data/nature/parks.geojson',
      name: 'Парки',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 3,
      style: {
        fillColor: '#81c784',
        fillOpacity: 0.6,
        strokeColor: '#81c784',
        strokeWidth: 0
      }
    },

    grassland: {
      url: 'data/nature/grassland.geojson',
      name: 'Луга',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 4,
      style: {
        fillColor: '#aed581',
        fillOpacity: 0.5,
        strokeColor: '#aed581',
        strokeWidth: 0
      }
    },

    fields: {
      url: 'data/nature/fields.geojson',
      name: 'Поля',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 5,
      style: {
        fillColor: '#fff176',
        fillOpacity: 0.5,
        strokeColor: '#fff176',
        strokeWidth: 0
      }
    },

    beach: {
      url: 'data/nature/beach.geojson',
      name: 'Пляжи',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 6,
      style: {
        fillColor: '#ffcc80',
        fillOpacity: 0.6,
        strokeColor: '#ffcc80',
        strokeWidth: 0
      }
    },

    greenhouse: {
      url: 'data/nature/greenhouse.geojson',
      name: 'Теплицы',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 7,
      style: {
        fillColor: '#a5d6a7',
        fillOpacity: 0.7,
        strokeColor: '#a5d6a7',
        strokeWidth: 0
      }
    },

    orchdeal: {
      url: 'data/nature/orchdeal.geojson',
      name: 'Сады',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 8,
      style: {
        fillColor: '#c8e6c9',
        fillOpacity: 0.6,
        strokeColor: '#c8e6c9',
        strokeWidth: 0
      }
    },

    pitch: {
      url: 'data/nature/pitch.geojson',
      name: 'Спортивные площадки',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 9,
      style: {
        fillColor: '#ffab91',
        fillOpacity: 0.6,
        strokeColor: '#ffab91',
        strokeWidth: 0
      }
    },

    running_tracks: {
      url: 'data/nature/running_tracks.geojson',
      name: 'Беговые дорожки',
      category: 'nature',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 10,
      style: {
        fillColor: '#f48fb1',
        fillOpacity: 0.6,
        strokeColor: '#f48fb1',
        strokeWidth: 0
      }
    },

    roads: {
      url: 'data/infrastructure/roads.geojson',
      name: 'Дороги',
      category: 'infrastructure',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 11,
      style: {
        fillColor: '#cccccc',
        fillOpacity: 0.5,
        strokeColor: '#cccccc',
        strokeWidth: 0
      }
    },

    railways: {
      url: 'data/infrastructure/railways.geojson',
      name: 'Железные дороги',
      category: 'infrastructure',
      interactive: false,
      zIndex: MAP_Z_INDEX.BASE_LAYERS + 12,
      style: {
        fillColor: '#b0b0b0',
        fillOpacity: 0.5,
        strokeColor: '#b0b0b0',
        strokeWidth: 0
      }
    },

    buildings_in_university: {
      url: 'data/buildings/university/buildings_in_university.geojson',
      name: 'Здания на территории университета',
      category: 'infrastructure',
      interactive: false,
      zIndex: MAP_Z_INDEX.BUILDINGS,
      style: {
        fillColor: '#e0e0e0',
        fillOpacity: 0.6,
        strokeColor: '#e0e0e0',
        strokeWidth: 0
      }
    },

    buildings_for_map: {
      url: 'data/buildings/buildings_for_map.geojson',
      name: 'Здания (внешняя территория)',
      category: 'infrastructure',
      interactive: false,
      zIndex: MAP_Z_INDEX.BUILDINGS,
      style: {
        fillColor: '#dcdcdc',
        fillOpacity: 0.6,
        strokeColor: '#dcdcdc',
        strokeWidth: 0
      }
    }
  },

  // Интерактивные слои - управляются пользователем
  interactive: {
    // === УНИВЕРСИТЕТСКИЕ ЗДАНИЯ ===
    main_building: {
      url: 'data/buildings/university/main_building.geojson',
      name: 'Главное здание',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 10,
      style: {
        fillColor: '#667eea',
        fillOpacity: 0.8,
        strokeColor: '#667eea',
        strokeWidth: 0
      }
    },

    university_buildings: {
      url: 'data/buildings/university/university_buildings.geojson',
      name: 'Учебные здания',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 5,
      style: {
        fillColor: '#e5ec9a',
        fillOpacity: 0.7,
        strokeColor: '#e5ec9a',
        strokeWidth: 0
      }
    },

    dormitory_buildings: {
      url: 'data/buildings/university/dormitory_buildings.geojson',
      name: 'Общежития',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 5,
      style: {
        fillColor: '#ffc166',
        fillOpacity: 0.7,
        strokeColor: '#ffc166',
        strokeWidth: 0
      }
    },

    lab_buildings: {
      url: 'data/buildings/university/lab_buildings.geojson',
      name: 'Лабораторные здания',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 5,
      style: {
        fillColor: '#ab57b9',
        fillOpacity: 0.7,
        strokeColor: '#ab57b9',
        strokeWidth: 0
      }
    },

    library_buildings: {
      url: 'data/buildings/university/library_buildings.geojson',
      name: 'Библиотечные здания',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 5,
      style: {
        fillColor: '#8db3d3',
        fillOpacity: 0.7,
        strokeColor: '#8db3d3',
        strokeWidth: 0
      }
    },

    sport_buildings: {
      url: 'data/buildings/university/sport_buildings.geojson',
      name: 'Спортивные здания',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 5,
      style: {
        fillColor: '#51adf6',
        fillOpacity: 0.7,
        strokeColor: '#51adf6',
        strokeWidth: 0
      }
    },

    museum_buildings: {
      url: 'data/buildings/public/museum_buildings.geojson',
      name: 'Музейные здания',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 5,
      style: {
        fillColor: '#837575',
        fillOpacity: 0.7,
        strokeColor: '#837575',
        strokeWidth: 0
      }
    },

    cafe_buildings: {
      url: 'data/buildings/public/cafe_buildings.geojson',
      name: 'Кафе и рестораны',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 5,
      style: {
        fillColor: '#f99d97',
        fillOpacity: 0.7,
        strokeColor: '#f99d97',
        strokeWidth: 0
      }
    },

    // === ТРАНСПОРТ ===
    metro_stations: {
      url: 'data/transport/metro_stations.geojson',
      name: 'Станции метро',
      category: 'transport',
      interactive: true,
      zIndex: MAP_Z_INDEX.TRANSPORT,
      style: {
        fillColor: '#c7e37c',
        fillOpacity: 1,
        strokeColor: '#aecb60',
        strokeWidth: 3
      }
    },

    metro_platforms: {
      url: 'data/transport/metro_platforms.geojson',
      name: 'Платформы метро',
      category: 'transport',
      interactive: false,
      zIndex: MAP_Z_INDEX.TRANSPORT - 1,
      style: {
        fillColor: '#c7e37c',
        fillOpacity: 0.7,
        strokeColor: '#c7e37c',
        strokeWidth: 0
      }
    },

    tram_stops: {
      url: 'data/transport/tram_stops.geojson',
      name: 'Трамвайные остановки',
      category: 'transport',
      interactive: true,
      zIndex: MAP_Z_INDEX.TRANSPORT,
      style: {
        fillColor: '#f39c12',
        fillOpacity: 0.8,
        strokeColor: '#f39c12',
        strokeWidth: 0
      }
    },

    bus_stops: {
      url: 'data/transport/bus_stops.geojson',
      name: 'Автобусные остановки',
      category: 'transport',
      interactive: true,
      zIndex: MAP_Z_INDEX.TRANSPORT,
      style: {
        fillColor: '#e74c3c',
        fillOpacity: 0.8,
        strokeColor: '#e74c3c',
        strokeWidth: 0
      }
    },

    parking: {
      url: 'data/transport/parking.geojson',
      name: 'Парковки',
      category: 'transport',
      interactive: true,
      zIndex: MAP_Z_INDEX.TRANSPORT,
      // Динамический стиль на основе свойств объекта
      style: (feature) => {
        const opened = feature.get('opened')
        return {
          fillColor: opened ? '#4caf50' : '#bdbdbd',
          fillOpacity: 0.3,
          strokeColor: opened ? '#4caf50' : '#bdbdbd',
          strokeWidth: 0
        }
      }
    },

    // === ТОЧКИ ИНТЕРЕСА (POI) ===
    cafe: {
      url: 'data/poi/cafe.geojson',
      name: 'Кафе',
      category: 'poi',
      interactive: true,
      zIndex: MAP_Z_INDEX.POI,
      style: {
        fillColor: '#f39c12',
        fillOpacity: 1,
        strokeColor: '#b9770e',
        strokeWidth: 2
      }
    },

    atm: {
      url: 'data/poi/atm.geojson',
      name: 'Банкоматы',
      category: 'poi',
      interactive: true,
      zIndex: MAP_Z_INDEX.POI,
      style: {
        fillColor: '#27ae60',
        fillOpacity: 1,
        strokeColor: '#145a32',
        strokeWidth: 2
      }
    },

    lab: {
      url: 'data/poi/lab.geojson',
      name: 'Лаборатории (точки)',
      category: 'poi',
      interactive: true,
      zIndex: MAP_Z_INDEX.POI,
      style: {
        fillColor: '#8e44ad',
        fillOpacity: 1,
        strokeColor: '#5e3370',
        strokeWidth: 2
      }
    },

    museum: {
      url: 'data/poi/museum.geojson',
      name: 'Музеи (точки)',
      category: 'poi',
      interactive: true,
      zIndex: MAP_Z_INDEX.POI,
      style: {
        fillColor: '#2980b9',
        fillOpacity: 1,
        strokeColor: '#154360',
        strokeWidth: 2
      }
    },

    deanery: {
      url: 'data/poi/deanery.geojson',
      name: 'Деканаты',
      category: 'poi',
      interactive: true,
      zIndex: MAP_Z_INDEX.POI,
      style: {
        fillColor: '#e67e22',
        fillOpacity: 1,
        strokeColor: '#a04000',
        strokeWidth: 2
      }
    },

    departments: {
      url: 'data/poi/departments.geojson',
      name: 'Кафедры',
      category: 'poi',
      interactive: true,
      zIndex: MAP_Z_INDEX.POI,
      style: {
        fillColor: '#9b59b6',
        fillOpacity: 1,
        strokeColor: '#8e44ad',
        strokeWidth: 2
      }
    }
  },

  // Поэтажные планы - загружаются только по требованию
  floorPlans: {
    korpus1_level0: {
      url: 'data/buildings/university/1korpus/korpus1_level0.geojson',
      name: 'Цоколь / подвал — 1 корпус',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 20,
      style: {
        fillColor: '#ffe082',
        fillOpacity: 0.6,
        strokeColor: '#ffca28',
        strokeWidth: 2
      }
    },

    korpus1_level1: {
      url: 'data/buildings/university/1korpus/korpus1_level1.geojson',
      name: '1-й этаж — 1 корпус',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 21,
      style: {
        fillColor: '#ffd54f',
        fillOpacity: 0.65,
        strokeColor: '#ffa000',
        strokeWidth: 2
      }
    },

    korpus1_level2: {
      url: 'data/buildings/university/1korpus/korpus1_level2.geojson',
      name: '2-й этаж — 1 корпус',
      category: 'university',
      interactive: true,
      zIndex: MAP_Z_INDEX.BUILDINGS + 22,
      style: {
        fillColor: '#ffca28',
        fillOpacity: 0.65,
        strokeColor: '#ffb300',
        strokeWidth: 2
      }
    }
  }
}

/**
 * Слои, которые включены по умолчанию
 */
export const DEFAULT_VISIBLE_LAYERS = [
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

/**
 * Слои POI (выключены по умолчанию)
 */
export const POI_LAYERS = [
  'cafe',
  'atm', 
  'lab',
  'museum',
  'deanery',
  'departments'
]

/**
 * Конфигурация поэтажных планов зданий
 */
export interface FloorPlanConfig {
  buildingId: string
  buildingName: string
  buildingLayers: string[]  // Слои зданий, при клике на которые показывать поэтажный план
  floors: Array<{
    level: number
    name: string
    layerName: string
  }>
}

/**
 * Массив конфигураций поэтажных планов
 */
export const FLOOR_PLANS: FloorPlanConfig[] = [
  {
    buildingId: 'korpus1',
    buildingName: 'Главный корпус (1 корпус)',
    buildingLayers: ['main_building'], // Убрали university_buildings
    floors: [
      {
        level: 0,
        name: 'Цоколь / подвал',
        layerName: 'korpus1_level0'
      },
      {
        level: 1,
        name: '1-й этаж',
        layerName: 'korpus1_level1'
      },
      {
        level: 2,
        name: '2-й этаж',
        layerName: 'korpus1_level2'
      }
    ]
  }
  // Добавьте здесь другие здания с поэтажными планами
]

/**
 * Функция для получения конфигурации поэтажного плана по слою здания
 */
export function getFloorPlanByLayer(layerName: string): FloorPlanConfig | null {
  return FLOOR_PLANS.find(config => 
    config.buildingLayers.includes(layerName)
  ) || null
}

/**
 * Функция для проверки, есть ли у здания поэтажный план
 */
export function hasFloorPlan(layerName: string): boolean {
  return FLOOR_PLANS.some(config =>
    config.buildingLayers.includes(layerName)
  )
}

/**
 * Зоны корпусов для определения принадлежности POI
 * Координаты определяют границы каждого корпуса
 */
const BUILDING_ZONES = {
  korpus1: {
    minLon: 37.548, maxLon: 37.558,
    minLat: 55.831, maxLat: 55.836
  },
  // Добавьте зоны для других корпусов по мере необходимости
  // korpus2: { minLon: ..., maxLon: ..., minLat: ..., maxLat: ... }
}

/**
 * Функция для определения корпуса по координатам точки
 */
function getBuildingByCoordinates(lon: number, lat: number): string | null {
  for (const [buildingId, zone] of Object.entries(BUILDING_ZONES)) {
    if (lon >= zone.minLon && lon <= zone.maxLon &&
        lat >= zone.minLat && lat <= zone.maxLat) {
      return buildingId
    }
  }
  return null
}

/**
 * Функция для определения корпуса по свойствам здания или POI
 */
export function getBuildingByFeature(feature: any, layerName: string): FloorPlanConfig | null {
  // Для main_building всегда возвращаем план корпуса 1
  if (layerName === 'main_building') {
    return FLOOR_PLANS.find(config => config.buildingId === 'korpus1') || null
  }

  // Для university_buildings пытаемся определить корпус по свойствам или координатам
  if (layerName === 'university_buildings') {
    const properties = feature?.getProperties?.() || feature?.properties || {}

    // Проверяем название или описание
    const name = properties.name || properties.title || ''
    const description = properties.description || ''

    // Определяем корпус по названию или описанию
    if (name.toLowerCase().includes('корпус 1') || name.toLowerCase().includes('главный корпус') ||
        description.toLowerCase().includes('корпус 1') || description.toLowerCase().includes('главный корпус')) {
      return FLOOR_PLANS.find(config => config.buildingId === 'korpus1') || null
    }

    // Пытаемся определить по координатам геометрии
    const geometry = feature?.getGeometry?.()
    if (geometry) {
      try {
        const coordinates = geometry.getCoordinates()
        if (coordinates && coordinates.length > 0) {
          // Для точки берем координаты напрямую
          if (typeof coordinates[0] === 'number') {
            const [lon, lat] = coordinates
            const buildingId = getBuildingByCoordinates(lon, lat)
            if (buildingId) {
              return FLOOR_PLANS.find(config => config.buildingId === buildingId) || null
            }
          }
          // Для полигона берем первую точку
          else if (coordinates[0] && coordinates[0][0] && typeof coordinates[0][0][0] === 'number') {
            const [lon, lat] = coordinates[0][0]
            const buildingId = getBuildingByCoordinates(lon, lat)
            if (buildingId) {
              return FLOOR_PLANS.find(config => config.buildingId === buildingId) || null
            }
          }
        }
      } catch (error) {
        console.warn('Ошибка определения корпуса по координатам:', error)
      }
    }

    // Если не можем определить корпус, возвращаем null (нет поэтажного плана)
    return null
  }

  return null
} 