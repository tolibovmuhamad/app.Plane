import { AxiosError } from 'axios';
import type { ApiError, ApiErrorCode } from '@/api/types';

export interface ParsedApiError {
  code: ApiErrorCode | 'NETWORK_ERROR' | 'UNKNOWN';
  message: string;
  /** HTTP-статус ответа (если был). */
  status?: number;
  /** Ошибки по полям из VALIDATION_ERROR.details → маппятся на форму. */
  fieldErrors: Record<string, string>;
}

/** Ответ вида `{ message: "..." }` или `{ error: "строка" }` (не наш конверт). */
function looseMessage(data: unknown): string | null {
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>;
    if (typeof d.message === 'string') return d.message;
    if (typeof d.error === 'string') return d.error;
  }
  return null;
}

function isApiError(data: unknown): data is ApiError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as ApiError).error?.code === 'string'
  );
}

/**
 * Нормализует ответ бэкенда `{ error: { code, message, details } }` в удобный
 * для UI вид. `details` поддерживаем в двух частых формах:
 *  - `{ field: "сообщение" }`
 *  - `{ field: ["сообщение", ...] }`
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (isApiError(data)) {
      const { code, message, details } = data.error;
      const fieldErrors: Record<string, string> = {};

      if (details && typeof details === 'object') {
        for (const [field, value] of Object.entries(details)) {
          if (typeof value === 'string') {
            fieldErrors[field] = value;
          } else if (Array.isArray(value) && typeof value[0] === 'string') {
            fieldErrors[field] = value[0];
          }
        }
      }

      return { code, message, status, fieldErrors };
    }

    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Нет связи с сервером. Проверьте подключение.',
        fieldErrors: {},
      };
    }

    // Ответ не в нашем конверте — пробуем достать текст, иначе показываем статус.
    const loose = looseMessage(data);
    return {
      code: 'UNKNOWN',
      message: loose ?? `Ошибка сервера${status ? ` (HTTP ${status})` : ''}. Попробуйте ещё раз.`,
      status,
      fieldErrors: {},
    };
  }

  return {
    code: 'UNKNOWN',
    message: 'Что-то пошло не так. Попробуйте ещё раз.',
    fieldErrors: {},
  };
}
