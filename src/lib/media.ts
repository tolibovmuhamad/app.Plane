import { env } from '@/config/env';

/**
 * Приводит URL медиа-файла к рабочему виду.
 * Бэкенд иногда отдаёт ссылки вида `http://localhost:3000/internal/storage/...`
 * (внутренний адрес сервера) — в браузере они не грузятся. Подменяем хост
 * localhost на публичный домен бэкенда (`VITE_API_URL`).
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace(/^https?:\/\/localhost(:\d+)?/i, env.apiUrl);
}
