/**
 * Типизированный доступ к переменным окружения Vite.
 * Все секреты/URL — только отсюда, не зашивать в код.
 */

function required(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Отсутствует переменная окружения: ${name}`);
  }
  return value;
}

export const env = {
  /** Базовый URL REST API бэкенда (без завершающего слэша). */
  apiUrl: required('VITE_API_URL').replace(/\/$/, ''),
} as const;

/**
 * База для всех запросов к API.
 * - В dev — относительный `/api/v1`: идём через Vite-прокси (см. vite.config.ts),
 *   браузер считает запрос same-origin и не упирается в CORS бэкенда.
 * - В prod — полный URL бэкенда (там CORS должен быть настроен на стороне сервера).
 */
export const apiBaseUrl = import.meta.env.DEV
  ? '/api/v1'
  : `${env.apiUrl}/api/v1`;
