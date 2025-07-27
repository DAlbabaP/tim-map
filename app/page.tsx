'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Динамический импорт компонента карты для избежания SSR проблем
const MapApplication = dynamic(
  () => import('@/components/MapApplication').then(mod => ({ default: mod.MapApplication })),
  { 
    ssr: false,
    loading: () => <LoadingScreen />
  }
)

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <MapApplication />
      </Suspense>
    </ErrorBoundary>
  )
} 