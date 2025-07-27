'use client'

import { useState, useEffect } from 'react'
import { Search, Menu, X, Expand, Minimize } from 'lucide-react'
import Image from 'next/image'
import { SearchInput } from '@/components/search/SearchInput'
import { usePanelStore, useMobileState } from '@/stores/panelStore'
import { APP_CONFIG } from '@/config'

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const { isCategoryPanelOpen, toggleCategoryPanel } = usePanelStore()
  const { isMobile, setMobile } = useMobileState()

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setMobile])

  // Обработка полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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

  return (
    <header className="relative z-navbar flex h-header min-h-header-mobile items-center justify-between bg-university-primary-dark px-4 text-white shadow-lg md:px-6">
      {/* Левая часть - Логотип и название */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo.svg"
          alt="ТимМап Логотип"
          width={50}
          height={50}
          className="h-10 w-10 md:h-12 md:w-12"
          priority
        />
        <h1 className="hidden font-title text-xl font-semibold md:block lg:text-2xl">
          {APP_CONFIG.name}
        </h1>
      </div>

      {/* Центральная часть - Поиск */}
      <div className="mx-4 flex-1 max-w-2xl">
        <SearchInput
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className={`transition-all duration-200 ${
            isSearchFocused ? 'ring-2 ring-white/30' : ''
          }`}
        />
      </div>

      {/* Правая часть - Кнопки управления */}
      <div className="flex items-center gap-2">
        {/* Полноэкранный режим - только на десктопе */}
        {!isMobile && (
          <button
            onClick={toggleFullscreen}
            className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 md:p-3"
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Expand className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Кнопка меню для мобильных */}
        <button
          onClick={toggleCategoryPanel}
          className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 md:hidden"
          title="Меню"
          aria-label="Переключить меню навигации"
        >
          {isCategoryPanelOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Кнопка переключения панели категорий для десктопа */}
        {!isMobile && (
          <button
            onClick={toggleCategoryPanel}
            className="hidden rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 md:block md:p-3"
            title="Переключить панель категорий"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  )
} 