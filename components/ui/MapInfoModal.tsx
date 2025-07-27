'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Map, Layers, MousePointer, Keyboard, Code, Info } from 'lucide-react'

interface MapInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MapInfoModal({ isOpen, onClose }: MapInfoModalProps) {
  // Закрытие по ESC
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Оверлей */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Заголовок */}
            <div className="bg-university-primary-dark text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6" />
                <h2 className="text-xl font-title font-semibold">Информация о карте</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                title="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Содержимое */}
            <div className="px-6 py-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="space-y-6">
                {/* О карте */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Map className="h-5 w-5 text-university-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">О карте</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Интерактивная карта университета предоставляет подробную информацию о зданиях, 
                    объектах инфраструктуры и транспортных узлах кампуса. Удобный интерфейс позволяет 
                    быстро находить нужные объекты и получать детальную информацию о них.
                  </p>
                </section>

                {/* Доступные слои */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-5 w-5 text-university-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Доступные слои</h3>
                  </div>
                  <div className="grid gap-3">
                    <LayerInfo 
                      title="Университетские здания" 
                      count="8 типов"
                      description="Учебные корпуса, лаборатории, библиотеки, спортивные сооружения, общежития, музеи, кафе"
                    />
                    <LayerInfo 
                      title="Транспортные остановки" 
                      count="3 типа"
                      description="Автобусные остановки, трамвайные остановки, станции метро"
                    />
                    <LayerInfo 
                      title="Природные объекты" 
                      count="10 типов"
                      description="Парки, леса, водоемы, поля, пляжи, спортивные площадки"
                    />
                    <LayerInfo 
                      title="Инфраструктура" 
                      count="2 типа"
                      description="Дороги, железнодорожные пути"
                    />
                    <LayerInfo 
                      title="Точки интереса" 
                      count="6 типов"
                      description="Банкоматы, кафе, деканаты, кафедры, лаборатории, музеи"
                    />
                  </div>
                </section>

                {/* Управление */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <MousePointer className="h-5 w-5 text-university-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Управление</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-university-primary">🔍</span>
                      <span>Используйте поиск для быстрого нахождения объектов</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-university-primary">👁️</span>
                      <span>Включайте/выключайте слои в левой панели категорий</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-university-primary">🖱️</span>
                      <span>Кликайте на объекты для просмотра детальной информации</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-university-primary">🏢</span>
                      <span>При клике на здания появляется меню связанных объектов</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-university-primary">🔄</span>
                      <span>Используйте колесо мыши для масштабирования</span>
                    </div>
                  </div>
                </section>

                {/* Горячие клавиши */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Keyboard className="h-5 w-5 text-university-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Горячие клавиши</h3>
                  </div>
                  <div className="grid gap-2 text-sm">
                    <HotkeyInfo shortcut="Ctrl + K" description="Фокус на поиске" />
                    <HotkeyInfo shortcut="Home" description="Сброс вида карты" />
                    <HotkeyInfo shortcut="F11" description="Полноэкранный режим" />
                    <HotkeyInfo shortcut="Escape" description="Снять выделение / Закрыть модальные окна" />
                  </div>
                </section>

                {/* Техническая информация */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="h-5 w-5 text-university-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Техническая информация</h3>
                  </div>
                  <div className="grid gap-3 text-sm">
                    <TechInfo label="Версия" value="2.0.0" />
                    <TechInfo label="Картографическая проекция" value="EPSG:3857 (Web Mercator)" />
                    <TechInfo label="Библиотека карт" value="OpenLayers 9.x" />
                    <TechInfo label="Фреймворк" value="Next.js 14 + React 18" />
                    <TechInfo label="Формат данных" value="GeoJSON" />
                    <TechInfo label="Стилизация" value="Tailwind CSS + Framer Motion" />
                  </div>
                </section>
              </div>
            </div>

            {/* Футер */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="bg-university-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-university-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-university-primary focus:ring-offset-2"
              >
                Понятно
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Компонент информации о слое
interface LayerInfoProps {
  title: string
  count: string
  description: string
}

function LayerInfo({ title, count, description }: LayerInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-gray-900">{title}</span>
        <span className="text-xs bg-university-primary text-white px-2 py-1 rounded-full">
          {count}
        </span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

// Компонент горячей клавиши
interface HotkeyInfoProps {
  shortcut: string
  description: string
}

function HotkeyInfo({ shortcut, description }: HotkeyInfoProps) {
  return (
    <div className="flex items-center justify-between">
      <kbd className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono">
        {shortcut}
      </kbd>
      <span className="text-gray-700 flex-1 ml-3">{description}</span>
    </div>
  )
}

// Компонент технической информации
interface TechInfoProps {
  label: string
  value: string
}

function TechInfo({ label, value }: TechInfoProps) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-900 font-mono text-xs">{value}</span>
    </div>
  )
} 