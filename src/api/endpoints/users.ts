import { apiClient } from '../client';

export interface UserSearchResult {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
}

/** Краткая карточка пользователя в списках подписчиков/подписок. */
export type UserBrief = UserSearchResult;

export const usersApi = {
  /** Поиск пользователей по email/имени для автоподсказок. GET /users/search?q=&limit=20. */
  search: async (q: string): Promise<UserSearchResult[]> => {
    const { data } = await apiClient.get<UserSearchResult[]>('/users/search', {
      params: { q, limit: 20 },
    });
    return data;
  },

  /** Загрузить свой аватар. multipart/form-data, поле `file`. → { avatar_url }. */
  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const form = new FormData();
    form.append('file', file);
    // Content-Type с boundary axios/браузер выставят сами — вручную не задаём.
    const { data } = await apiClient.post<{ avatar_url: string }>('/users/me/avatar', form);
    return data;
  },

  /** Удалить свой аватар. → обновлённый пользователь (avatar_url: null). */
  deleteAvatar: async (): Promise<{ id: string; avatar_url: string | null }> => {
    const { data } = await apiClient.delete<{ id: string; avatar_url: string | null }>('/users/me/avatar');
    return data;
  },

  /** Подписаться. POST /users/:id/follow → { follower_id, following_id, created_at }. */
  follow: async (userId: string): Promise<void> => {
    await apiClient.post(`/users/${userId}/follow`);
  },

  /** Отписаться. DELETE /users/:id/follow → 204. */
  unfollow: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}/follow`);
  },

  /** Подписчики пользователя. */
  followers: async (userId: string): Promise<UserBrief[]> => {
    const { data } = await apiClient.get<UserBrief[]>(`/users/${userId}/followers`);
    return data;
  },

  /** На кого подписан пользователь. */
  following: async (userId: string): Promise<UserBrief[]> => {
    const { data } = await apiClient.get<UserBrief[]>(`/users/${userId}/following`);
    return data;
  },
};
