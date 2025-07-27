'use client'

import { Clock, TrendingUp, Search, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SearchResult } from '@/types'
import { SEARCH_CONFIG } from '@/config/search'

interface SearchSuggestionsProps {
  query: string
  results: SearchResult[]
  suggestions: string[]
  recentSearches: string[]
  popularQueries: string[]
  isSearching: boolean
  onSuggestionClick: (suggestion: string) => void
  onClose: () => void
}

export function SearchSuggestions({
  query,
  results,
  suggestions,
  recentSearches,
  popularQueries,
  isSearching,
  onSuggestionClick,
  onClose
}: SearchSuggestionsProps) {
  
  // Если есть запрос, показываем результаты поиска
  if (query.length >= SEARCH_CONFIG.settings.minQueryLength) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-hidden rounded-lg bg-white shadow-xl border border-gray-200"
      >
        {isSearching ? (
          <div className="flex items-center justify-center p-4">
            <div className="loading-spinner h-5 w-5 mr-3" />
            <span className="text-gray-600">{SEARCH_CONFIG.ui.loadingMessage}</span>
          </div>
        ) : results.length > 0 ? (
          <div className="custom-scrollbar max-h-96 overflow-y-auto">
            {/* Заголовок результатов */}
            <div className="sticky top-0 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 border-b">
              Найдено: {results.length} {results.length === 1 ? 'результат' : 'результатов'}
            </div>
            
            {/* Результаты поиска */}
            {results.slice(0, 8).map((result, index) => (
              <SearchResultItem
                key={`${result.layer}-${index}`}
                result={result}
                query={query}
                onClick={() => onSuggestionClick(result.feature.get('name') || result.feature.get('title') || '')}
              />
            ))}
            
            {results.length > 8 && (
              <div className="p-3 text-center text-sm text-gray-500 border-t">
                и еще {results.length - 8} результатов...
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <Search className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            {SEARCH_CONFIG.ui.noResultsMessage}
          </div>
        )}
      </motion.div>
    )
  }

  // Если запроса нет, показываем историю и популярные запросы
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-hidden rounded-lg bg-white shadow-xl border border-gray-200"
    >
      <div className="custom-scrollbar max-h-96 overflow-y-auto">
        {/* История поиска */}
        {recentSearches.length > 0 && (
          <div>
            <div className="px-4 py-3 text-sm font-medium text-gray-700 border-b bg-gray-50 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {SEARCH_CONFIG.ui.historyTitle}
            </div>
            {recentSearches.slice(0, 5).map((search, index) => (
              <SuggestionItem
                key={`recent-${index}`}
                text={search}
                icon={<Clock className="h-4 w-4 text-gray-400" />}
                onClick={() => onSuggestionClick(search)}
              />
            ))}
          </div>
        )}

        {/* Популярные запросы */}
        {popularQueries.length > 0 && (
          <div>
            <div className="px-4 py-3 text-sm font-medium text-gray-700 border-b bg-gray-50 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Популярные запросы
            </div>
            {popularQueries.slice(0, 6).map((search, index) => (
              <SuggestionItem
                key={`popular-${index}`}
                text={search}
                icon={<TrendingUp className="h-4 w-4 text-gray-400" />}
                onClick={() => onSuggestionClick(search)}
              />
            ))}
          </div>
        )}

        {/* Если нет ни истории, ни популярных запросов */}
        {recentSearches.length === 0 && popularQueries.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <Search className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            Начните вводить для поиска
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Компонент элемента результата поиска
function SearchResultItem({ 
  result, 
  query, 
  onClick 
}: { 
  result: SearchResult
  query: string
  onClick: () => void 
}) {
  const properties = result.feature.getProperties()
  const name = properties.name || properties.title || 'Без названия'
  const address = properties.address
  const category = SEARCH_CONFIG.categoryMappings[result.layer]

  // Подсветка совпадений
  const highlightText = (text: string, query: string) => {
    if (!SEARCH_CONFIG.settings.highlightMatches) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div
      onClick={onClick}
      className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Иконка категории */}
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: category?.color || '#6b7280' }}
        >
          <MapPin className="h-4 w-4" />
        </div>
        
        {/* Информация об объекте */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">
            {highlightText(name, query)}
          </div>
          
          {address && (
            <div className="text-sm text-gray-500 truncate">
              {highlightText(address, query)}
            </div>
          )}
          
          {category && (
            <div className="text-xs text-gray-400 mt-1">
              {category.name}
            </div>
          )}
        </div>
        
        {/* Скор релевантности */}
        <div className="flex-shrink-0 text-xs text-gray-400">
          {Math.round(result.score * 100)}%
        </div>
      </div>
    </div>
  )
}

// Компонент элемента предложения
function SuggestionItem({ 
  text, 
  icon, 
  onClick 
}: { 
  text: string
  icon: React.ReactNode
  onClick: () => void 
}) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-3"
    >
      {icon}
      <span className="text-gray-700 truncate">{text}</span>
    </div>
  )
} 