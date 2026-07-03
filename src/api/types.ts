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
  type: 'issue_assigned' | 'comment_added' | 'mentioned' | 'project_member_added' | 'project_invite_received';
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

// ── Issues / states / labels / members ──────────────────────────────────────

export type StateGroup = 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled';

export interface State {
  id: string;
  project_id: string;
  name: string;
  color: string;
  group: StateGroup;
  order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: string;
  workspace_id: string;
  project_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
  };
}

/** Участник проекта (`/projects/:id/members`). Роли уже проектные (viewer вместо guest). */
export interface ProjectMember {
  project_id: string;
  user_id: string;
  role: string;
  status?: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at?: string;
  user: {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export type IssuePriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

/**
 * Ссылка на исполнителя/метку внутри issue. Бэкенд может отдавать её как id
 * (строку) либо как вложенный объект — обрабатываем оба варианта.
 */
export type IssueRef =
  | string
  | {
      id?: string;
      user_id?: string;
      label_id?: string;
      name?: string;
      color?: string;
      display_name?: string;
      avatar_url?: string | null;
      user?: { id?: string; display_name?: string; avatar_url?: string | null };
    };

export interface ApiIssue {
  id: string;
  workspace_id: string;
  project_id: string;
  sequence_id: number;
  title: string;
  description: string | null;
  state_id: string;
  priority: IssuePriority;
  parent_id: string | null;
  estimate_points: number | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_by_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  assignees?: IssueRef[];
  labels?: IssueRef[];
}

export interface IssueGroup {
  key: string;
  issues: ApiIssue[];
}

export interface GroupedIssues {
  group_by: string;
  groups: IssueGroup[];
}

export interface IssueComment {
  id: string;
  issue_id: string;
  author_id: string;
  body: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  author?: { id: string; display_name: string; avatar_url: string | null };
}

