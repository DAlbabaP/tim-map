'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { CategoryPanel } from '@/components/panels/CategoryPanel'
import { InfoPanel } from '@/components/panels/InfoPanel'
import { MapContainer } from '@/components/map/MapContainer'
import { MapControls } from '@/components/map/MapControls'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useMapStore } from '@/stores/mapStore'
import { usePanelStore } from '@/stores/panelStore'

export function MapApplication() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Инициализация карты...')
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  const { isInitialized } = useMapStore()
  const { isCategoryPanelOpen, isInfoPanelOpen } = usePanelStore()

  useEffect(() => {
    // Симулируем процесс загрузки
    const loadingSteps = [
      { message: 'Инициализация карты...', progress: 20 },
      { message: 'Загрузка конфигурации...', progress: 40 },
      { message: 'Подготовка слоев...', progress: 60 },
      { message: 'Инициализация поиска...', progress: 80 },
      { message: 'Завершение...', progress: 100 },
    ]

    let currentStep = 0
    const updateLoading = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep]
        setLoadingMessage(step.message)
        setLoadingProgress(step.progress)
        currentStep++
        
        setTimeout(updateLoading, 500)
      } else {
        // Дополнительная задержка чтобы пользователь успел прочитать факт
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    updateLoading()
  }, [])

  if (isLoading) {
    return (
      <LoadingScreen 
        message={loadingMessage}
        progress={loadingProgress}
      />
    )
  }

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
    </div>
  )
} 