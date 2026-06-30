import { apiClient } from '@/api/client';
import type { AuthTokens, User } from '@/api/types';

export interface RegisterPayload {
  email: string;
  password: string;
  display_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateMePayload {
  display_name?: string;
  avatar_url?: string | null;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthTokens>('/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthTokens>('/auth/login', payload).then((r) => r.data),

  /** Отзыв refresh-токена на бэкенде. */
  logout: (refreshToken: string) =>
    apiClient.post<void>('/auth/logout', { refresh_token: refreshToken }),

  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),

  updateMe: (payload: UpdateMePayload) =>
    apiClient.patch<User>('/auth/me', payload).then((r) => r.data),
};
