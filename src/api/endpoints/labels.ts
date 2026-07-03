import { apiClient } from '../client';
import type { Label } from '../types';

export const labelsApi = {
  list: async (workspaceSlug: string, projectId: string): Promise<Label[]> => {
    const { data } = await apiClient.get<Label[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/labels`,
    );
    return data;
  },
};
