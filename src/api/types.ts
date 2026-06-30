/**
 * Типы API. По-хорошему генерировать из OpenAPI (`/docs/json`,
 * `openapi-typescript`) → этот файл. Пока — минимум, нужный для A0 (auth).
 */

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Ответ /register, /login, /refresh. */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

/** Формат ошибки бэкенда: { error: { code, message, details } }. */
export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export interface ApiError {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}
