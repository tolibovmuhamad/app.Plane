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
