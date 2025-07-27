'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Layers, 
  Bus, 
  GraduationCap, 
  Coffee,
  Star,
  MapPin,
  Building2
} from 'lucide-react'
import { useCategoryPanel, useMobileState } from '@/stores/panelStore'
import { useMapStore, useVisibleLayers } from '@/stores/mapStore'
import { CATEGORIES_CONFIG, CATEGORIES_ORDER } from '@/config/categories'
import { LAYERS_CONFIG } from '@/config/layers'

// Конфигурация вкладок категорий (как в старой версии)
const CATEGORY_TABS = {
  university: {
    id: 'university',
    name: 'Университет',
    icon: GraduationCap,
    color: '#667eea',
    layers: ['main_building', 'university_buildings', 'dormitory_buildings', 'lab_buildings', 'library_buildings', 'sport_buildings']
  },
  transport: {
    id: 'transport', 
    name: 'Транспорт',
    icon: Bus,
    color: '#f39c12',
    layers: ['metro_stations', 'tram_stops', 'bus_stops', 'parking']
  },
  poi: {
    id: 'poi',
    name: 'Сервисы',
    icon: Coffee,
    color: '#e91e63',
    layers: ['cafe', 'atm', 'museum_buildings', 'cafe_buildings']
  },
  main: {
    id: 'main',
    name: 'Главное',
    icon: Star,
    color: '#ffc107',
    layers: ['main_building', 'deanery', 'departments']
  }
} as const

type CategoryTabId = keyof typeof CATEGORY_TABS

interface CategoryPanelProps {
  isOpen: boolean
}

export function CategoryPanel({ isOpen }: CategoryPanelProps) {
  const [activeTab, setActiveTab] = useState<CategoryTabId>('university')
  const { setOpen } = useCategoryPanel()
  const { isMobile } = useMobileState()
  const { toggleLayerVisibility, toggleAllLayers } = useMapStore()
  const visibleLayers = useVisibleLayers()

  // Получаем слои активной вкладки
  const getActiveTabLayers = () => {
    const tab = CATEGORY_TABS[activeTab]
    return tab.layers.filter(layerName => 
      LAYERS_CONFIG.interactive[layerName] || LAYERS_CONFIG.base[layerName]
    )
  }

  // Подсчет видимых слоев для активной вкладки
  const getTabStats = () => {
    const layers = getActiveTabLayers()
    const visible = layers.filter(name => visibleLayers.has(name)).length
    return { visible, total: layers.length }
  }

  // Подсчет общего количества видимых слоев
  const totalStats = () => {
    const allInteractiveLayers = Object.keys(LAYERS_CONFIG.interactive)
    const visible = allInteractiveLayers.filter(name => visibleLayers.has(name)).length
    return { visible, total: allInteractiveLayers.length }
  }

  // Обработка клика вне панели на мобильных
  useEffect(() => {
    if (!isMobile || !isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('#category-panel') && !target.closest('[data-mobile-menu-trigger]')) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile, isOpen, setOpen])

  if (!isOpen && !isMobile) return null

  const stats = totalStats()
  const tabStats = getTabStats()
  const activeTabConfig = CATEGORY_TABS[activeTab]

  return (
    <>
      {/* Оверлей для мобильных */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-panel bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Панель */}
      <motion.aside
        id="category-panel"
        initial={isMobile ? { x: '-100%' } : { width: 0 }}
        animate={isMobile ? { x: isOpen ? 0 : '-100%' } : { width: isOpen ? 420 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`panel-base fixed left-0 top-header bottom-0 z-panel w-panel max-w-panel-mobile overflow-hidden ${
          isMobile ? 'md:relative md:top-0' : ''
        }`}
      >
        {/* Заголовок панели */}
        <div className="panel-header">
          <h3 className="flex items-center gap-2 font-title text-lg font-semibold">
            <Layers className="h-5 w-5" />
            Категории объектов
          </h3>
          
          <div className="flex items-center gap-2">
            {/* Счетчик */}
            <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium">
              {stats.visible}/{stats.total}
            </span>
            
            {/* Кнопка "Показать/скрыть все" */}
            <button
              onClick={toggleAllLayers}
              className="rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              title={stats.visible === stats.total ? 'Скрыть все слои' : 'Показать все слои'}
            >
              {stats.visible === stats.total ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Вкладки категорий */}
        <div className="bg-university-panel border-b border-university-panel-border">
          <div className="flex overflow-x-auto">
            {Object.values(CATEGORY_TABS).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 max-w-[100px] px-2 py-4 flex flex-col items-center justify-center transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-university-primary-dark text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? tab.color : undefined
                }}
              >
                <tab.icon className="h-8 w-8 mb-2" />
                <span className="text-xs font-medium text-center leading-tight">
                  {tab.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Содержимое панели - слои активной вкладки */}
        <div className="panel-content custom-scrollbar p-2">
          {/* Счетчик для активной вкладки */}
          <div className="mb-4 p-3 bg-white rounded-lg border border-university-panel-border">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{activeTabConfig.name}</span>
              <span className="text-sm bg-university-primary text-white px-2 py-1 rounded-full">
                {tabStats.visible}/{tabStats.total}
              </span>
            </div>
          </div>

          {/* Список слоев */}
          <div className="space-y-2">
            {getActiveTabLayers().map((layerName) => {
              const layerConfig = LAYERS_CONFIG.interactive[layerName] || LAYERS_CONFIG.base[layerName]
              if (!layerConfig) return null

              const isVisible = visibleLayers.has(layerName)
              
              return (
                <LayerCard
                  key={layerName}
                  layerName={layerName}
                  layerConfig={layerConfig}
                  isVisible={isVisible}
                  onToggle={() => toggleLayerVisibility(layerName)}
                />
              )
            })}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

// Компонент карточки слоя (в стиле дизайна)
interface LayerCardProps {
  layerName: string
  layerConfig: any
  isVisible: boolean
  onToggle: () => void
}

function LayerCard({ layerName, layerConfig, isVisible, onToggle }: LayerCardProps) {
  return (
    <div className="bg-university-panel rounded-xl p-3 border border-university-panel-border shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        {/* Иконка */}
        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600">
          <Building2 className="h-5 w-5" />
        </div>

        {/* Информация о слое */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {layerConfig.name || layerName}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {layerConfig.description || 'Слой карты'}
          </p>
        </div>

        {/* Переключатель */}
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-university-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-university-primary peer-focus:ring-offset-2">
          </div>
        </label>
      </div>

      {/* Индикатор активности */}
      {isVisible && (
        <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-university-primary rounded-full transition-all duration-300" />
        </div>
      )}
    </div>
  )
} 