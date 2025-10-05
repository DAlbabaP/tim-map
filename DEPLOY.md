# 🚀 Инструкция по деплою на GitHub Pages

## Первоначальная настройка

### 1. Создайте репозиторий на GitHub
1. Перейдите на [GitHub](https://github.com/new)
2. Создайте новый репозиторий (например, `university-map`)
3. **Не** инициализируйте с README, .gitignore или лицензией

### 2. Инициализируйте Git и загрузите код

Откройте терминал в папке проекта и выполните:

```bash
# Инициализация репозитория
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: University Interactive Map"

# Переименование ветки в main (если нужно)
git branch -M main

# Подключение к удалённому репозиторию (замените USERNAME и REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Загрузка кода на GitHub
git push -u origin main
```

### 3. Настройка GitHub Pages

1. Перейдите в настройки репозитория: `Settings` → `Pages`
2. В разделе **Source** выберите `GitHub Actions`
3. Сохраните изменения

### 4. Обновите конфигурацию (если нужно)

Если имя вашего репозитория **НЕ** `university-map`, обновите `basePath` в `next.config.js`:

```javascript
basePath: process.env.NODE_ENV === 'production' ? '/ВАШ_РЕПОЗИТОРИЙ' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/ВАШ_РЕПОЗИТОРИЙ' : '',
```

Замените `ВАШ_РЕПОЗИТОРИЙ` на имя вашего репозитория.

## Автоматический деплой

После настройки, каждый раз когда вы делаете `git push` в ветку `main`, сайт автоматически обновится на GitHub Pages.

```bash
git add .
git commit -m "Описание изменений"
git push
```

## Проверка деплоя

1. После push перейдите в репозиторий на GitHub
2. Откройте вкладку `Actions`
3. Дождитесь завершения workflow (зелёная галочка ✓)
4. Ваш сайт будет доступен по адресу: `https://USERNAME.github.io/REPO_NAME/`

## Локальная проверка production-сборки

Перед деплоем можно протестировать production-сборку локально:

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Просмотр собранного сайта
npm run preview
```

Откройте http://localhost:3000 для просмотра.

## Возможные проблемы

### Сайт не загружается или стили не работают
- Убедитесь, что `basePath` в `next.config.js` совпадает с именем репозитория
- Проверьте, что файл `.nojekyll` находится в папке `public`

### 404 ошибка при переходе по прямым ссылкам
- Это нормально для SPA на GitHub Pages
- При статическом экспорте Next.js все страницы экспортируются как HTML

### Workflow падает с ошибкой
- Проверьте логи в разделе `Actions`
- Убедитесь, что все зависимости установлены корректно
- Проверьте, что `npm run build` работает локально

## Полезные ссылки

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)

