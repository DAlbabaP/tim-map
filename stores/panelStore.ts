import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/config'

interface PanelState {
  // Состояние панелей
  isCategoryPanelOpen: boolean
  isInfoPanelOpen: boolean
  isMobile: boolean

  // Действия для панели категорий
  toggleCategoryPanel: () => void
  setCategoryPanelOpen: (open: boolean) => void

  // Действия для информационной панели
  toggleInfoPanel: () => void
  setInfoPanelOpen: (open: boolean) => void

  // Мобильные устройства
  setMobile: (mobile: boolean) => void

  // Закрыть все панели
  closeAllPanels: () => void
}

export const usePanelStore = create<PanelState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      isCategoryPanelOpen: false, // На мобильных по умолчанию скрыта
      isInfoPanelOpen: false,
      isMobile: false,

      // Панель категорий
      toggleCategoryPanel: () => {
        set((state) => ({
          isCategoryPanelOpen: !state.isCategoryPanelOpen,
          // На мобильных закрываем информационную панель при открытии категорий
          isInfoPanelOpen: state.isMobile ? false : state.isInfoPanelOpen
        }))
      },

      setCategoryPanelOpen: (open) => {
        set((state) => ({
          isCategoryPanelOpen: open,
          // На мобильных закрываем информационную панель при открытии категорий
          isInfoPanelOpen: state.isMobile && open ? false : state.isInfoPanelOpen
        }))
      },

      // Информационная панель
      toggleInfoPanel: () => {
        set((state) => ({
          isInfoPanelOpen: !state.isInfoPanelOpen,
          // На мобильных закрываем панель категорий при открытии информационной
          isCategoryPanelOpen: state.isMobile ? false : state.isCategoryPanelOpen
        }))
      },

      setInfoPanelOpen: (open) => {
        set((state) => ({
          isInfoPanelOpen: open,
          // На мобильных закрываем панель категорий при открытии информационной
          isCategoryPanelOpen: state.isMobile && open ? false : state.isCategoryPanelOpen
        }))
      },

      // Мобильные устройства
      setMobile: (mobile) => {
        set((state) => {
          // При переключении на мобильный режим, закрываем одну из панелей если обе открыты
          if (mobile && state.isCategoryPanelOpen && state.isInfoPanelOpen) {
            return {
              isMobile: mobile,
              isCategoryPanelOpen: false, // Оставляем информационную панель
              isInfoPanelOpen: true
            }
          }
          
          return { isMobile: mobile }
        })
      },

      // Закрыть все панели
      closeAllPanels: () => {
        set({
          isCategoryPanelOpen: false,
          isInfoPanelOpen: false
        })
      }
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      // Сохраняем только состояние панелей на десктопе
      partialize: (state) => ({
        isCategoryPanelOpen: state.isMobile ? false : state.isCategoryPanelOpen,
        isInfoPanelOpen: false // Информационную панель не сохраняем
      })
    }
  )
)

// Селекторы для удобства
export const useCategoryPanel = () => usePanelStore(state => ({
  isOpen: state.isCategoryPanelOpen,
  toggle: state.toggleCategoryPanel,
  setOpen: state.setCategoryPanelOpen
}))

export const useInfoPanel = () => usePanelStore(state => ({
  isOpen: state.isInfoPanelOpen,
  toggle: state.toggleInfoPanel,
  setOpen: state.setInfoPanelOpen
}))

export const useMobileState = () => usePanelStore(state => ({
  isMobile: state.isMobile,
  setMobile: state.setMobile
})) 