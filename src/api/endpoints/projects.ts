import { apiClient } from '../client';
import type { Project } from '../types';

export const projectsApi = {
  list: async (workspaceSlug: string): Promise<Project[]> => {
    const { data } = await apiClient.get<Project[]>(`/workspaces/${workspaceSlug}/projects`);
    return data;
  },

  get: async (workspaceSlug: string, projectId: string): Promise<Project> => {
    const { data } = await apiClient.get<Project>(`/workspaces/${workspaceSlug}/projects/${projectId}`);
    return data;
  },

  create: async (
    workspaceSlug: string,
    body: { name: string; identifier: string; description?: string }
  ): Promise<Project> => {
    const { data } = await apiClient.post<Project>(`/workspaces/${workspaceSlug}/projects`, body);
    return data;
  },

  remove: async (workspaceSlug: string, projectId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceSlug}/projects/${projectId}`);
  },
};
