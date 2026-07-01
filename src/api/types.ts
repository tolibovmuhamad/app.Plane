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

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  identifier: string;
  description: string | null;
  lead_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  workspace_id: string;
  recipient_id: string;
  actor_id: string;
  type: 'issue_assigned' | 'comment_added' | 'mentioned';
  issue_id: string;
  entity_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  actor?: {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export interface NotificationResponse {
  data: Notification[];
  unread_count: number;
  next_cursor: string | null;
}

