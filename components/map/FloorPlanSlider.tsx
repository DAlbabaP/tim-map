'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, ChevronUp, ChevronDown, X, Map } from 'lucide-react'
import { useFloorPlan } from '@/stores/mapStore'

interface FloorPlanSliderProps {
  className?: string
}

export function FloorPlanSlider({ className }: FloorPlanSliderProps) {
  const { floorPlan, setCurrentFloor, hideFloorPlan } = useFloorPlan()
  const [isExpanded, setIsExpanded] = useState(true)

  // Автоматически разворачиваем при появлении поэтажного плана
  useEffect(() => {
    if (floorPlan) {
      setIsExpanded(true)
    }
  }, [floorPlan])

  if (!floorPlan) return null

  const { buildingName, currentFloor, availableFloors } = floorPlan

  // Сортируем этажи по уровню (от верхнего к нижнему)
  const sortedFloors = [...availableFloors].sort((a, b) => b.level - a.level)

  const handleFloorChange = (level: number) => {
    setCurrentFloor(level)
  }

  const handleClose = () => {
    hideFloorPlan()
    setIsExpanded(false)
  }

  const currentFloorInfo = availableFloors.find(f => f.level === currentFloor)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`fixed bottom-20 left-4 z-40 ${className || ''}`}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[280px]">
          {/* Заголовок */}
          <div className="bg-university-primary text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <div>
                  <h3 className="font-medium text-sm">{buildingName}</h3>
                  <p className="text-xs text-blue-100">
                    {currentFloorInfo?.name || `Этаж ${currentFloor}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 rounded hover:bg-white/20 transition-colors"
                  title={isExpanded ? "Свернуть" : "Развернуть"}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  onClick={handleClose}
                  className="p-1 rounded hover:bg-white/20 transition-colors"
                  title="Закрыть поэтажный план"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Слайдер этажей */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  {/* Информация о текущем этаже */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Map className="h-4 w-4 text-university-primary" />
                      <span className="font-medium text-sm">Текущий этаж</span>
                    </div>
                    <p className="text-lg font-semibold text-university-primary">
                      {currentFloorInfo?.name || `Этаж ${currentFloor}`}
                    </p>
                  </div>

                  {/* Список этажей */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Выберите этаж:
                    </h4>
                    
                    {sortedFloors.map((floor) => {
                      const isActive = floor.level === currentFloor
                      
                      return (
                        <motion.button
                          key={floor.level}
                          onClick={() => handleFloorChange(floor.level)}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                            isActive
                              ? 'bg-university-primary text-white border-university-primary shadow-md'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-university-primary hover:bg-blue-50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isActive}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {floor.name}
                              </p>
                              <p className={`text-xs ${
                                isActive ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                Уровень {floor.level}
                              </p>
                            </div>
                            
                            {isActive && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Быстрая навигация */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => {
                          const currentIndex = sortedFloors.findIndex(f => f.level === currentFloor)
                          if (currentIndex < sortedFloors.length - 1) {
                            handleFloorChange(sortedFloors[currentIndex + 1].level)
                          }
                        }}
                        disabled={currentFloor === Math.min(...sortedFloors.map(f => f.level))}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                      >
                        <ChevronDown className="h-4 w-4" />
                        Ниже
                      </button>
                      
                      <button
                        onClick={() => {
                          const currentIndex = sortedFloors.findIndex(f => f.level === currentFloor)
                          if (currentIndex > 0) {
                            handleFloorChange(sortedFloors[currentIndex - 1].level)
                          }
                        }}
                        disabled={currentFloor === Math.max(...sortedFloors.map(f => f.level))}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                      >
                        <ChevronUp className="h-4 w-4" />
                        Выше
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 