/**
 * Утилиты для работы с путями в приложении
 * Учитывает basePath для GitHub Pages
 */

// Базовый путь для production (GitHub Pages)
const BASE_PATH = '/tim-map'

/**
 * Получить базовый путь приложения
 * В production это будет '/tim-map', в development - ''
 */
export function getBasePath(): string {
  // Проверяем переменную окружения
  const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH
  
  if (envBasePath !== undefined) {
    return envBasePath
  }
  
  // Fallback: используем NODE_ENV
  return process.env.NODE_ENV === 'production' ? BASE_PATH : ''
}

/**
 * Добавляет basePath к пути статического файла
 * @param path - путь к файлу (например, 'data/buildings/main.geojson')
 * @returns полный путь с учётом basePath
 */
export function getPublicPath(path: string): string {
  const basePath = getBasePath()
  
  // Убираем начальный слеш если есть
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Возвращаем путь с basePath
  return `${basePath}/${cleanPath}`
}

/**
 * Создаёт правильный URL для fetch запроса
 * @param path - путь к ресурсу
 * @returns URL с учётом basePath
 */
export function getApiPath(path: string): string {
  return getPublicPath(path)
}

