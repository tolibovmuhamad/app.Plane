import { apiClient } from '../client';
import type { ProjectMember } from '../types';

export type ProjectRole = 'admin' | 'member' | 'viewer';

/** Участники конкретного проекта: `/workspaces/:slug/projects/:projectId/members`. */
export const projectMembersApi = {
  list: async (workspaceSlug: string, projectId: string): Promise<ProjectMember[]> => {
    const { data } = await apiClient.get<ProjectMember[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/members`,
    );
    return data;
  },

  add: async (
    workspaceSlug: string,
    projectId: string,
    body: { user_id: string; role?: ProjectRole },
  ): Promise<ProjectMember> => {
    const { data } = await apiClient.post<ProjectMember>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/members`,
      body,
    );
    return data;
  },

  remove: async (workspaceSlug: string, projectId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceSlug}/projects/${projectId}/members/${userId}`);
  },

  acceptInvite: async (workspaceSlug: string, projectId: string): Promise<ProjectMember> => {
    const { data } = await apiClient.post<ProjectMember>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/members/accept`,
    );
    return data;
  },

  declineInvite: async (workspaceSlug: string, projectId: string): Promise<{ success: boolean }> => {
    const { data } = await apiClient.post<{ success: boolean }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/members/decline`,
    );
    return data;
  },
};
