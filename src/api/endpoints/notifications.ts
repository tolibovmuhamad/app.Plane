import { apiClient } from '../client';
import type { NotificationResponse } from '../types';

export const notificationsApi = {
  getUnread: async (workspaceSlug: string): Promise<NotificationResponse> => {
    const { data } = await apiClient.get<NotificationResponse>(
      `/workspaces/${workspaceSlug}/notifications`,
      { params: { read: false, limit: 1 } }
    );
    return data;
  },

  list: async (
    workspaceSlug: string,
    params: { read?: boolean; limit?: number; cursor?: string } = {}
  ): Promise<NotificationResponse> => {
    const { data } = await apiClient.get<NotificationResponse>(
      `/workspaces/${workspaceSlug}/notifications`,
      { params }
    );
    return data;
  },

  markAllRead: async (workspaceSlug: string): Promise<{ updated: number }> => {
    const { data } = await apiClient.post<{ updated: number }>(
      `/workspaces/${workspaceSlug}/notifications/read-all`
    );
    return data;
  },

  markRead: async (workspaceSlug: string, notificationId: string): Promise<void> => {
    await apiClient.post(`/workspaces/${workspaceSlug}/notifications/${notificationId}/read`);
  },
};
