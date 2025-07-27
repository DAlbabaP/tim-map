# 🗺️ Интерактивная карта университета 2.0

Современная интерактивная карта университета, построенная на Next.js 14 с TypeScript и Tailwind CSS.

## 🚀 Особенности

- **Современный стек**: Next.js 14, React 18, TypeScript 5
- **Интерактивная карта**: OpenLayers 8 с поддержкой GeoJSON
- **Быстрый поиск**: Полнотекстовый поиск с автодополнением
- **Адаптивный дизайн**: Работает на всех устройствах
- **Типобезопасность**: Полная типизация TypeScript
- **Производительность**: Оптимизированная загрузка и рендеринг

## 📁 Структура проекта

```
university-map/
├── app/                    # Next.js 14 App Router
├── components/            # React компоненты
├── lib/                   # Утилиты и логика
├── types/                 # TypeScript типы
├── config/                # Конфигурация в TS
├── public/                # Статические файлы
│   ├── data/             # GeoJSON данные
│   ├── images/           # Изображения
│   └── icons/            # Иконки
├── hooks/                 # React хуки
├── stores/                # Состояние приложения
└── tests/                 # Тесты
```

## 🛠️ Установка и запуск

### Требования

- Node.js 18+ 
- npm 8+

### Шаги установки

1. **Установка зависимостей**
   ```bash
   npm install
   ```

2. **Перенос данных из старого сайта**
   
   Скопируйте следующие папки из `website/` в `website2.0/public/`:
   ```
   website/data/        → website2.0/public/data/
   website/image/       → website2.0/public/images/
   ```

3. **Запуск в режиме разработки**
   ```bash
   npm run dev
   ```

4. **Открыть в браузере**
   ```
   http://localhost:3000
   ```

## 📂 Миграция файлов

### Обязательные файлы для копирования

Из папки `website/` скопируйте в `website2.0/public/`:

**GeoJSON данные:**
```
data/buildings/           → public/data/buildings/
data/poi/                → public/data/poi/
data/transport/          → public/data/transport/
data/infrastructure/     → public/data/infrastructure/
data/nature/             → public/data/nature/
```

**Изображения:**
```
image/icons/             → public/images/icons/
image/deanarys/          → public/images/deanery/
image/dormitory_buildings/ → public/images/dormitory/
image/lab_buildings/     → public/images/laboratory/
image/university_buildings/ → public/images/university/
```

**Базовые карты (если есть):**
```
tiles/                   → public/tiles/
```

## 🎨 Конфигурация

Все конфигурации теперь в TypeScript с полной типизацией:

- `config/map.ts` - настройки карты
- `config/categories.ts` - категории объектов  
- `config/layers.ts` - конфигурация слоев
- `config/search.ts` - настройки поиска
- `config/fields.ts` - отображение полей
- `config/facts.ts` - факты для загрузки

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты  
npm run test:e2e

# Покрытие кода
npm run test:coverage
```

## 🏗️ Сборка для продакшена

```bash
# Сборка
npm run build

# Запуск продакшен версии
npm start

# Статический экспорт
npm run build && npm run export
```

## ⚡ Производительность

- **Code Splitting**: Автоматическое разделение кода
- **Image Optimization**: Оптимизация изображений Next.js
- **Bundle Analysis**: Анализ размера бандла
- **Prefetching**: Предзагрузка маршрутов

## 🔧 Разработка

### Горячие клавиши

- `Ctrl+K` - Открыть поиск
- `Ctrl+Shift+1` - Переключить панель категорий
- `Ctrl+Shift+R` - Перезагрузить данные карты

### Добавление новых слоев

1. Добавьте GeoJSON файл в `public/data/`
2. Обновите `config/layers.ts`
3. Добавьте в категорию в `config/categories.ts`
4. Обновите типы в `types/index.ts` если нужно

### Кастомизация стилей

Все стили в Tailwind CSS. Основные цвета настроены в `tailwind.config.ts`:

- `university.primary` - основной зеленый  
- `university.accent` - акцентный синий
- `category.*` - цвета категорий

## 📱 Адаптивность

Поддерживаемые размеры экранов:
- Mobile: 320px+
- Tablet: 768px+  
- Desktop: 1024px+
- Large: 1280px+

## 🔒 Безопасность

- Content Security Policy (CSP)
- XSS Protection
- Clickjacking Protection
- Input Validation
- Sanitization данных

## 📈 Аналитика

Настройка аналитики в `config/index.ts`:

```typescript
analytics: {
  enabled: true, // включить в продакшене
  trackPageViews: true,
  trackUserInteractions: true,
  trackPerformance: true
}
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📝 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 👥 Команда

- **Frontend**: React + TypeScript + Tailwind
- **Maps**: OpenLayers 8
- **Data**: GeoJSON + REST API
- **Testing**: Vitest + Playwright
- **Deploy**: Vercel / Netlify

## 🆘 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [Issues](https://github.com/university/interactive-map/issues)
2. Создайте новый Issue с детальным описанием
3. Укажите версию браузера и ОС

---

**Версия**: 2.0.0  
**Последнее обновление**: 2024 