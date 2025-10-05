/**
 * Утилита для формирования правильных путей с учетом basePath
 */

// Функция для получения basePath во время выполнения
function getBasePath(): string {
  // В production используем /tim-map, в development - пустую строку
  return process.env.NODE_ENV === 'production' ? '/tim-map' : ''
}

/**
 * Добавляет basePath к публичному пути
 * @param path - путь относительно public (например, '/data/file.json')
 * @returns полный путь с учетом basePath
 */
export function getPublicPath(path: string): string {
  const basePath = getBasePath()
  // Убираем начальный слеш если есть
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${cleanPath}`
}

/**
 * Формирует URL для GeoJSON файла
 * @param path - путь к файлу относительно public (например, 'data/buildings/file.geojson')
 * @returns полный URL с basePath
 */
export function getGeoJSONPath(path: string): string {
  return getPublicPath(path.startsWith('/') ? path : `/${path}`)
}

