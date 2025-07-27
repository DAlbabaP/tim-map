// Центральный экспорт всех конфигураций

export { MAP_CONFIG, MAP_ANIMATIONS, MAP_INTERACTIONS, MAP_Z_INDEX } from './map'
export { CATEGORIES_CONFIG, CATEGORIES_ORDER, DEFAULT_VISIBLE_CATEGORIES } from './categories'
export { LAYERS_CONFIG, DEFAULT_VISIBLE_LAYERS, POI_LAYERS } from './layers'
export { SEARCH_CONFIG } from './search'
export { FIELDS_DISPLAY_CONFIG, FIELD_SECTIONS, PRIORITY_FIELDS, HIDDEN_BY_DEFAULT_FIELDS } from './fields'
export { LOADING_FACTS, MOTIVATIONAL_MESSAGES, getRandomFact, getRandomMotivationalMessage } from './facts'

/**
 * Общие константы приложения
 */
export const APP_CONFIG = {
  name: 'ТимМап',
  version: '2.0.0',
  description: 'Современная интерактивная карта университета',
  author: 'Команда ТимМап',
  repository: 'https://github.com/university/interactive-map',
  
  // Настройки производительности
  performance: {
    enableServiceWorker: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enablePrefetching: true
  },
  
  // Настройки безопасности
  security: {
    enableCSP: true,
    enableXSSProtection: true,
    enableClickjacking: true
  },
  
  // Настройки аналитики
  analytics: {
    enabled: false, // Включить в продакшене
    trackPageViews: true,
    trackUserInteractions: true,
    trackPerformance: true
  }
} as const

/**
 * Константы для локального хранилища
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'university-map-preferences',
  SEARCH_HISTORY: 'university-map-search-history', 
  VISIBLE_LAYERS: 'university-map-visible-layers',
  MAP_STATE: 'university-map-state',
  TOUR_COMPLETED: 'university-map-tour-completed'
} as const

/**
 * Константы для событий
 */
export const EVENTS = {
  MAP_READY: 'map:ready',
  LAYER_LOADED: 'layer:loaded',
  OBJECT_SELECTED: 'object:selected',
  SEARCH_PERFORMED: 'search:performed',
  PANEL_TOGGLED: 'panel:toggled'
} as const

/**
 * Брейкпоинты для адаптивности
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const 