import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Fuse from 'fuse.js'
import { SEARCH_CONFIG, STORAGE_KEYS } from '@/config'
import type { SearchResult, OLFeature } from '@/types'

interface SearchState {
  // Состояние поиска
  query: string
  results: SearchResult[]
  suggestions: string[]
  isSearching: boolean
  error: string | null

  // История и популярные запросы
  recentSearches: string[]
  popularQueries: string[]

  // Фильтры
  activeFilter: string
  filters: Array<{
    id: string
    label: string
    count: number
  }>

  // Данные для поиска
  searchData: Array<{
    feature: OLFeature
    layer: string
    category: string
    searchableText: string
  }>

  // Действия
  setQuery: (query: string) => void
  setResults: (results: SearchResult[]) => void
  setSuggestions: (suggestions: string[]) => void
  setSearching: (searching: boolean) => void
  setError: (error: string | null) => void
  
  addToHistory: (query: string) => void
  clearHistory: () => void
  
  setActiveFilter: (filter: string) => void
  
  performSearch: (query: string) => void
  clearQuery: () => void
  
  // Инициализация данных для поиска
  initializeSearchData: (features: Array<{ feature: OLFeature, layer: string, category: string }>) => void
  
  reset: () => void
}

// Экземпляр Fuse.js для нечеткого поиска
let fuseInstance: Fuse<any> | null = null

// Создание поискового индекса
const createFuseIndex = (searchData: any[]) => {
  const options = {
    keys: [
      { name: 'name', weight: 1.0 },
      { name: 'title', weight: 0.9 },
      { name: 'address', weight: 0.7 },
      { name: 'description', weight: 0.4 },
      { name: 'searchableText', weight: 0.6 }
    ],
    threshold: SEARCH_CONFIG.settings.fuzzySearchThreshold,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true
  }

  return new Fuse(searchData, options)
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      query: '',
      results: [],
      suggestions: [],
      isSearching: false,
      error: null,

      recentSearches: [],
      popularQueries: SEARCH_CONFIG.popularQueries.slice(0, 6),

      activeFilter: 'all',
      filters: SEARCH_CONFIG.filters.map(filter => ({
        id: filter.id,
        label: filter.label,
        count: 0
      })),

      searchData: [],

      // Действия
      setQuery: (query) => {
        set({ query })
      },

      setResults: (results) => {
        set({ results })
      },

      setSuggestions: (suggestions) => {
        set({ suggestions })
      },

      setSearching: (searching) => {
        set({ isSearching: searching })
      },

      setError: (error) => {
        set({ error })
      },

      addToHistory: (query) => {
        if (!query.trim()) return

        set((state) => {
          const trimmedQuery = query.trim()
          const newHistory = [
            trimmedQuery,
            ...state.recentSearches.filter(item => item !== trimmedQuery)
          ].slice(0, SEARCH_CONFIG.settings.maxHistoryItems)

          return { recentSearches: newHistory }
        })
      },

      clearHistory: () => {
        set({ recentSearches: [] })
      },

      setActiveFilter: (filter) => {
        set({ activeFilter: filter })
        
        // Повторяем поиск с новым фильтром
        const { query, performSearch } = get()
        if (query) {
          performSearch(query)
        }
      },

      performSearch: (query) => {
        if (!query.trim() || query.length < SEARCH_CONFIG.settings.minQueryLength) {
          set({ results: [], suggestions: [] })
          return
        }

        set({ isSearching: true, error: null })

        try {
          const { searchData, activeFilter } = get()
          
                     if (!fuseInstance || searchData.length === 0) {
             // Создаем индекс если его нет
             fuseInstance = createFuseIndex(searchData)
           }

          // Фильтруем данные по активному фильтру
          let filteredData = searchData
          if (activeFilter !== 'all') {
            const filterConfig = SEARCH_CONFIG.filters.find(f => f.id === activeFilter)
            if (filterConfig && filterConfig.layers !== '*') {
              filteredData = searchData.filter(item => 
                filterConfig.layers.includes(item.layer)
              )
            }
          }

          // Выполняем поиск
          const fuseResults = fuseInstance.search(query, {
            limit: SEARCH_CONFIG.settings.maxResults
          })

          // Преобразуем результаты
          const results: SearchResult[] = fuseResults
            .filter(result => {
              // Дополнительная фильтрация по активному фильтру
              if (activeFilter === 'all') return true
              const filterConfig = SEARCH_CONFIG.filters.find(f => f.id === activeFilter)
              return filterConfig && filterConfig.layers !== '*' 
                ? filterConfig.layers.includes(result.item.layer)
                : true
            })
            .map(result => ({
              feature: result.item.feature,
              layer: result.item.layer,
              category: result.item.category,
              score: 1 - (result.score || 0), // Инвертируем score (чем больше, тем лучше)
                             matchedFields: result.matches?.map(match => match.key).filter((key): key is string => Boolean(key)) || []
            }))

          // Генерируем предложения на основе результатов
          const suggestions = results
            .slice(0, 5)
            .map(result => result.feature.get('name') || result.feature.get('title'))
            .filter(Boolean)

          set({ 
            results, 
            suggestions,
            isSearching: false 
          })

        } catch (error) {
          console.error('Ошибка поиска:', error)
          set({ 
            error: 'Ошибка выполнения поиска',
            isSearching: false,
            results: [],
            suggestions: []
          })
        }
      },

      clearQuery: () => {
        set({ 
          query: '',
          results: [],
          suggestions: [],
          error: null
        })
      },

      initializeSearchData: (features) => {
        const searchData = features.map(({ feature, layer, category }) => {
          // Создаем поисковый текст из всех доступных полей
          const properties = feature.getProperties()
          const searchableFields = [
            properties.name,
            properties.title,
            properties.address,
            properties.description,
            properties.services?.join(' '),
            properties.faculties?.join(' '),
            properties.departments?.join(' ')
          ].filter(Boolean)

          return {
            feature,
            layer,
            category,
            name: properties.name || properties.title || '',
            title: properties.title || '',
            address: properties.address || '',
            description: properties.description || '',
            searchableText: searchableFields.join(' ')
          }
        })

        // Создаем индекс поиска
        fuseInstance = createFuseIndex(searchData)

        // Обновляем счетчики фильтров
        const filterCounts = SEARCH_CONFIG.filters.map(filter => {
          let count = 0
          if (filter.layers === '*') {
            count = searchData.length
          } else {
            count = searchData.filter(item => 
              filter.layers.includes(item.layer)
            ).length
          }
          
          return {
            id: filter.id,
            label: filter.label,
            count
          }
        })

        set({ 
          searchData,
          filters: filterCounts
        })
      },

      reset: () => {
        set({
          query: '',
          results: [],
          suggestions: [],
          isSearching: false,
          error: null,
          activeFilter: 'all',
          searchData: []
        })
        fuseInstance = null
      }
    }),
    {
      name: STORAGE_KEYS.SEARCH_HISTORY,
      // Сохраняем только историю поиска
      partialize: (state) => ({
        recentSearches: state.recentSearches
      })
    }
  )
)

// Селекторы
export const useSearchResults = () => useSearchStore(state => ({
  results: state.results,
  isSearching: state.isSearching,
  error: state.error
}))

export const useSearchHistory = () => useSearchStore(state => ({
  recentSearches: state.recentSearches,
  popularQueries: state.popularQueries,
  clearHistory: state.clearHistory
}))

export const useSearchFilters = () => useSearchStore(state => ({
  activeFilter: state.activeFilter,
  filters: state.filters,
  setActiveFilter: state.setActiveFilter
})) 