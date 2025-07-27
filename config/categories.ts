import { CategoryPanelConfig } from '@/types'

/**
 * Конфигурация категорий объектов на карте
 */
export const CATEGORIES_CONFIG: CategoryPanelConfig = {
  university: {
    name: 'Университетские здания',
    icon: 'graduation-cap',
    color: '#667eea',
    layers: [
      { name: 'main_building', title: 'Главное здание', icon: 'building' },
      { name: 'university_buildings', title: 'Учебные здания', icon: 'school' },
      { name: 'dormitory_buildings', title: 'Общежития', icon: 'home' },
      { name: 'lab_buildings', title: 'Лаборатории', icon: 'flask' },
      { name: 'library_buildings', title: 'Библиотеки', icon: 'book' },
      { name: 'sport_buildings', title: 'Спортивные объекты', icon: 'dumbbell' },
      { name: 'museum_buildings', title: 'Музеи', icon: 'landmark' },
      { name: 'cafe_buildings', title: 'Кафе и рестораны', icon: 'coffee' }
    ]
  },

  transport: {
    name: 'Транспорт',
    icon: 'bus',
    color: '#f39c12',
    layers: [
      { name: 'metro_stations', title: 'Станции метро', icon: 'train' },
      { name: 'tram_stops', title: 'Трамвайные остановки', icon: 'tram' },
      { name: 'bus_stops', title: 'Автобусные остановки', icon: 'bus' },
      { name: 'parking', title: 'Парковки', icon: 'car' }
    ]
  },

  poi: {
    name: 'Точки интереса',
    icon: 'star',
    color: '#8e44ad',
    layers: [
      { name: 'cafe', title: 'Кафе', icon: 'coffee' },
      { name: 'atm', title: 'Банкоматы', icon: 'credit-card' },
      { name: 'lab', title: 'Лаборатории (точки)', icon: 'flask' },
      { name: 'museum', title: 'Музеи (точки)', icon: 'landmark' },
      { name: 'deanery', title: 'Деканаты', icon: 'user-tie' },
      { name: 'departments', title: 'Кафедры', icon: 'users' }
    ]
  },


}

/**
 * Порядок отображения категорий в интерфейсе
 */
export const CATEGORIES_ORDER = [
  'university',
  'transport', 
  'poi',
  'nature',
  'infrastructure'
] as const

/**
 * Категории, которые включены по умолчанию
 */
export const DEFAULT_VISIBLE_CATEGORIES = [
  'university',
  'transport'
] as const 