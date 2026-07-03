import { apiClient } from '../client';
import type { IssueComment } from '../types';

export const commentsApi = {
  list: async (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
  ): Promise<IssueComment[]> => {
    const { data } = await apiClient.get<IssueComment[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments`,
    );
    return data;
  },

  create: async (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    body: string,
  ): Promise<IssueComment> => {
    const { data } = await apiClient.post<IssueComment>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments`,
      { body },
    );
    return data;
  },
};
