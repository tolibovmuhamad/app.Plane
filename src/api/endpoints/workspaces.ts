import { apiClient } from '../client';
import type { Workspace } from '../types';

export const workspacesApi = {
  list: async (): Promise<Workspace[]> => {
    const { data } = await apiClient.get<Workspace[]>('/workspaces');
    return data;
  },

  get: async (slug: string): Promise<Workspace> => {
    const { data } = await apiClient.get<Workspace>(`/workspaces/${slug}`);
    return data;
  },

  create: async (body: { name: string; slug: string }): Promise<Workspace> => {
    const { data } = await apiClient.post<Workspace>('/workspaces', body);
    return data;
  },

  /** DELETE /workspaces/:slug → 204. Только владелец воркспейса. */
  remove: async (slug: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${slug}`);
  },
};
