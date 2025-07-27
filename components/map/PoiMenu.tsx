'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  Coffee, 
  Landmark, 
  FlaskConical, 
  BookOpen, 
  Dumbbell, 
  Bed,
  DollarSign,
  UserCheck,
  GraduationCap,
  Train,
  MapPin,
  Star,
  Plus
} from 'lucide-react'

// Конфигурация иконок для разных типов POI (из старой версии)
const POI_ICONS_CONFIG = {
  building: { icon: Building2, bg: '#e5ec9a' },
  university: { icon: Building2, bg: '#b9be7d' },
  dormitory: { icon: Bed, bg: '#ffc166' },
  lab: { icon: FlaskConical, bg: '#ab57b9' },
  library: { icon: BookOpen, bg: '#8db3d3' },
  sport: { icon: Dumbbell, bg: '#51adf6' },
  museum: { icon: Landmark, bg: '#837575' },
  cafe: { icon: Coffee, bg: '#f99d97' },
  main: { icon: Star, bg: '#667eea' },
  atm: { icon: DollarSign, bg: '#1E8449' },
  deanery: { icon: UserCheck, bg: '#B9770E' },
  departments: { icon: GraduationCap, bg: '#9b59b6' },
  tram_stops: { icon: Train, bg: '#F39C12' },
  default: { icon: MapPin, bg: '#666' }
}

interface PoiMenuItem {
  id: string
  layerName: string
  name: string
  type: string
}

interface PoiMenuProps {
  isVisible: boolean
  position: [number, number] | null
  buildingFeature: any
  buildingLayer: string
  poiItems: PoiMenuItem[]
  onItemClick: (id: string, layerName: string) => void
  onClose: () => void
}

export function PoiMenu({ 
  isVisible, 
  position, 
  buildingFeature, 
  buildingLayer, 
  poiItems, 
  onItemClick, 
  onClose 
}: PoiMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Определяем категорию здания по имени слоя (логика из старой версии)
  const getBuildingCategory = (layerName: string): string => {
    if (!layerName) return 'building'
    if (layerName.endsWith('_buildings')) return layerName.replace('_buildings', '')
    if (layerName.endsWith('_building')) return layerName.replace('_building', '')
    return layerName || 'building'
  }

  const buildingCategory = getBuildingCategory(buildingLayer)
  const buildingConfig = POI_ICONS_CONFIG[buildingCategory as keyof typeof POI_ICONS_CONFIG] || POI_ICONS_CONFIG.default

  // Фильтруем POI, исключая тип здания
  const filteredPoiItems = poiItems.filter(item => item.layerName !== buildingCategory)
  
  // Показываем максимум 2 POI в свернутом виде
  const maxVisibleItems = 2
  const visibleItems = isExpanded ? filteredPoiItems : filteredPoiItems.slice(0, maxVisibleItems)
  const remainingCount = filteredPoiItems.length - maxVisibleItems

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isVisible) {
      setIsExpanded(false)
      setSelectedItem('')
    } else {
      // Здание выбрано по умолчанию
      const buildingId = buildingFeature?.getId?.() || buildingFeature?.get?.('id') || ''
      setSelectedItem(buildingId)
    }
  }, [isVisible, buildingFeature])

  const handleItemClick = (id: string, layerName: string) => {
    setSelectedItem(id)
    onItemClick(id, layerName)
  }

  const handleBuildingClick = () => {
    const buildingId = buildingFeature?.getId?.() || buildingFeature?.get?.('id') || ''
    handleItemClick(buildingId, buildingLayer)
  }

  const handleExpandClick = () => {
    setIsExpanded(true)
  }

  if (!isVisible || !position) return null

  // Вычисляем количество колонок для expanded режима
  const totalItems = 1 + filteredPoiItems.length // здание + все POI
  const expandedColumns = Math.ceil(totalItems / 2)

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed pointer-events-none z-[1000]"
          style={{
            left: position[0],
            top: position[1],
            transform: 'translate(-50%, -100%)'
          }}
        >
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto relative"
          >
            {/* Основное меню */}
            <div 
              className={`poi-menu-grid bg-university-panel border-4 border-university-panel-border rounded-lg p-1.5 shadow-lg relative ${
                isExpanded ? 'poi-menu-expanded' : ''
              }`}
              style={{
                display: 'grid',
                gridTemplateColumns: isExpanded 
                  ? `repeat(${expandedColumns}, 48px)` 
                  : 'repeat(2, 48px)',
                gridAutoRows: '48px',
                gap: '6px'
              }}
            >
              {/* Плитка здания */}
              <PoiTile
                icon={buildingConfig.icon}
                backgroundColor={buildingConfig.bg}
                isSelected={selectedItem === (buildingFeature?.getId?.() || buildingFeature?.get?.('id') || '')}
                onClick={handleBuildingClick}
                title="Здание"
              />

              {/* Плитки POI */}
              {visibleItems.map((item) => {
                const config = POI_ICONS_CONFIG[item.layerName as keyof typeof POI_ICONS_CONFIG] || POI_ICONS_CONFIG.default
                return (
                  <PoiTile
                    key={item.id}
                    icon={config.icon}
                    backgroundColor={config.bg}
                    isSelected={selectedItem === item.id}
                    onClick={() => handleItemClick(item.id, item.layerName)}
                    title={item.name}
                  />
                )
              })}

              {/* Кнопка "еще" */}
              {!isExpanded && remainingCount > 0 && (
                <PoiTile
                  icon={Plus}
                  backgroundColor="#CBC5B9"
                  isSelected={false}
                  onClick={handleExpandClick}
                  label={`+${remainingCount}`}
                  title={`Показать еще ${remainingCount}`}
                />
              )}
            </div>

            {/* Стрелка вниз */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div 
                className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent"
                style={{ borderTopColor: '#CBC5B9' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Компонент отдельной плитки POI
interface PoiTileProps {
  icon: React.ComponentType<any>
  backgroundColor: string
  isSelected: boolean
  onClick: () => void
  title?: string
  label?: string
}

function PoiTile({ icon: Icon, backgroundColor, isSelected, onClick, title, label }: PoiTileProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, filter: 'brightness(1.08)' }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center justify-center w-12 h-12 rounded-md text-white text-xl
        cursor-pointer select-none transition-all duration-200 focus:outline-none
        ${isSelected 
          ? 'ring-2 ring-gray-800 ring-offset-2 ring-offset-university-panel shadow-lg' 
          : 'hover:shadow-md'
        }
      `}
      style={{ backgroundColor }}
      title={title}
    >
      {label ? (
        <span className="text-gray-800 font-bold text-sm">{label}</span>
      ) : (
        <Icon className="h-5 w-5" />
      )}
    </motion.button>
  )
} 