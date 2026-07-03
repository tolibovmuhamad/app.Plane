import { apiClient } from '../client';

export interface UserSearchResult {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
}

export const usersApi = {
  /** Поиск пользователей по email/имени для автоподсказок. GET /users/search?q=&limit=10. */
  search: async (q: string): Promise<UserSearchResult[]> => {
    const { data } = await apiClient.get<UserSearchResult[]>('/users/search', {
      params: { q, limit: 10 },
    });
    return data;
  },
};
