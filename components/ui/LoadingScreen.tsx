'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getRandomFact } from '@/config/facts'
import Image from 'next/image'

interface LoadingScreenProps {
  message?: string
  progress?: number
}

export function LoadingScreen({ message, progress }: LoadingScreenProps) {
  const [fact, setFact] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Устанавливаем случайный факт с небольшой задержкой
    const timer = setTimeout(() => {
      setFact(getRandomFact())
    }, 100)

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
      initial={{ opacity: 0 }}
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
        className="relative z-10 mb-8"
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

      {/* Факт */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="relative z-10 mx-4 max-w-4xl text-center"
      >
        <p className="font-title text-lg leading-relaxed text-white sm:text-xl md:text-2xl lg:text-3xl">
          "{fact}"
        </p>
      </motion.div>

      {/* Прогресс бар (если передан) */}
      {progress !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="relative z-10 mt-8 w-64"
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-white"
            />
          </div>
          <p className="mt-2 text-center text-sm text-white/80">
            {message || 'Загрузка карты...'}
          </p>
        </motion.div>
      )}

      {/* Спиннер по умолчанию */}
      {progress === undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="relative z-10 mt-8 flex flex-col items-center"
        >
          <div className="loading-spinner h-8 w-8" />
          <p className="mt-4 text-sm text-white/80">
            {message || 'Загрузка карты...'}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
} 