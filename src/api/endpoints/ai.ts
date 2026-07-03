import { apiClient } from '../client';

export type AiTone = 'professional' | 'friendly' | 'detailed' | 'short';

export const aiApi = {
  /** Сгенерировать Markdown-описание задачи из промпта. POST /ai/generate-description. */
  generateDescription: async (body: { prompt: string; tone?: AiTone }): Promise<{ text: string }> => {
    const { data } = await apiClient.post<{ text: string }>('/ai/generate-description', body);
    return data;
  },

  /** Краткое AI-саммари обсуждения задачи. POST /ai/.../issues/:id/summarize (без тела). */
  summarizeIssue: async (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
  ): Promise<{ summary: string }> => {
    const { data } = await apiClient.post<{ summary: string }>(
      `/ai/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/summarize`,
    );
    return data;
  },
};
