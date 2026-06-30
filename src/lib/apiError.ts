import { AxiosError } from 'axios';
import type { ApiError, ApiErrorCode } from '@/api/types';

export interface ParsedApiError {
  code: ApiErrorCode | 'NETWORK_ERROR' | 'UNKNOWN';
  message: string;
  /** Ошибки по полям из VALIDATION_ERROR.details → маппятся на форму. */
  fieldErrors: Record<string, string>;
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

      return { code, message, fieldErrors };
    }

    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Нет связи с сервером. Проверьте подключение.',
        fieldErrors: {},
      };
    }
  }

  return {
    code: 'UNKNOWN',
    message: 'Что-то пошло не так. Попробуйте ещё раз.',
    fieldErrors: {},
  };
}
