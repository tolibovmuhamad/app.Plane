import { apiClient } from '../client';
import type { ApiIssue, GroupedIssues } from '../types';

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  state_id?: string;
  priority?: string;
  sort_order?: number;
}

/** Тело создания задачи. Обязательны `title` и `state_id`. */
export interface CreateIssuePayload {
  title: string;
  state_id: string;
  description?: string;
  priority?: string;
  due_date?: string;
}

export const issuesApi = {
  /** Создать задачу в проекте. */
  create: async (
    workspaceSlug: string,
    projectId: string,
    body: CreateIssuePayload,
  ): Promise<ApiIssue> => {
    const { data } = await apiClient.post<ApiIssue>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/issues`,
      body,
    );
    return data;
  },

  /** Список задач проекта, сгруппированный по статусу (для List/Board). */
  listGroupedByState: async (
    workspaceSlug: string,
    projectId: string,
  ): Promise<GroupedIssues> => {
    const { data } = await apiClient.get<GroupedIssues>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/issues`,
      { params: { group_by: 'state', limit: 100 } },
    );
    return data;
  },

  update: async (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    body: UpdateIssuePayload,
  ): Promise<ApiIssue> => {
    const { data } = await apiClient.patch<ApiIssue>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}`,
      body,
    );
    return data;
  },

  /** Удалить задачу (мягкое удаление) → 204. */
  remove: async (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}`,
    );
  },
};
