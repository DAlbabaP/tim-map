// Основные типы для интерактивной карты университета

// Базовые типы React (временная заглушка)
export type ReactNode = any

// Базовые типы для OpenLayers (будут определены позже при инициализации)
export type OLFeature = any
export type OLGeometry = any
export type OLStyle = any

// =============================================================================
// Базовые типы карты
// =============================================================================

export interface MapConfig {
  center: [number, number]
  zoom: number
  minZoom: number
  maxZoom: number
  extent: [number, number, number, number]
  tileLayer: {
    url: string
    fallbackUrl?: string
    attribution: string
  }
}

export interface StyleConfig {
  fillColor: string
  fillOpacity: number
  strokeColor: string
  strokeWidth: number
}

export type StyleFunction = (feature: OLFeature) => OLStyle

// =============================================================================
// Конфигурация слоев
// =============================================================================

export interface LayerInfo {
  name: string
  title: string
  icon: string
}

export interface LayerConfig {
  url: string
  name: string
  category: CategoryType
  interactive: boolean
  zIndex?: number
  style: StyleConfig | StyleFunction
}

export interface LayerGroup {
  [key: string]: LayerConfig
}

export interface AllLayersConfig {
  base: LayerGroup
  interactive: LayerGroup
  floorPlans: LayerGroup
}

// =============================================================================
// Категории и их конфигурация
// =============================================================================

export type CategoryType = 'university' | 'transport' | 'poi' | 'nature' | 'infrastructure'

export interface CategoryConfig {
  name: string
  icon: string
  color: string
  layers: LayerInfo[]
}

export type CategoriesConfig = {
  [K in CategoryType]: CategoryConfig
}

export type CategoryPanelConfig = {
  university: CategoryConfig
  transport: CategoryConfig
  poi: CategoryConfig
}

// =============================================================================
// Поиск
// =============================================================================

export interface SearchSettings {
  minQueryLength: number
  maxResults: number
  debounceTime: number
  maxHistoryItems: number
  fuzzySearchThreshold: number
  enableHistory: boolean
  enableSuggestions: boolean
  enableFilters: boolean
  enableQuickActions: boolean
  highlightMatches: boolean
  showResultCount: boolean
  groupResultsByCategory: boolean
}

export interface SearchField {
  field: string
  weight: number
  description: string
}

export interface SearchFields {
  primary: SearchField[]
  secondary: SearchField[]
  additional: SearchField[]
}

export interface SearchFilter {
  id: string
  label: string
  description: string
  icon: string
  color?: string
  default?: boolean
  layers: string[] | "*"
}

export interface QuickSearch {
  text: string
  icon: string
  query: string
  filter: string
  description: string
}

export interface CategoryMapping {
  name: string
  icon: string
  color: string
}

export interface SearchUI {
  placeholder: string
  noResultsMessage: string
  loadingMessage: string
  errorMessage: string
  historyTitle: string
  quickActionsTitle: string
  suggestionsTitle: string
  clearHistoryText: string
  showMoreText: string
  showLessText: string
}

export interface SearchConfig {
  version: string
  description: string
  settings: SearchSettings
  searchFields: SearchFields
  filters: SearchFilter[]
  suggestions: {
    enabled: boolean
    maxSuggestions: number
    showIcons: boolean
    showCategory: boolean
    showDistance: boolean
    groupByCategory: boolean
    highlightMatches: boolean
    showQuickActions: boolean
  }
  quickSearches: QuickSearch[]
  categoryMappings: Record<string, CategoryMapping>
  popularQueries: string[]
  synonyms: Record<string, string[]>
  stopWords: string[]
  ui: SearchUI
  analytics: {
    enabled: boolean
    trackQueries: boolean
    trackClicks: boolean
    trackFilters: boolean
    trackHistory: boolean
  }
}

// =============================================================================
// Отображение полей объектов
// =============================================================================

export type FieldType = 'text' | 'contact' | 'list' | 'boolean' | 'currency' | 'image'
export type FieldSection = 'basic' | 'contact' | 'rooms' | 'staff'

export interface FieldDisplayConfig {
  label: string
  icon: string
  priority: number
  type?: FieldType
  section?: FieldSection
}

export type FieldsDisplayConfig = Record<string, FieldDisplayConfig>

// =============================================================================
// GeoJSON объекты и их свойства
// =============================================================================

export interface BaseObjectProperties {
  name?: string
  title?: string
  address?: string
  description?: string
  phone?: string
  email?: string
  website?: string
  working_hours?: string
  image_path?: string
  id?: string | number
}

export interface BuildingProperties extends BaseObjectProperties {
  building_number?: string
  year_built?: string
  floors?: number
  capacity?: number
  services?: string[]
  faculties?: string[]
  departments?: string[]
  room_numbers?: string[]
  has_cafeteria?: boolean
  has_library?: boolean
  has_computer_lab?: boolean
  has_wifi?: boolean
  has_medical?: boolean
  has_parking?: boolean
  has_reception?: boolean
}

export interface DormitoryProperties extends BuildingProperties {
  total_places?: number
  available_places?: number
  cost_per_month?: number
  safety_level?: string
}

export interface TransportProperties extends BaseObjectProperties {
  routes?: string[]
  schedule?: string
  type?: 'metro' | 'bus' | 'tram'
}

export interface POIProperties extends BaseObjectProperties {
  head?: string
  head_photo?: string
  room?: string
  rooms?: string[]
  floor?: string
  has_administrations?: boolean
  administration_name?: string
  administration_phone?: string
  administration_hours?: string
  administration_website?: string
  reception_hours?: string
  equipment_list?: string[]
}

export type ObjectProperties = 
  | BaseObjectProperties 
  | BuildingProperties 
  | DormitoryProperties 
  | TransportProperties 
  | POIProperties

// =============================================================================
// Состояние приложения
// =============================================================================

export interface AppState {
  mapInitialized: boolean
  selectedObject: OLFeature | null
  visibleLayers: Set<string>
  searchQuery: string
  searchResults: SearchResult[]
  panelsState: {
    categoryPanel: boolean
    infoPanel: boolean
  }
  userLocation: [number, number] | null
}

export interface SearchResult {
  feature: OLFeature
  layer: string
  category: CategoryType
  score: number
  matchedFields: string[]
}

// =============================================================================
// Компоненты UI
// =============================================================================

export interface PanelProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export interface MapControlProps {
  onClick: () => void
  title: string
  icon: ReactNode
  disabled?: boolean
}

export interface SearchProps {
  onSearch: (query: string) => void
  onResultSelect: (result: SearchResult) => void
  placeholder?: string
}

// =============================================================================
// Утилиты
// =============================================================================

export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

export type Theme = 'light' | 'dark' | 'auto'

export interface UserPreferences {
  theme: Theme
  language: 'ru' | 'en'
  defaultZoom: number
  enableNotifications: boolean
  enableGeolocation: boolean
  favoriteLocations: string[]
} 