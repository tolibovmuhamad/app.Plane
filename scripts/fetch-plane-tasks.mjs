// Тянет задачи (work items) напрямую из Plane Cloud API и печатает их коды/названия.
// Заменяет ручное сохранение "Work items.html".
//
// Запуск:
//   node scripts/fetch-plane-tasks.mjs            # печатает список "КОД — Название"
//   node scripts/fetch-plane-tasks.mjs --json     # печатает сырой JSON всех задач
//
// Нужны переменные окружения (кладём в .env, он в .gitignore):
//   PLANE_API_KEY          — личный API-токен из Plane (Settings → API tokens)
//   PLANE_WORKSPACE_SLUG   — напр. taskmanagment2211
//   PLANE_PROJECT_ID       — UUID проекта из URL

// Подхватываем .env, если он есть (Node 20.6+).
try {
  process.loadEnvFile(new URL('../.env', import.meta.url));
} catch {
  // .env может отсутствовать — тогда читаем из системного окружения
}

const BASE_URL = process.env.PLANE_API_URL ?? 'https://api.plane.so';
const API_KEY = process.env.PLANE_API_KEY;
const WORKSPACE = process.env.PLANE_WORKSPACE_SLUG;
const PROJECT = process.env.PLANE_PROJECT_ID;

function die(msg) {
  console.error(`ОШИБКА: ${msg}`);
  process.exit(1);
}

if (!API_KEY) die('нет PLANE_API_KEY в .env');
if (!WORKSPACE) die('нет PLANE_WORKSPACE_SLUG в .env');
if (!PROJECT) die('нет PLANE_PROJECT_ID в .env');

// Только настоящие задачи-роадмапа: "A1.2 — Текст" или "B4.1 — Текст".
const TASK_RE = /^[AB]\d+\.\d+\s+—\s+.+/;

async function fetchAllWorkItems() {
  const items = [];
  let cursor = null;
  let guard = 0;

  do {
    const url = new URL(
      `/api/v1/workspaces/${WORKSPACE}/projects/${PROJECT}/work-items/`,
      BASE_URL,
    );
    url.searchParams.set('per_page', '100');
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url, {
      headers: { 'X-API-Key': API_KEY, Accept: 'application/json' },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      die(`Plane API вернул ${res.status} ${res.statusText}\n${body.slice(0, 500)}`);
    }

    const page = await res.json();
    const results = Array.isArray(page) ? page : (page.results ?? []);
    items.push(...results);

    cursor = Array.isArray(page) ? null : (page.next_cursor ?? null);
    const hasNext = Array.isArray(page) ? false : (page.next_page_results ?? false);
    if (!hasNext) cursor = null;
  } while (cursor && ++guard < 100);

  return items;
}

const raw = process.argv.includes('--json');
const items = await fetchAllWorkItems();

if (raw) {
  console.log(JSON.stringify(items, null, 2));
  process.exit(0);
}

// Отбираем только задачи-роадмапа и печатаем "КОД — Название" по одной в строке.
const tasks = items
  .map((it) => (it?.name ?? '').trim())
  .filter((name) => TASK_RE.test(name))
  .sort();

if (tasks.length === 0) {
  console.error(
    `Из ${items.length} work items ни одна не подходит под шаблон "A1.2 — Текст".\n` +
      'Проверь, что задачи в Plane названы в этом формате.',
  );
  process.exit(2);
}

for (const t of tasks) console.log(t);
console.error(`\n(всего work items: ${items.length}, задач-роадмапа: ${tasks.length})`);
