# Users Catalog

Тестовое задание: страница-каталог пользователей с использованием публичного API DummyJSON.

## Функциональность

- отображение списка пользователей
- поиск по имени
- пагинация
- debounce для поиска
- адаптивный и аккуратный интерфейс

## Стек

- React
- TypeScript
- Vite
- CSS Modules

## API

Использован публичный API:

- `GET /users?limit=10&skip=0`
- `GET /users/search?q=Emily`

Документация:
`https://dummyjson.com/docs/users`

## Установка и запуск

```bash
npm install
npm run dev

## Репозиторий

https://github.com/nikita-dev24/users-catalog