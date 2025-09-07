'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getRandomFact } from '@/config/facts'
import Image from 'next/image'

interface LoadingScreenProps {
  message?: string
  progress?: number
  // Появляться без начального затемнения, чтобы не было «мигания» приложения
  instantAppear?: boolean
}

export function LoadingScreen({ message, progress, instantAppear = true }: LoadingScreenProps) {
  // Выбираем факт синхронно, чтобы избежать «прыжка» макета
  const [fact, setFact] = useState<string>(() => getRandomFact())
  const [isVisible, setIsVisible] = useState(true)

  // Обновим факт спустя мгновение для разнообразия, не меняя высоту
  useEffect(() => {
    const timer = setTimeout(() => setFact(getRandomFact()), 600)
    return () => clearTimeout(timer)
  }, [])

  const hideLoader = () => {
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: instantAppear ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-loader flex flex-col items-center justify-center bg-university-primary"
      style={{
        backgroundImage: "url('/images/vector.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Логотип */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mb-8 will-change-transform"
      >
        <Image
          src="/images/logo.svg"
          alt="ТимМап Логотип"
          width={200}
          height={200}
          className="h-auto w-48 sm:w-56 md:w-64"
          priority
        />
      </motion.div>

      {/* Факт (резервируем постоянную высоту, чтобы не дергался логотип) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="relative z-10 mx-4 max-w-4xl text-center"
        style={{ minHeight: 96 }}
      >
        <p className="font-title text-lg leading-relaxed text-white sm:text-xl md:text-2xl lg:text-3xl">
          "{fact}"
        </p>
      </motion.div>

      {/* Прогресс бар — всегда резервируем место одинаковой высоты */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="relative z-10 mt-8 w-64"
        style={{ minHeight: 36 }}
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(progress ?? 0, 0), 100)}%` }}
            transition={{ duration: 0.35 }}
            className="h-full bg-white"
          />
        </div>
        <p className="mt-2 text-center text-sm text-white/80">
          {message || 'Загрузка карты...'}
        </p>
      </motion.div>
    </motion.div>
  )
} 