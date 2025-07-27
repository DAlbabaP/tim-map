'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { useSearchStore } from '@/stores/searchStore'
import { SearchSuggestions } from './SearchSuggestions'
import { SEARCH_CONFIG } from '@/config/search'

interface SearchInputProps {
  className?: string
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function SearchInput({ 
  className = '', 
  placeholder,
  onFocus,
  onBlur 
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const {
    query,
    setQuery,
    results,
    isSearching,
    suggestions,
    recentSearches,
    popularQueries,
    performSearch,
    clearQuery,
    addToHistory
  } = useSearchStore()

  // Дебаунсированный поиск
  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string) => {
      if (searchQuery.length >= SEARCH_CONFIG.settings.minQueryLength) {
        performSearch(searchQuery)
      }
    },
    SEARCH_CONFIG.settings.debounceTime
  )

  // Обработка ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length >= SEARCH_CONFIG.settings.minQueryLength) {
      debouncedSearch(value)
    }
  }

  // Обработка фокуса
  const handleFocus = () => {
    setIsFocused(true)
    setShowSuggestions(true)
    onFocus?.()
  }

  // Обработка потери фокуса
  const handleBlur = () => {
    // Задержка чтобы успел сработать клик по предложению
    setTimeout(() => {
      setIsFocused(false)
      setShowSuggestions(false)
      onBlur?.()
    }, 150)
  }

  // Обработка нажатий клавиш
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault()
      addToHistory(query.trim())
      setShowSuggestions(false)
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  // Очистка поиска
  const handleClear = () => {
    clearQuery()
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Обработка клика на предложение
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    addToHistory(suggestion)
    performSearch(suggestion)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  // Глобальный хоткей Ctrl+K
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleGlobalKeydown)
    return () => document.removeEventListener('keydown', handleGlobalKeydown)
  }, [])

  const shouldShowSuggestions = showSuggestions && (
    query.length > 0 || 
    recentSearches.length > 0 || 
    popularQueries.length > 0
  )

  return (
    <div className="relative w-full">
      {/* Поле ввода */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || SEARCH_CONFIG.ui.placeholder}
          className={`search-input pr-10 ${className}`}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Кнопка очистки */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Очистить поиск"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Индикатор загрузки */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="loading-spinner h-4 w-4" />
          </div>
        )}
      </div>

      {/* Предложения поиска */}
      {shouldShowSuggestions && (
        <SearchSuggestions
          query={query}
          results={results}
          suggestions={suggestions}
          recentSearches={recentSearches}
          popularQueries={popularQueries}
          isSearching={isSearching}
          onSuggestionClick={handleSuggestionClick}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      {/* Хинт для хоткея */}
      {!isFocused && !query && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden text-xs text-white/60 md:block">
          <kbd className="rounded bg-white/10 px-2 py-1">Ctrl+K</kbd>
        </div>
      )}
    </div>
  )
} 