'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { CategoryPanel } from '@/components/panels/CategoryPanel'
import { InfoPanel } from '@/components/panels/InfoPanel'
import { MapContainer } from '@/components/map/MapContainer'
import { MapControls } from '@/components/map/MapControls'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useMapStore } from '@/stores/mapStore'
import { usePanelStore } from '@/stores/panelStore'

export function MapApplication() {
  const { isInitialized } = useMapStore()
  const [hasShownOnce, setHasShownOnce] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Инициализация карты...')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const { isCategoryPanelOpen, isInfoPanelOpen } = usePanelStore()

  // Симулируем плавный прогресс загрузки интерфейса
  useEffect(() => {
    const steps = [
      { message: 'Инициализация карты...', progress: 15 },
      { message: 'Загрузка конфигурации...', progress: 35 },
      { message: 'Подготовка слоев...', progress: 60 },
      { message: 'Инициализация поиска...', progress: 80 },
      { message: 'Завершение...', progress: 95 }
    ]

    let cancelled = false
    let idx = 0

    const tick = () => {
      if (cancelled) return
      if (idx < steps.length) {
        const step = steps[idx]
        setLoadingMessage(step.message)
        setLoadingProgress(step.progress)
        idx++
        setTimeout(tick, 400)
      } else {
        // Доползаем до 100% плавно
        setLoadingMessage('Готово')
        setLoadingProgress(100)
      }
    }

    tick()
    return () => { cancelled = true }
  }, [])

  // Даём время анимации и скрываем лоадер, когда карта и прогресс готовы
  useEffect(() => {
    if (isInitialized && loadingProgress >= 100) {
      const t = setTimeout(() => setHasShownOnce(true), 300)
      return () => clearTimeout(t)
    }
  }, [isInitialized, loadingProgress])

  const showLoader = !isInitialized || !hasShownOnce

  return (
    <div className="flex h-screen flex-col bg-university-background">
      {/* Шапка */}
      <Header />
      
      {/* Основной контент */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Панель категорий (слева) */}
        <CategoryPanel 
          isOpen={isCategoryPanelOpen}
        />
        
        {/* Центральная область с картой */}
        <div className="relative flex-1">
          <MapContainer />
          <MapControls />
        </div>
        
        {/* Информационная панель (справа) */}
        <InfoPanel 
          isOpen={isInfoPanelOpen}
        />
      </main>

      <AnimatePresence initial={false} mode="wait">
        {showLoader && (
          <LoadingScreen 
            message={loadingMessage}
            progress={loadingProgress}
            instantAppear={true}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 