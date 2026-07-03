# CLAUDE.md — Фронтенд для Task Management

Этот файл направляет Claude Code при разработке **фронтенда** таск-менеджера
(в духе Plane/Jira), который работает с REST API `task-management-backend`.
Здесь: технологии, структура папок, дизайн, поток авторизации и полный контракт
API (эндпоинты, тела запросов/ответов, ошибки, пагинация).

---

## Технологии

| Слой | Выбор |
|---|---|
| Сборка | **Vite** |
| UI-фреймворк | **React** |
| Язык | **TypeScript** (strict) |
| HTTP-клиент | **axios** (один инстанс + интерсепторы) |
| Стили | **Tailwind CSS** (дизайн-токены Plane) |
| Состояние | **Zustand** (auth, workspace, ui) |
| Серверные данные | **TanStack Query** (рекомендуется для кеша/запросов) |
| Роутинг | **React Router** |
| Авторизация | **JWT** (access в памяти + refresh с ротацией) |

Правила:
- TypeScript strict, никаких `any` без причины.
- Все запросы к API — только через единый axios-инстанс (`src/api/client.ts`).
- Серверное состояние — в TanStack Query, **не** дублировать его в Zustand.
  Zustand — только для клиентского состояния (токены, текущий workspace, UI).
- Базовый URL и секреты — только через env (`import.meta.env`), не зашивать в код.

---

## Бэкенд (источник истины по API)

- **Base URL (прод):** `https://task-management-backend-hxtn.onrender.com`
- **Swagger / OpenAPI:** https://task-management-backend-hxtn.onrender.com/docs/
- **Префикс API:** все эндпоинты под `/api/v1` (health-check — `/health`).
- **Base URL (локально):** `http://localhost:3000`

> Если что-то в этом файле разойдётся с реальностью — **Swagger выше является
> источником истины**. Типы фронтенда стоит генерировать из него
> (`openapi-typescript` → `/docs/json`), а не писать руками.

Положи URL в `.env`:
```
VITE_API_URL=https://task-management-backend-hxtn.onrender.com
```

---

## Дизайн

**Референс:** `C:\Users\XBIT-2025\Desktop\Avengers-version bot - Home.html`
(сохранённая страница реального Plane — берём из неё **только дизайн**: цвета,
шрифты, радиусы, общий вид). Это не Figma — это живой CSS Plane, переносим
визуальный стиль 1:1.

**Извлечённые дизайн-токены (тема по умолчанию — тёмная):**

- **Шрифты:**
  - Основной (body): **Inter Variable** (есть кириллица)
  - Моноширинный (код/ключи задач): **IBM Plex Mono** / JetBrains Mono
- **Бренд-цвет:** синий, в OKLCH. Базовый `--brand-500: oklch(45.11% .087 237.37)`,
  полная шкала `brand-100 … brand-1200`.
- **Семантические токены** (как в Plane), нужно завести в Tailwind-теме:
  - Фоны/поверхности: `bg-canvas`, `bg-surface-1/2`, `bg-layer-1/2/3`
    (+ состояния `-hover`, `-active`, `-selected`)
  - Акцент: `bg-accent-primary` (+ hover/active), `text-accent`
  - Статусы: `danger` (красный), `success` (зелёный), `warning` (жёлтый),
    `info` (синий) — каждый с `primary` и `subtle`
  - Текст: `text-primary`, `text-secondary`, `text-tertiary`, `text-placeholder`
  - Границы: `border-*`
- **Радиусы:** `xs .125rem`, `sm .25rem`, `md .375rem`, `lg .5rem`, `xl .75rem`, `2xl 1rem`
- **Тема:** dark по умолчанию (`data-theme="dark"`), стоит заложить и light.

Реализация: завести токены как CSS-переменные в `src/styles/globals.css`, а в
`tailwind.config.ts` сослаться на них через `colors: { ... 'var(--...)' }` —
так компоненты используют семантические имена (`bg-surface-1`, `text-secondary`),
а не сырые цвета.

---

## Структура папок

```
TASK-MANAGMEN/
├─ .env                       # переменные окружения (VITE_API_URL — базовый URL бэкенда)
├─ index.html                 # HTML-каркас; сюда Vite подключает main.tsx
├─ tailwind.config.ts         # конфиг Tailwind: семантические токены → CSS-переменные
├─ tsconfig.json              # настройки TypeScript (strict-режим)
├─ vite.config.ts             # конфиг сборщика Vite (плагины, алиасы, dev-сервер)
└─ src/                       # ВЕСЬ исходный код приложения
   ├─ main.tsx                # точка входа: монтирует React в #root, оборачивает в providers
   ├─ App.tsx                 # корневой компонент (обычно рендерит роутер/лейаут)
   ├─ app/                    # «сборка» приложения: как всё склеено вместе
   │  ├─ router.tsx           # все маршруты (URL → страница) + ProtectedRoute (защита по авторизации)
   │  └─ providers.tsx        # глобальные обёртки: QueryClientProvider (TanStack Query), тема, тосты
   ├─ api/                    # ВСЁ общение с бэкендом (сеть) — только тут
   │  ├─ client.ts            # единый axios-инстанс + интерсепторы (подстановка Bearer, авто-refresh при 401)
   │  ├─ endpoints/           # по одной функции-обёртке на каждый модуль бэкенда:
   │  │  ├─ auth.ts           #   логин/регистрация/refresh/logout/me
   │  │  ├─ workspaces.ts     #   рабочие пространства
   │  │  ├─ projects.ts       #   проекты внутри workspace
   │  │  ├─ issues.ts         #   задачи (главная сущность)
   │  │  ├─ states.ts         #   статусы задач (колонки канбана)
   │  │  ├─ labels.ts         #   метки/теги
   │  │  ├─ comments.ts       #   комментарии к задачам
   │  │  ├─ cycles.ts         #   циклы (спринты)
   │  │  ├─ modules.ts        #   модули (группы задач)
   │  │  └─ notifications.ts  #   уведомления
   │  └─ types.ts             # TypeScript-типы ответов/запросов API (лучше генерить из OpenAPI)
   ├─ stores/                 # Zustand — ТОЛЬКО клиентское состояние (не серверные данные!)
   │  ├─ auth.store.ts        # access/refresh токены, текущий user, действия login/logout
   │  ├─ workspace.store.ts   # что сейчас выбрано: workspaceSlug / projectId
   │  └─ ui.store.ts          # состояние интерфейса: открыт ли сайдбар, модалки, тема
   ├─ features/               # ФИЧИ по доменам: вся логика фичи (страницы+компоненты+хуки) в своей папке
   │  ├─ auth/                # экраны входа/регистрации + связанные хуки
   │  ├─ workspaces/          # выбор/создание/настройки рабочих пространств
   │  ├─ projects/            # список и настройки проектов
   │  ├─ issues/              # задачи: список, доска (kanban), карточка задачи
   │  ├─ cycles/              # спринты
   │  ├─ modules/            # модули
   │  └─ notifications/       # центр уведомлений
   ├─ components/             # ПЕРЕИСПОЛЬЗУЕМЫЕ компоненты (не привязаны к одной фиче)
   │  ├─ ui/                  # базовые кирпичики в стиле Plane: Button, Input, Modal, Avatar, Badge, Dropdown…
   │  └─ layout/              # каркас страницы: AppShell (общая обёртка), Sidebar, Topbar
   ├─ hooks/                  # общие React-хуки: useDebounce, useMediaQuery…
   ├─ lib/                    # чистые утилиты без React: cn() (склейка классов), работа с датами, markdown
   ├─ config/                 # конфигурация приложения
   │  └─ env.ts               # типизированный и безопасный доступ к import.meta.env
   └─ styles/                 # глобальные стили
      └─ globals.css          # дизайн-токены Plane (цвета в OKLCH) + подключение шрифтов (@font-face)
```

**Как читать этот проект (снизу вверх по слоям):**

| Слой | Папка | За что отвечает | Куда смотреть первым |
|---|---|---|---|
| Точка входа | `src/main.tsx`, `App.tsx` | Запуск React, монтирование в HTML | С чего всё начинается |
| Сборка | `src/app/` | Роуты и глобальные провайдеры | Какой URL → какая страница (`router.tsx`) |
| Сеть | `src/api/` | Общение с бэкендом, типы, авторизация | `client.ts` (как летят запросы), `endpoints/` (что можно запросить) |
| Состояние | `src/stores/` | Клиентское состояние (токены, выбор, UI) | Кто залогинен, что выбрано |
| Фичи | `src/features/` | Экраны и логика по доменам | Основная работа приложения |
| UI | `src/components/` | Переиспользуемые компоненты и каркас | Из чего собраны экраны |
| Хелперы | `src/hooks/`, `src/lib/`, `src/config/` | Общие хуки и утилиты | Вспомогательный код |
| Стили | `src/styles/` | Дизайн-токены и шрифты | Цвета, темы, типографика |

Принцип: **feature-based**. Логика фичи живёт в `features/<имя>/`
(страницы, компоненты, хуки), переиспользуемый UI — в `components/ui/`,
доступ к сети — в `api/endpoints/`. Правило потока данных:
**компонент фичи → хук → `api/endpoints/` → `api/client.ts` → бэкенд**;
серверные данные держим в TanStack Query, клиентские — в `stores/`.

---

## Авторизация (JWT)

Поток: access-токен (**15 мин**) + ротируемый refresh-токен (**7 дней**).
Все эндпоинты с данными требуют `Authorization: Bearer <access_token>`.

**Ответ `/register`, `/login`, `/refresh`:**
```json
{
  "access_token": "jwt...",
  "refresh_token": "jwt...",
  "user": { "id", "email", "display_name", "avatar_url", "is_active", "created_at", "updated_at" }
}
```

**Что обязан делать фронтенд (`api/client.ts` + `stores/auth.store.ts`):**
1. `access_token` хранить в памяти (Zustand), `refresh_token` — более надёжно
   (например, `localStorage` или httpOnly-cookie через прокси).
2. **Request-интерсептор** подставляет `Authorization: Bearer <access>`.
3. **Response-интерсептор**: при `401 UNAUTHORIZED` → вызвать
   `POST /api/v1/auth/refresh` с refresh-токеном, **заменить ОБА токена** (они
   ротируются!), повторить исходный запрос один раз. Защита от гонки —
   общий in-flight промис обновления.
4. Если сам refresh вернул `401` → сессия мертва → `logout()` + редирект на `/login`.
5. `logout()` → `POST /api/v1/auth/logout` с refresh-токеном, затем очистка стора.

---

## Иерархия URL и ресурсов

Workspace адресуется по **slug**, всё ниже — по **id** (UUID).

```
/api/v1/auth/...
/api/v1/workspaces
/api/v1/workspaces/:workspaceSlug
/api/v1/workspaces/:workspaceSlug/members
/api/v1/workspaces/:workspaceSlug/notifications
/api/v1/workspaces/:workspaceSlug/projects
/api/v1/workspaces/:workspaceSlug/projects/:projectId
        .../states  .../labels  .../cycles  .../modules
        .../issues  .../issues/:issueId
        .../issues/:issueId/comments
        .../issues/:issueId/relations
        .../issues/:issueId/activity
        .../issues/:issueId/attachments
        .../attachments/:attachmentId        (удаление — на уровне проекта)
```

Не-участник workspace → `403 FORBIDDEN`; неизвестный ресурс → `404 NOT_FOUND`.

---

## Роли и права (управляют UI)

**Workspace:** `owner` > `admin` > `member` > `guest`.
**Проект:** `admin` > `member` > `viewer`.

| Действие | Нужная роль |
|---|---|
| Чтение проектов/задач/статусов/меток/циклов/модулей | любой участник |
| Создание/изменение/удаление проектов, статусов, меток | `admin`+ workspace |
| Изменение workspace | `admin`+ ; удаление workspace | `owner` |
| Управление участниками workspace | `admin`+ |
| Создание/изменение/удаление задач, комментариев, циклов, модулей, связей, вложений | любой участник |
| Редактирование/удаление комментария | автор или admin |
| Удаление вложения | загрузивший или admin/owner |

Скрывай кнопки по роли, но всегда обрабатывай `403` (бэкенд — финальный авторитет).

---

## Формат ошибок

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": { } } }
```

Коды: `BAD_REQUEST`, `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401),
`FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429),
`INTERNAL_ERROR` (500). Ветвись по `code`, не по тексту. `VALIDATION_ERROR`
несёт ошибки по полям в `details` → маппи на форму.

---

## Пагинация

- **Курсор (задачи, уведомления):** `?limit=<1-100, def 50>&cursor=<...>` →
  `{ data: [...], next_cursor: "..."|null }`. Для бесконечной прокрутки
  передавай обратно последний `next_cursor`.
- **Простые массивы (workspaces, projects, states, labels, cycles, modules,
  comments, members, relations, activity):** ответ — просто JSON-массив.

---

## Справочник эндпоинтов

UUID — строки, даты — ISO-8601 (nullable где отмечено). `?` = необязательно.

### Auth — `/api/v1/auth`
| Метод | Путь | Тело | Возвращает |
|---|---|---|---|
| POST | `/register` | `{ email, password(≥8), display_name(1–100) }` | `201` пара токенов |
| POST | `/login` | `{ email, password }` | `200` пара токенов |
| POST | `/refresh` | `{ refresh_token }` | `200` пара (ротирована) |
| POST | `/logout` | `{ refresh_token }` | `204` |
| GET | `/me` | — | пользователь |
| PATCH | `/me` | `{ display_name?, avatar_url?(nullable) }` | пользователь |

### Workspaces — `/api/v1/workspaces`
| Метод | Путь | Тело | Возвращает |
|---|---|---|---|
| GET | `/` | — | массив workspace'ов |
| POST | `/` | `{ name(1–100), slug([a-z0-9-],2–50) }` | `201` workspace |
| GET | `/:workspaceSlug` | — | workspace |
| PATCH | `/:workspaceSlug` | `{ name?, slug? }` | workspace *(admin+)* |
| DELETE | `/:workspaceSlug` | — | `204` *(owner)* |

**Объект:** `{ id, name, slug, owner_id, created_at, updated_at }`.

#### Участники — `/:workspaceSlug/members`
| GET `/` | список | • POST `/` `{ user_id, role?:admin\|member\|guest }` *(admin+)* |
| PATCH `/:userId` `{ role }` *(admin+)* | • DELETE `/:userId` *(admin+)* |

**Объект:** `{ workspace_id, user_id, role, created_at, updated_at, user:{ id, email, display_name, avatar_url } }`.
> MVP: только добавление существующих пользователей по `user_id` (без email-инвайтов).

### Projects — `/:workspaceSlug/projects`
| Метод | Путь | Тело | Возвращает |
|---|---|---|---|
| GET | `/` | — | массив проектов |
| POST | `/` | `{ name(1–100), identifier([A-Z0-9],1–10), description?, lead_id? }` | `201` *(admin+)* |
| GET | `/:projectId` | — | проект |
| PATCH | `/:projectId` | `{ name?, description?, lead_id?, is_archived? }` | *(admin+)* |
| DELETE | `/:projectId` | — | `204` *(admin+)* |

**Объект:** `{ id, workspace_id, name, identifier, description, lead_id, is_archived, created_at, updated_at }`.
`identifier` — префикс ключа задачи (`MOB` → `MOB-123`).
Участники проекта: `GET/POST /:projectId/members`, `DELETE /:projectId/members/:userId` (`role: admin|member|viewer`).

### States — `/:projectId/states`
| GET `/` | • POST `/` `{ name(1–50), color(#RRGGBB), group, order?, is_default? }` *(admin+)* |
| PATCH `/:stateId` | • DELETE `/:stateId` `{ transfer_to_state_id? }` *(admin+)* |

**Объект:** `{ id, project_id, name, color, group, order, is_default, created_at, updated_at }`.
`group` ∈ `backlog | unstarted | started | completed | cancelled` (управляет % прогресса).

### Labels — `/:projectId/labels` (метки в рамках проекта)
| GET `/` | • POST `/` `{ name(1–50), color(#RRGGBB) }` *(admin+)* | PATCH/DELETE `/:labelId` *(admin+)* |
**Объект:** `{ id, workspace_id, project_id, name, color, created_at, updated_at }`.

### Issues — `/:projectId/issues` (главная сущность)
| Метод | Путь | Тело | Возвращает |
|---|---|---|---|
| GET | `/` | (фильтры ниже) | пагинировано **или** сгруппировано |
| POST | `/` | тело создания | `201` задача |
| GET | `/:issueId` | — | задача |
| PATCH | `/:issueId` | тело обновления | задача |
| DELETE | `/:issueId` | — | `204` (мягкое удаление) |
| POST/DELETE | `/:issueId/assignees[/:userId]` | `{ user_id }` | задача |
| POST/DELETE | `/:issueId/labels[/:labelId]` | `{ label_id }` | задача |

**Создание:** `{ title(1–500), state_id (обязательно), description?, priority?, parent_id?, assignee_ids?:uuid[], label_ids?:uuid[], start_date?, due_date?, estimate_points? }`.
**Обновление:** те же поля опциональны + `sort_order?` (без `assignee_ids`/`label_ids` — для них под-роуты).

**Объект:** `{ id, workspace_id, project_id, sequence_id, title, description, state_id, priority(none|low|medium|high|urgent), parent_id, estimate_points, start_date, due_date, completed_at, created_by_id, sort_order, created_at, updated_at, assignees[], labels[] }`.
- `sequence_id` + `identifier` проекта = ключ `MOB-123`.
- `parent_id` = подзадача (только 1 уровень). Описание/тело — **markdown**.

**Фильтры (query, AND):** `state[]`, `priority[]`, `assignee[]`, `label[]`,
`cycle`, `module`, `created_by`, `parent_id`, `search`, `due_before`, `due_after`,
`created_before`, `created_after`, `sort_by`(created_at|updated_at|priority|due_date|sort_order),
`order`(asc|desc), `group_by`(state|priority|assignee), `cursor`, `limit`.
Массивы — повтором: `?state=<id>&state=<id>&priority=high`.

**Два формата ответа `GET /issues`:**
- По умолчанию → `{ data:[задача...], next_cursor }`.
- С `group_by` → `{ group_by, groups:[ { key, issues:[...] } ] }` — удобно для канбана.

### Comments — `/:issueId/comments`
| GET `/` (ветки по `parent_comment_id`) | POST `/` `{ body(1–50000), parent_comment_id? }` |
| PATCH/DELETE `/:commentId` *(автор/admin)* |
**Объект:** `{ id, issue_id, author_id, body, parent_comment_id, created_at, updated_at, deleted_at, author:{ id, display_name, avatar_url } }`.

### Cycles — `/:projectId/cycles` (спринты)
| GET `/` | POST `/` `{ name(1–255), description?, start_date?, end_date? }` |
| GET `/:cycleId` (+ `progress`) | PATCH/DELETE `/:cycleId` |
| POST `/:cycleId/issues` `{ issue_ids:uuid[]≥1 }` → `{ added }` | DELETE `/:cycleId/issues/:issueId` |
**Объект:** `{ id, workspace_id, project_id, name, description, start_date, end_date, status(upcoming|active|completed), created_at, updated_at }`. `GET /:cycleId` добавляет `progress:{ total, backlog, unstarted, started, completed, cancelled, completion_percentage }`.

### Modules — `/:projectId/modules`
| GET `/` | POST `/` `{ name(1–255), description?, status?, lead_id?, start_date?, target_date? }` |
| GET `/:moduleId` (+ `progress`) | PATCH/DELETE `/:moduleId` |
| POST `/:moduleId/issues` `{ issue_ids:uuid[]≥1 }` → `{ added }` | DELETE `/:moduleId/issues/:issueId` |
**Объект:** `{ ..., status(backlog|in_progress|paused|completed|cancelled), lead_id, start_date, target_date, ... }`, тот же `progress`.

### Issue relations — `/:issueId/relations`
| GET `/` → `{ blocks[], blocked_by[], relates_to[], duplicates[] }` |
| POST `/` `{ related_issue_id, relation_type }` | DELETE `/:linkId` (+ зеркальная) |
`relation_type` ∈ `blocks | blocked_by | relates_to | duplicates`.

### Activity — `GET /:issueId/activity` → история изменений задачи.

### Attachments — `/:issueId/attachments` (presigned upload, байты не идут через API)
1. `POST /` `{ file_name, file_size, mime_type }` → `{ attachment, upload:{ url, method, headers, expires_in } }`.
2. Клиент сам грузит файл `upload.method` (PUT) на `upload.url` с `upload.headers`.
3. `GET /` → массив, у каждого `download_url` для показа.
4. Удаление: `DELETE /:workspaceSlug/projects/:projectId/attachments/:attachmentId` *(загрузивший/admin)*.

### Notifications — `/:workspaceSlug/notifications`
| GET `/?read=true\|false&cursor&limit` → `{ data[], unread_count, next_cursor }` |
| POST `/read-all` → `{ updated }` | POST `/:notificationId/read` → уведомление |
**Объект:** `{ id, workspace_id, recipient_id, actor_id, type(issue_assigned|comment_added|mentioned), issue_id, entity_id, is_read, read_at, created_at, actor:{...} }`. `unread_count` → бейдж.

---

## Заметки по реализации

- **Типы:** генерируй из `/docs/json` (`openapi-typescript`) в `src/api/types.ts` —
  держит фронтенд в синхроне с бэкендом.
- **Данные:** TanStack Query; ключуй по `[workspaceSlug, projectId, ...]`.
- **Доски (kanban):** колонки из `GET /states` (по `order`) +
  `GET /issues?group_by=state`. Drag-drop = `PATCH /issues/:id` со `state_id`/`sort_order`
  (оптимистичное обновление).
- **Даты:** ISO-8601, всё в UTC.
- **Markdown** в описаниях/комментариях; подзадачи — только 1 уровень `parent_id`.

## Команды
```bash
npm run dev        # дев-сервер Vite
npm run build      # сборка
npm run preview    # предпросмотр сборки
npm run lint       # ESLint
```
```
.env: VITE_API_URL=https://task-management-backend-hxtn.onrender.com
```
