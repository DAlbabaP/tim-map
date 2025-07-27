import { FieldsDisplayConfig } from '@/types'

/**
 * Конфигурация отображения полей объектов
 */
export const FIELDS_DISPLAY_CONFIG: FieldsDisplayConfig = {
  name: { 
    label: 'Название', 
    icon: 'tag', 
    priority: 1 
  },
  
  address: { 
    label: 'Адрес', 
    icon: 'map-pin', 
    priority: 2, 
    section: 'basic' 
  },
  
  description: { 
    label: 'Описание', 
    icon: 'info', 
    priority: 3, 
    section: 'basic' 
  },
  
  phone: { 
    label: 'Телефон', 
    icon: 'phone', 
    priority: 4, 
    type: 'contact', 
    section: 'contact' 
  },
  
  email: { 
    label: 'Email', 
    icon: 'mail', 
    priority: 5, 
    type: 'contact', 
    section: 'contact' 
  },
  
  website: { 
    label: 'Веб-сайт', 
    icon: 'globe', 
    priority: 6, 
    type: 'contact', 
    section: 'contact' 
  },
  
  working_hours: { 
    label: 'Часы работы', 
    icon: 'clock', 
    priority: 7, 
    section: 'contact' 
  },
  
  floors: { 
    label: 'Этажей', 
    icon: 'building', 
    priority: 8 
  },
  
  year_built: { 
    label: 'Год постройки', 
    icon: 'calendar', 
    priority: 9 
  },
  
  capacity: { 
    label: 'Вместимость', 
    icon: 'users', 
    priority: 10 
  },
  
  services: { 
    label: 'Услуги', 
    icon: 'concierge-bell', 
    priority: 11, 
    type: 'list' 
  },
  
  faculties: { 
    label: 'Факультеты', 
    icon: 'graduation-cap', 
    priority: 12, 
    type: 'list' 
  },
  
  departments: { 
    label: 'Кафедры', 
    icon: 'users', 
    priority: 13, 
    type: 'list' 
  },
  
  room_numbers: { 
    label: 'Аудитории', 
    icon: 'door-open', 
    priority: 14, 
    type: 'list', 
    section: 'rooms' 
  },
  
  total_places: { 
    label: 'Всего мест', 
    icon: 'bed', 
    priority: 15 
  },
  
  available_places: { 
    label: 'Свободно мест', 
    icon: 'bed', 
    priority: 16 
  },
  
  cost_per_month: { 
    label: 'Стоимость/месяц', 
    icon: 'banknote', 
    priority: 17, 
    type: 'currency' 
  },
  
  safety_level: { 
    label: 'Уровень безопасности', 
    icon: 'shield-check', 
    priority: 18 
  },
  
  equipment_list: { 
    label: 'Оборудование', 
    icon: 'settings', 
    priority: 19, 
    type: 'list' 
  },
  
  routes: { 
    label: 'Маршруты', 
    icon: 'route', 
    priority: 20, 
    type: 'list' 
  },
  
  schedule: { 
    label: 'Расписание', 
    icon: 'clock', 
    priority: 21 
  },
  
  has_administrations: { 
    label: 'Есть директорат', 
    icon: 'user-tie', 
    priority: 21, 
    type: 'boolean' 
  },
  
  administration_name: { 
    label: 'Название директората', 
    icon: 'building', 
    priority: 21.5 
  },
  
  administration_phone: { 
    label: 'Телефон директората', 
    icon: 'phone', 
    priority: 22, 
    type: 'contact' 
  },
  
  administration_hours: { 
    label: 'Часы работы директората', 
    icon: 'clock', 
    priority: 23 
  },
  
  administration_website: { 
    label: 'Сайт директората', 
    icon: 'globe', 
    priority: 24, 
    type: 'contact' 
  },
  
  reception_hours: { 
    label: 'Часы работы приёмной', 
    icon: 'clock', 
    priority: 25 
  },
  
  head_of_department: { 
    label: 'ФИО заведующего', 
    icon: 'user-tie', 
    priority: 26, 
    section: 'staff' 
  },
  
  head: { 
    label: 'ФИО заведующего', 
    icon: 'user-tie', 
    priority: 26, 
    section: 'staff' 
  },
  
  head_photo: { 
    label: 'Фото заведующего', 
    icon: 'image', 
    priority: 26.5, 
    type: 'image', 
    section: 'staff' 
  },
  
  room: { 
    label: 'Кабинет директората', 
    icon: 'door-open', 
    priority: 27, 
    section: 'rooms' 
  },
  
  rooms: { 
    label: 'Кабинет кафедры', 
    icon: 'door-open', 
    priority: 27, 
    type: 'list', 
    section: 'rooms' 
  },
  
  image_path: { 
    label: 'Фотография', 
    icon: 'image', 
    priority: 5.5, 
    type: 'image' 
  },
  
  has_cafeteria: { 
    label: 'Столовая', 
    icon: 'utensils', 
    priority: 30, 
    type: 'boolean' 
  },
  
  has_library: { 
    label: 'Библиотека', 
    icon: 'book', 
    priority: 31, 
    type: 'boolean' 
  },
  
  has_computer_lab: { 
    label: 'Компьютерный класс', 
    icon: 'laptop', 
    priority: 32, 
    type: 'boolean' 
  },
  
  has_wifi: { 
    label: 'Wi-Fi', 
    icon: 'wifi', 
    priority: 33, 
    type: 'boolean' 
  },
  
  has_medical: { 
    label: 'Медицинский пункт', 
    icon: 'heart-pulse', 
    priority: 34, 
    type: 'boolean' 
  },
  
  has_parking: { 
    label: 'Парковка', 
    icon: 'car', 
    priority: 35, 
    type: 'boolean' 
  },
  
  has_reception: { 
    label: 'Приёмная', 
    icon: 'concierge-bell', 
    priority: 36, 
    type: 'boolean' 
  }
}

/**
 * Группировка полей по секциям
 */
export const FIELD_SECTIONS = {
  basic: {
    title: 'Основная информация',
    icon: 'info',
    priority: 1
  },
  contact: {
    title: 'Контакты',
    icon: 'phone',
    priority: 2
  },
  staff: {
    title: 'Персонал',
    icon: 'users',
    priority: 3
  },
  rooms: {
    title: 'Помещения',
    icon: 'door-open',
    priority: 4
  },
  facilities: {
    title: 'Удобства',
    icon: 'star',
    priority: 5
  }
} as const

/**
 * Поля, которые всегда показываются первыми
 */
export const PRIORITY_FIELDS = [
  'name',
  'address', 
  'description',
  'image_path'
]

/**
 * Поля, которые скрываются по умолчанию
 */
export const HIDDEN_BY_DEFAULT_FIELDS = [
  'osm_id',
  'osm_type',
  'osm_version',
  'osm_timestamp',
  'osm_uid',
  'osm_user',
  'osm_changeset'
] 