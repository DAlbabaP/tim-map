import { SearchConfig } from '@/types'

/**
 * Полная конфигурация системы поиска
 */
export const SEARCH_CONFIG: SearchConfig = {
  version: '2.0.0',
  description: 'Конфигурация системы поиска для интерактивной карты университета',

  settings: {
    minQueryLength: 2,
    maxResults: 50,
    debounceTime: 300,
    maxHistoryItems: 10,
    fuzzySearchThreshold: 0.6,
    enableHistory: true,
    enableSuggestions: true,
    enableFilters: true,
    enableQuickActions: true,
    highlightMatches: true,
    showResultCount: true,
    groupResultsByCategory: true
  },

  searchFields: {
    primary: [
      {
        field: 'name',
        weight: 100,
        description: 'Название объекта'
      },
      {
        field: 'title', 
        weight: 90,
        description: 'Альтернативное название'
      }
    ],
    secondary: [
      {
        field: 'address',
        weight: 70,
        description: 'Адрес объекта'
      },
      {
        field: 'type',
        weight: 60,
        description: 'Тип объекта'
      },
      {
        field: 'description',
        weight: 40,
        description: 'Описание объекта'
      }
    ],
    additional: [
      {
        field: 'faculties',
        weight: 30,
        description: 'Факультеты'
      },
      {
        field: 'departments',
        weight: 25,
        description: 'Кафедры'
      },
      {
        field: 'services',
        weight: 20,
        description: 'Услуги'
      },
      {
        field: 'building_number',
        weight: 50,
        description: 'Номер здания'
      }
    ]
  },

  filters: [
    {
      id: 'all',
      label: 'Все',
      description: 'Поиск по всем типам объектов',
      icon: 'search',
      default: true,
      layers: '*'
    },
    {
      id: 'university',
      label: 'Университет',
      description: 'Университетские здания и объекты',
      icon: 'graduation-cap',
      color: '#667eea',
      layers: [
        'main_building',
        'university_buildings', 
        'dormitory_buildings',
        'lab_buildings',
        'library_buildings',
        'sport_buildings',
        'buildings_in_university'
      ]
    },
    {
      id: 'transport',
      label: 'Транспорт',
      description: 'Транспортные объекты и остановки',
      icon: 'bus',
      color: '#f39c12',
      layers: [
        'metro_stations',
        'metro_platforms',
        'tram_stops',
        'bus_stops',
        'parking'
      ]
    },
    {
      id: 'public',
      label: 'Общественные',
      description: 'Общественные здания и сервисы',
      icon: 'building',
      color: '#e74c3c',
      layers: [
        'museum_buildings',
        'cafe_buildings'
      ]
    },
    {
      id: 'poi',
      label: 'Точки интереса',
      description: 'Кафедры, деканаты и другие POI',
      icon: 'star',
      color: '#8e44ad',
      layers: [
        'cafe',
        'atm',
        'lab',
        'museum',
        'deanery',
        'departments'
      ]
    }
  ],

  suggestions: {
    enabled: true,
    maxSuggestions: 8,
    showIcons: true,
    showCategory: true,
    showDistance: false,
    groupByCategory: true,
    highlightMatches: true,
    showQuickActions: true
  },

  quickSearches: [
    {
      text: 'Библиотеки',
      icon: 'book',
      query: 'библиотека',
      filter: 'university',
      description: 'Найти все библиотеки'
    },
    {
      text: 'Столовые',
      icon: 'utensils', 
      query: 'столовая буфет кафе',
      filter: 'all',
      description: 'Места питания'
    },
    {
      text: 'Общежития',
      icon: 'home',
      query: 'общежитие',
      filter: 'university',
      description: 'Студенческие общежития'
    },
    {
      text: 'Спортзалы',
      icon: 'dumbbell',
      query: 'спорт зал',
      filter: 'university', 
      description: 'Спортивные объекты'
    },
    {
      text: 'Лаборатории',
      icon: 'flask',
      query: 'лаборатория',
      filter: 'university',
      description: 'Исследовательские лаборатории'
    },
    {
      text: 'Метро',
      icon: 'train',
      query: 'метро станция',
      filter: 'transport',
      description: 'Станции метрополитена'
    }
  ],

  categoryMappings: {
    main_building: {
      name: 'Главное здание',
      icon: 'building-columns',
      color: '#667eea'
    },
    university_buildings: {
      name: 'Учебные здания',
      icon: 'school', 
      color: '#3742fa'
    },
    dormitory_buildings: {
      name: 'Общежития',
      icon: 'home',
      color: '#2ed573'
    },
    lab_buildings: {
      name: 'Лаборатории',
      icon: 'flask',
      color: '#ff4757'
    },
    library_buildings: {
      name: 'Библиотеки',
      icon: 'book',
      color: '#ffa502'
    },
    sport_buildings: {
      name: 'Спорт',
      icon: 'dumbbell',
      color: '#ff6b6b'
    },
    buildings_in_university: {
      name: 'Университетские здания',
      icon: 'building',
      color: '#a55eea'
    },
    museum_buildings: {
      name: 'Музеи',
      icon: 'landmark',
      color: '#fd79a8'
    },
    cafe_buildings: {
      name: 'Кафе и рестораны',
      icon: 'coffee',
      color: '#fdcb6e'
    },
    metro_stations: {
      name: 'Станции метро',
      icon: 'train',
      color: '#00b894'
    },
    metro_platforms: {
      name: 'Платформы',
      icon: 'train',
      color: '#55a3ff'
    },
    tram_stops: {
      name: 'Трамвайные остановки',
      icon: 'tram',
      color: '#f39c12'
    },
    bus_stops: {
      name: 'Автобусные остановки',
      icon: 'bus',
      color: '#e74c3c'
    },
    departments: {
      name: 'Кафедры',
      icon: 'users',
      color: '#9b59b6'
    }
  },

  popularQueries: [
    'главное здание',
    'общежитие',
    'библиотека',
    'столовая',
    'спортзал',
    'метро университет',
    'физический факультет',
    'химический факультет',
    'лаборатория',
    'музей'
  ],

  synonyms: {
    'столовая': ['буфет', 'кафе', 'питание', 'еда'],
    'общежитие': ['общага', 'дом', 'резиденция'],
    'библиотека': ['читалка', 'читальный зал', 'книги'],
    'спорт': ['спортзал', 'фитнес', 'тренажерный зал'],
    'лаборатория': ['лаба', 'научная лаборатория'],
    'метро': ['подземка', 'станция метро', 'метрополитен'],
    'факультет': ['фак', 'институт', 'отделение'],
    'кафедра': ['каф', 'департамент'],
    'аудитория': ['ауд', 'класс', 'комната']
  },

  stopWords: [
    'в', 'на', 'у', 'с', 'к', 'от', 'для', 'по', 'из', 'о', 'и', 'а', 'но', 'или',
    'здание', 'корпус', 'дом', 'объект', 'место', 'территория'
  ],

  ui: {
    placeholder: 'Поиск зданий, адресов, объектов...',
    noResultsMessage: 'По вашему запросу ничего не найдено',
    loadingMessage: 'Поиск...',
    errorMessage: 'Ошибка поиска. Попробуйте еще раз.',
    historyTitle: 'История поиска',
    quickActionsTitle: 'Быстрые действия',
    suggestionsTitle: 'Предложения',
    clearHistoryText: 'Очистить историю',
    showMoreText: 'Показать еще',
    showLessText: 'Свернуть'
  },

  analytics: {
    enabled: false,
    trackQueries: true,
    trackClicks: true,
    trackFilters: true,
    trackHistory: false
  }
} 