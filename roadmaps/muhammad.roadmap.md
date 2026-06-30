# Roadmap — Muhammad (задачи A)

Фронтенд таск-менеджера (см. `CLAUDE.md`). Сюда попадают **только задачи с серии A**
из Plane (`taskmanagment2211`). Новые задачи добавляются по мере появления на сайте.

- Стек: React + Vite + TypeScript + axios + Tailwind + Zustand. JWT-авторизация.
- Бэкенд: `https://task-management-backend-hxtn.onrender.com` (Swagger: `/docs/`).
- Легенда статусов: `[ ]` todo · `[~]` в работе · `[x]` готово.

---

## Фаза A0 — Фундамент

### [ ] A0.1 — Project scaffold
Скаффолд проекта: Vite + React + TypeScript, Tailwind, ESLint/Prettier, базовая
структура папок из `CLAUDE.md` (`src/api`, `stores`, `features`, `components`, `styles`…).
- **Зависит от:** —
- **Готово, когда:** `npm run dev` поднимает пустое приложение; Tailwind работает;
  структура папок заведена; `.env` с `VITE_API_URL`.
- **Связь:** `CLAUDE.md` → «Структура папок», «Технологии».

### [ ] A0.2 — API client + auth plumbing
Единый axios-инстанс (`src/api/client.ts`): `baseURL` из env, request-интерсептор
с `Authorization: Bearer`, response-интерсептор с refresh-and-retry на `401`.
- **Зависит от:** A0.1
- **Готово, когда:** есть `client.ts`; на `401` дёргается `/api/v1/auth/refresh`,
  токены ротируются, исходный запрос повторяется один раз; гонка обновления защищена
  общим in-flight промисом.
- **Эндпоинты:** `POST /api/v1/auth/refresh`.
- **Связь:** `CLAUDE.md` → «Авторизация (JWT)».

### [ ] A0.3 — Auth/session store + protected routes
Zustand-стор сессии (`stores/auth.store.ts`): access (в памяти) + refresh, `user`,
`login/logout/setTokens`. Защищённые роуты (React Router): без сессии → `/login`.
- **Зависит от:** A0.2
- **Готово, когда:** стор хранит токены и `user`; `ProtectedRoute` редиректит
  неавторизованных; `logout()` зовёт `/auth/logout` и чистит стор.
- **Эндпоинты:** `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`.
- **Связь:** `CLAUDE.md` → «Авторизация (JWT)».

---

## Фаза A1 — Авторизация (страницы)

### [ ] A1.1 — Register page
Страница регистрации: форма `email`, `password` (≥8), `display_name` (1–100).
- **Зависит от:** A0.2, A0.3 (а также дизайн-токены/UI от Soleh: B0.1)
- **Готово, когда:** валидная форма создаёт пользователя, сохраняет пару токенов,
  редиректит в приложение; ошибки `VALIDATION_ERROR`/`CONFLICT` показываются по полям.
- **Эндпоинты:** `POST /api/v1/auth/register`.

### [ ] A1.2 — Login page
Страница входа: `email` + `password`.
- **Зависит от:** A0.2, A0.3 (дизайн: B0.1)
- **Готово, когда:** успешный вход сохраняет токены и `user`, редиректит;
  `401`/неверные данные — понятная ошибка.
- **Эндпоинты:** `POST /api/v1/auth/login`.

### [ ] A1.3 — Logout
Выход: кнопка/действие, отзыв refresh-токена, очистка сессии, редирект на `/login`.
- **Зависит от:** A0.3
- **Готово, когда:** `logout()` вызывает `/auth/logout` с refresh-токеном, чистит
  стор и локальное хранилище, уводит на `/login`.
- **Эндпоинты:** `POST /api/v1/auth/logout`.

---

## Контракт с Soleh (B)
- **Зависимости:** A1.* (страницы) используют дизайн-токены и базовые UI-компоненты
  из **B0.1** (и далее из библиотеки UI Soleh) — согласовать API компонентов
  (`Button`, `Input`, форм-поля).
- **Общее:** `components/ui/*` и дизайн-тему заводит Soleh (серия B);
  Muhammad заводит `api/client.ts` и `stores/auth.store.ts` (нужны обоим).

*Новые задачи A добавляются сюда по мере появления в Plane.*
