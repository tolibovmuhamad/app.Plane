# Roadmap — Soleh (задачи B)

Фронтенд таск-менеджера (см. `CLAUDE.md`). Сюда попадают **только задачи серии B**
из Plane (`taskmanagment2211`). Новые задачи добавляются по мере появления на сайте.

- Стек: React + Vite + TypeScript + axios + Tailwind + Zustand. JWT-авторизация.
- Бэкенд: `https://task-management-backend-hxtn.onrender.com` (Swagger: `/docs/`).
- Легенда статусов: `[ ]` todo · `[~]` в работе · `[x]` готово.

---

## Фаза B0 — Дизайн-система

### [ ] B0.1 — Design tokens + Tailwind theme
Перенести дизайн Plane в проект: дизайн-токены в `src/styles/globals.css` и тему в
`tailwind.config.ts`. Источник дизайна — `C:\Users\XBIT-2025\Desktop\Avengers-version bot - Home.html`
(берём только визуал).
- **Зависит от:** A0.1 (скаффолд + Tailwind должен существовать)
- **Готово, когда:**
  - Подключены шрифты: **Inter Variable** (body), **IBM Plex Mono** (моно).
  - Заведены семантические токены как CSS-переменные: `bg-canvas`, `bg-surface-1/2`,
    `bg-layer-1/2/3` (+ hover/active/selected), `bg-accent-primary`,
    `danger/success/warning/info` (primary + subtle), `text-primary/secondary/tertiary`,
    `border-*`.
  - Бренд-цвет — синий OKLCH (`--brand-500: oklch(45.11% .087 237.37)`), шкала `brand-100…1200`.
  - Радиусы: `xs .125 / sm .25 / md .375 / lg .5 / xl .75 / 2xl 1rem`.
  - Тема dark по умолчанию (`data-theme="dark"`), заложена и light.
  - В `tailwind.config.ts` цвета ссылаются на CSS-переменные → компоненты используют
    семантические имена (`bg-surface-1`, `text-secondary`), а не сырые цвета.
- **Связь:** `CLAUDE.md` → «Дизайн».

### [ ] B0.2 — App shell + layout
Каркас приложения: `AppShell`, `Sidebar`, `Topbar` в `src/components/layout/`.
Сюда же — переключатель темы (dark/light) и место под бейдж уведомлений.
- **Зависит от:** B0.1 (дизайн-токены)
- **Готово, когда:**
  - `AppShell` собирает `Sidebar` + `Topbar` + область контента (`<Outlet/>`).
  - `Sidebar`: навигация по workspace/проектам, сворачивание (состояние в `ui.store`).
  - `Topbar`: текущий workspace/проект, профиль/аватар, кнопка темы, слот под бейдж
    уведомлений (`unread_count`).
  - Семантические токены (`bg-surface-1/2`, `text-secondary`, `border-*`), без сырых цветов.
  - Адаптив: сайдбар сворачивается на узких экранах.
- **Связь:** `CLAUDE.md` → «Структура папок» (`components/layout/`), «Дизайн».

---

## Фаза B4 — Библиотека UI-компонентов (`components/ui/`)

База Plane-стиля. Все на семантических токенах из B0.1, типизированные props, без `any`.

### [ ] B4.1 — Form primitives
Базовые поля форм: `Button` (варианты/размеры/loading), `Input`, `Textarea`,
`Select`, `Checkbox`, `Label`, обёртка поля с ошибкой/хинтом.
- **Зависит от:** B0.1
- **Готово, когда:**
  - `Button`: варианты (primary/secondary/ghost/danger), размеры, состояние `disabled`/`loading`.
  - Поля поддерживают состояние ошибки (под `VALIDATION_ERROR` → ошибки по полям).
  - Доступность: `label`/`aria-*`, фокус-кольцо на токенах, клавиатура.
- **Связь:** нужны сериям A1.* (Register/Login) — согласовать API с Muhammad.

### [ ] B4.2 — Overlays
Плавающие слои: `Modal`/`Dialog`, `Dropdown`/`Menu`, `Popover`, `Tooltip`.
- **Зависит от:** B0.1
- **Готово, когда:**
  - Фокус-трап и закрытие по `Esc`/клику вне; портал в `body`; скролл-лок для модалок.
  - `Dropdown` управляется клавиатурой; позиционирование без перекрытия краёв.
- **Связь:** канбан, карточка задачи, меню действий.

### [ ] B4.3 — Feedback
Обратная связь: `Toast` (провайдер + хук), `Alert`, `Spinner`/`Loader`,
`Skeleton`, `EmptyState`.
- **Зависит от:** B0.1
- **Готово, когда:**
  - Тосты со статусами `success/danger/warning/info` (токены статусов), автоскрытие.
  - `Skeleton`/`EmptyState` для загрузки и пустых списков (задачи, уведомления).
- **Связь:** общий обработчик ошибок API (коды `CLAUDE.md` → «Формат ошибок»).

### [ ] B4.4 — Data display
Отображение данных: `Avatar` (фолбэк по инициалам), `Badge`, `Tag`/чип метки,
`Tabs`, базовый `Table`/`List`.
- **Зависит от:** B0.1
- **Готово, когда:**
  - `Avatar` из `avatar_url` с фолбэком; `Badge` под приоритеты/статусы.
  - Чип метки красится из `label.color` (#RRGGBB); `Badge` приоритета (none…urgent).
- **Связь:** карточка задачи, список задач, участники, уведомления.

---

## Контракт с Muhammad (A)
- **Зависимости:** B0.1 нужен серии A1.* (страницы auth) — согласовать набор и API
  базовых UI-компонентов.
- **Общее:** дизайн-тему и `components/ui/*` заводит Soleh; `api/client.ts` и
  `stores/auth.store.ts` заводит Muhammad (серия A) — нужны обоим.

*Новые задачи B добавляются сюда по мере появления в Plane.*
