import { apiClient } from '../client';
import type { State } from '../types';

export const statesApi = {
  list: async (workspaceSlug: string, projectId: string): Promise<State[]> => {
    const { data } = await apiClient.get<State[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/states`,
    );
    return data;
  },
};
