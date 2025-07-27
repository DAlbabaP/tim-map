import { MapConfig } from '@/types'

/**
 * Основная конфигурация карты университета
 */
export const MAP_CONFIG: MapConfig = {
  // Центр карты (координаты университета в Web Mercator)
  center: [4180050.855075, 7525234.989304],
  
  // Начальный зум
  zoom: 16,
  
  // Минимальный и максимальный зум
  minZoom: 10,
  maxZoom: 22,
  
  // Ограничения области просмотра (extent)
  extent: [
    4178160.232953, 7523183.132826,
    4184030.491387, 7527095.0892833
  ],
  
  // Конфигурация базового слоя
  tileLayer: {
    url: 'tiles/podlozka_for_map/{z}/{x}/{y}.png',
    fallbackUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© Карта университета | © OpenStreetMap contributors'
  }
}

/**
 * Константы для анимаций карты
 */
export const MAP_ANIMATIONS = {
  PAN_DURATION: 500,
  ZOOM_DURATION: 300,
  FIT_DURATION: 1000,
  HIGHLIGHT_DURATION: 2000
} as const

/**
 * Настройки взаимодействия с картой
 */
export const MAP_INTERACTIONS = {
  DOUBLE_CLICK_ZOOM: true,
  DRAG_PAN: true,
  KEYBOARD_PAN: true,
  KEYBOARD_ZOOM: true,
  MOUSE_WHEEL_ZOOM: true,
  PINCH_ROTATE: true,
  PINCH_ZOOM: true
} as const

/**
 * Z-индексы слоев карты
 */
export const MAP_Z_INDEX = {
  BASE_LAYERS: -20,
  BUILDINGS: 100,
  TRANSPORT: 200,
  POI: 1000,
  HIGHLIGHT: 2000,
  USER_LOCATION: 3000
} as const 