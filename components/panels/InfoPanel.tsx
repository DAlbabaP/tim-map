'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Phone, Mail, Globe, Clock, User, Building2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useInfoPanel, useMobileState } from '@/stores/panelStore'
import { useSelectedFeature } from '@/stores/mapStore'
import { FIELDS_DISPLAY_CONFIG, FIELD_SECTIONS } from '@/config/fields'
import { SEARCH_CONFIG } from '@/config/search'

interface InfoPanelProps {
  isOpen: boolean
}

export function InfoPanel({ isOpen }: InfoPanelProps) {
  const { setOpen } = useInfoPanel()
  const { isMobile } = useMobileState()
  const { feature, layer } = useSelectedFeature()
  const [activeSection, setActiveSection] = useState<string>('basic')

  // Закрываем панель если нет выбранного объекта
  useEffect(() => {
    if (!feature && isOpen) {
      setOpen(false)
    }
  }, [feature, isOpen, setOpen])

  // Обработка клика вне панели на мобильных
  useEffect(() => {
    if (!isMobile || !isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('#info-panel')) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile, isOpen, setOpen])

  if (!isOpen || !feature) return null

  const properties = feature.getProperties()
  const categoryMapping = layer ? SEARCH_CONFIG.categoryMappings[layer] : null

  // Группировка полей по секциям
  const groupedFields = Object.entries(properties)
    .filter(([key, value]) => {
      // Фильтруем технические поля OpenLayers
      if (key === 'geometry') return false
      if (key.startsWith('osm_')) return false
      return value !== null && value !== undefined && value !== ''
    })
    .map(([key, value]) => ({
      key,
      value,
      config: FIELDS_DISPLAY_CONFIG[key] || {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        icon: 'info',
        priority: 999
      }
    }))
    .sort((a, b) => a.config.priority - b.config.priority)
    .reduce((acc, field) => {
      const section = field.config.section || 'basic'
      if (!acc[section]) acc[section] = []
      acc[section].push(field)
      return acc
    }, {} as Record<string, Array<{ key: string; value: any; config: any }>>)

  const availableSections = Object.keys(groupedFields)

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
        id="info-panel"
        initial={isMobile ? { y: '100%' } : { x: '100%' }}
        animate={isMobile ? { y: isOpen ? 0 : '100%' } : { x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`panel-base fixed z-panel overflow-hidden ${
          isMobile 
            ? 'bottom-0 left-0 right-0 top-auto h-3/4 max-h-[75vh] rounded-t-lg'
            : 'right-0 top-header bottom-0 w-96 max-w-[90vw]'
        }`}
      >
        {/* Заголовок панели */}
        <div className="panel-header">
          <div className="flex items-center gap-2 min-w-0">
            {categoryMapping && (
              <div 
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: categoryMapping.color }}
              >
                <MapPin className="h-3 w-3" />
              </div>
            )}
            <h3 className="font-title text-lg font-semibold truncate">
              {properties.name || properties.title || 'Информация об объекте'}
            </h3>
          </div>
          
          <button
            onClick={() => setOpen(false)}
            className="flex-shrink-0 rounded-md bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            title="Закрыть панель"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Содержимое панели */}
        <div className="panel-content custom-scrollbar">
          {/* Основное изображение */}
          {properties.image_path && (
            <div className="relative mb-4">
              <Image
                src={`/images/${properties.image_path}`}
                alt={properties.name || 'Изображение объекта'}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
                unoptimized
              />
            </div>
          )}

          {/* Навигация по секциям */}
          {availableSections.length > 1 && (
            <div className="flex overflow-x-auto gap-1 mb-4 pb-2">
              {availableSections.map((sectionKey) => {
                const section = FIELD_SECTIONS[sectionKey as keyof typeof FIELD_SECTIONS]
                const isActive = activeSection === sectionKey
                
                return (
                  <button
                    key={sectionKey}
                    onClick={() => setActiveSection(sectionKey)}
                    className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-university-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {section?.title || sectionKey}
                  </button>
                )
              })}
            </div>
          )}

          {/* Поля активной секции */}
          <div className="space-y-4">
            {groupedFields[activeSection]?.map(({ key, value, config }) => (
              <FieldDisplay
                key={key}
                label={config.label}
                value={value}
                type={config.type}
                icon={config.icon}
              />
            ))}
          </div>

          {/* Если нет полей в активной секции */}
          {!groupedFields[activeSection]?.length && (
            <div className="text-center text-gray-500 py-8">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Информация в данной секции отсутствует</p>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}

// Компонент отображения поля
interface FieldDisplayProps {
  label: string
  value: any
  type?: string
  icon?: string
}

function FieldDisplay({ label, value, type, icon }: FieldDisplayProps) {
  if (!value || value === '') return null

  // Определение иконки
  const getIcon = () => {
    switch (icon) {
      case 'phone': return <Phone className="h-4 w-4" />
      case 'mail': return <Mail className="h-4 w-4" />
      case 'globe': return <Globe className="h-4 w-4" />
      case 'clock': return <Clock className="h-4 w-4" />
      case 'user-tie': return <User className="h-4 w-4" />
      case 'map-pin': return <MapPin className="h-4 w-4" />
      case 'building': return <Building2 className="h-4 w-4" />
      default: return <div className="h-4 w-4 rounded bg-gray-300" />
    }
  }

  // Форматирование значения
  const formatValue = () => {
    switch (type) {
      case 'contact':
        if (icon === 'phone') {
          return (
            <a 
              href={`tel:${value}`}
              className="text-university-primary hover:underline flex items-center gap-1"
            >
              {value}
              <ExternalLink className="h-3 w-3" />
            </a>
          )
        }
        if (icon === 'mail') {
          return (
            <a 
              href={`mailto:${value}`}
              className="text-university-primary hover:underline flex items-center gap-1"
            >
              {value}
              <ExternalLink className="h-3 w-3" />
            </a>
          )
        }
        if (icon === 'globe') {
          return (
            <a 
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-university-primary hover:underline flex items-center gap-1"
            >
              Открыть сайт
              <ExternalLink className="h-3 w-3" />
            </a>
          )
        }
        return value

      case 'boolean':
        return value ? 'Да' : 'Нет'

      case 'list':
        if (Array.isArray(value)) {
          return (
            <ul className="list-disc list-inside space-y-1">
              {value.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          )
        }
        return value

      case 'image':
        return (
          <div className="mt-2">
            <Image
              src={`/images/${value}`}
              alt={label}
              width={200}
              height={150}
              className="rounded-md object-cover"
              unoptimized
            />
          </div>
        )

      case 'currency':
        return `${value} ₽`

      default:
        return value
    }
  }

  return (
    <div className="border-b border-gray-100 pb-3 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-gray-500 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <dt className="text-sm font-medium text-gray-700 mb-1">
            {label}
          </dt>
          <dd className="text-sm text-gray-900">
            {formatValue()}
          </dd>
        </div>
      </div>
    </div>
  )
} 