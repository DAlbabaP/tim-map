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
        strokeColor: '#29b6f6',
        strokeWidth: 1
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
        strokeColor: '#4caf50',
        strokeWidth: 1
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
        strokeColor: '#66bb6a',
        strokeWidth: 1
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
        strokeColor: '#9ccc65',
        strokeWidth: 1
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
        strokeColor: '#ffeb3b',
        strokeWidth: 1
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
        strokeColor: '#ffb74d',
        strokeWidth: 1
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
        strokeColor: '#81c784',
        strokeWidth: 1
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
        strokeColor: '#a5d6a7',
        strokeWidth: 1
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
        strokeColor: '#ff8a65',
        strokeWidth: 1
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
        strokeColor: '#f06292',
        strokeWidth: 2
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
        strokeColor: '#888888',
        strokeWidth: 2
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
        strokeColor: '#555555',
        strokeWidth: 2
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
        strokeColor: '#b0b0b0',
        strokeWidth: 1
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
        strokeColor: '#b8b8b8',
        strokeWidth: 1
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
        strokeColor: '#4834d4',
        strokeWidth: 2
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
        strokeColor: '#aeb56a',
        strokeWidth: 2
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
        strokeColor: '#d3b589',
        strokeWidth: 2
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
        strokeWidth: 2
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
        strokeColor: '#7aa3c5',
        strokeWidth: 2
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
        strokeColor: '#548cb9',
        strokeWidth: 2
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
        strokeColor: '#685d5d',
        strokeWidth: 2
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
        strokeColor: '#c27e7a',
        strokeWidth: 2
      }
    },

    // === ДЕТАЛЬНЫЕ ПЛАНЫ КОРПУСОВ ===
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
        strokeColor: '#aecb60',
        strokeWidth: 2
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
        strokeColor: '#d35400',
        strokeWidth: 2
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
        strokeColor: '#c0392b',
        strokeWidth: 2
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
          strokeColor: opened ? '#388e3c' : '#757575',
          strokeWidth: 2
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
    buildingLayers: ['main_building', 'university_buildings'],
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