'use client'

import { useState, useEffect } from 'react'
import { 
  Navigation, 
  RotateCcw, 
  Info, 
  Map as MapIcon, 
  Calendar,
  Flag,
  Expand,
  Minimize
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useMapStore, useUserLocation } from '@/stores/mapStore'
import { useMobileState } from '@/stores/panelStore'
import { MapInfoModal } from '@/components/ui/MapInfoModal'

export function MapControls() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMapInfoOpen, setIsMapInfoOpen] = useState(false)
  const { isMobile } = useMobileState()
  const { setUserLocation, setLocating, mapInstance } = useMapStore()
  const { location, isLocating } = useUserLocation()

  // Отслеживание полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Геолокация
  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается в вашем браузере')
      return
    }

    setLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([longitude, latitude])
        setLocating(false)
        
        // Центрируем карту на местоположении пользователя
        if (mapInstance) {
          const view = mapInstance.getView()
          if (view) {
            // Динамический импорт для трансформации координат
            import('ol/proj').then(({ fromLonLat }) => {
              const webMercatorCoords = fromLonLat([longitude, latitude])
              view.animate({
                center: webMercatorCoords,
                zoom: Math.max(view.getZoom() || 16, 17),
                duration: 800
              })
              console.log('📍 Карта центрирована на местоположении:', latitude, longitude)
            }).catch(error => {
              console.error('❌ Ошибка импорта ol/proj:', error)
            })
          }
        } else {
          console.log('📍 Местоположение получено, но карта не готова:', latitude, longitude)
        }
      },
      (error) => {
        setLocating(false)
        console.error('Ошибка геолокации:', error)
        
        let message = 'Не удалось определить местоположение'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Доступ к геолокации отклонен'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Местоположение недоступно'
            break
          case error.TIMEOUT:
            message = 'Превышено время ожидания'
            break
        }
        alert(message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 минут
      }
    )
  }

  // Сброс вида карты
  const handleResetView = () => {
    if (!mapInstance) {
      console.warn('❌ Карта не инициализирована для сброса вида')
      return
    }

    const view = mapInstance.getView()
    if (view) {
      // Анимированный сброс к начальным координатам (из старой версии)
      view.animate({
        center: [4180050.855075, 7525234.989304], // Центр университета
        zoom: 16,
        duration: 1000
      })
      console.log('🔄 Вид карты сброшен к начальным координатам')
    }
  }

  // Переключение полноэкранного режима
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Ошибка переключения полноэкранного режима:', error)
    }
  }

  // Информация о карте
  const handleMapInfo = () => {
    setIsMapInfoOpen(true)
    console.log('ℹ️ Открываем модальное окно с информацией о карте')
  }

  // Навигатор маршрутов
  const handleNavigator = () => {
    // TODO: Открыть панель построения маршрутов
    console.log('🗺️ Построение маршрута')
  }

  // Мероприятия
  const handleEvents = () => {
    // TODO: Показать календарь мероприятий
    console.log('📅 Мероприятия')
  }

  // Пожаловаться на проблему
  const handleReportIssue = () => {
    // TODO: Открыть форму обратной связи
    console.log('🚩 Сообщить о проблеме')
  }

  return (
    <>
      {/* Основные элементы управления справа */}
      <div className="absolute right-4 top-4 z-map-controls flex flex-col gap-2">
        {/* Кнопка местоположения */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLocation}
          disabled={isLocating}
          className="btn-map-control group relative"
          title="Моё местоположение"
        >
          {isLocating ? (
            <div className="loading-spinner h-5 w-5" />
          ) : (
            <Navigation 
              className={`h-5 w-5 transition-colors ${
                location ? 'text-university-primary' : 'text-gray-600'
              }`} 
            />
          )}
          
          {/* Индикатор активного местоположения */}
          {location && !isLocating && (
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-university-primary" />
          )}
        </motion.button>

        {/* Кнопка мероприятий */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEvents}
          className="btn-map-control"
          title="Мероприятия"
        >
          <Calendar className="h-5 w-5 text-gray-600" />
        </motion.button>

        {/* Кнопка сброса вида */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetView}
          className="btn-map-control"
          title="Сбросить вид"
        >
          <RotateCcw className="h-5 w-5 text-gray-600" />
        </motion.button>

        {/* Кнопка информации о карте */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMapInfo}
          className="btn-map-control"
          title="Информация о карте"
        >
          <Info className="h-5 w-5 text-gray-600" />
        </motion.button>

        {/* Кнопка навигатора */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNavigator}
          className="btn-map-control"
          title="Построить маршрут"
        >
                     <MapIcon className="h-5 w-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Элементы управления внизу справа */}
      <div className="absolute bottom-4 right-4 z-map-controls flex gap-2">
        {/* Полноэкранный режим */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          className="btn-map-control"
          title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5 text-gray-600" />
          ) : (
            <Expand className="h-5 w-5 text-gray-600" />
          )}
        </motion.button>

        {/* Пожаловаться на проблему */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReportIssue}
          className="btn-map-control"
          title="Сообщить о проблеме"
        >
          <Flag className="h-5 w-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Адаптивные элементы для мобильных */}
      {isMobile && (
        <div className="absolute bottom-4 left-4 z-map-controls">
          {/* Индикатор местоположения для мобильных */}
          {location && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-lg"
            >
              <div className="h-2 w-2 rounded-full bg-university-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                Местоположение найдено
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Модальное окно информации о карте */}
      <MapInfoModal 
        isOpen={isMapInfoOpen}
        onClose={() => setIsMapInfoOpen(false)}
      />
    </>
  )
} 