import { apiClient } from '../client';
import type { WorkspaceMember } from '../types';

export type WorkspaceRole = 'admin' | 'member' | 'guest';

/**
 * Тело добавления участника. Бэкенд по контракту принимает `user_id` (UUID).
 * Дополнительно шлём `email` — если бэкенд умеет резолвить email → пользователя
 * (инвайт по email), это сработает; иначе вернёт ошибку, которую покажем в UI.
 */
export interface AddMemberPayload {
  email?: string;
  user_id?: string;
  role?: WorkspaceRole;
}

/** Ответ на инвайт по email — приглашение с токеном (участником станет после accept). */
export interface WorkspaceInvite {
  id: string;
  workspace_id: string;
  invited_by_id: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export const membersApi = {
  list: async (workspaceSlug: string): Promise<WorkspaceMember[]> => {
    const { data } = await apiClient.get<WorkspaceMember[]>(
      `/workspaces/${workspaceSlug}/members`,
    );
    return data;
  },

  /** Пригласить по email: POST /members/invite → создаётся приглашение (нужен accept по токену). */
  invite: async (
    workspaceSlug: string,
    body: { email: string; role?: WorkspaceRole },
  ): Promise<WorkspaceInvite> => {
    const { data } = await apiClient.post<WorkspaceInvite>(
      `/workspaces/${workspaceSlug}/members/invite`,
      body,
    );
    return data;
  },

  add: async (workspaceSlug: string, body: AddMemberPayload): Promise<WorkspaceMember> => {
    const { data } = await apiClient.post<WorkspaceMember>(
      `/workspaces/${workspaceSlug}/members`,
      body,
    );
    return data;
  },

  updateRole: async (
    workspaceSlug: string,
    userId: string,
    role: WorkspaceRole,
  ): Promise<WorkspaceMember> => {
    const { data } = await apiClient.patch<WorkspaceMember>(
      `/workspaces/${workspaceSlug}/members/${userId}`,
      { role },
    );
    return data;
  },

  remove: async (workspaceSlug: string, userId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceSlug}/members/${userId}`);
  },
};
