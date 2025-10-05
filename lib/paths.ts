/**
 * Утилита для формирования правильных путей с учетом basePath
 */

// Получаем basePath из переменной окружения Next.js
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * Добавляет basePath к публичному пути
 * @param path - путь относительно public (например, '/data/file.json')
 * @returns полный путь с учетом basePath
 */
export function getPublicPath(path: string): string {
  // Убираем начальный слеш если есть
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_PATH}${cleanPath}`
}

/**
 * Формирует URL для GeoJSON файла
 * @param path - путь к файлу относительно public (например, 'data/buildings/file.geojson')
 * @returns полный URL с basePath
 */
export function getGeoJSONPath(path: string): string {
  return getPublicPath(path.startsWith('/') ? path : `/${path}`)
}

