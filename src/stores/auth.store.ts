import { create } from 'zustand';
import type { AuthTokens, User } from '@/api/types';

const REFRESH_TOKEN_KEY = 'tm.refresh_token';

interface AuthState {
  /** Access-токен живёт только в памяти. */
  accessToken: string | null;
  /** Refresh-токен — в localStorage, чтобы переживать перезагрузку. */
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  /** Полная сессия после login/register. */
  setSession: (tokens: AuthTokens) => void;
  /** Ротация пары токенов (после /auth/refresh). */
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  /** Локальная очистка сессии (без сетевого вызова). */
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  user: null,
  isAuthenticated: Boolean(localStorage.getItem(REFRESH_TOKEN_KEY)),

  setSession: ({ access_token, refresh_token, user }) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    set({
      accessToken: access_token,
      refreshToken: refresh_token,
      user,
      isAuthenticated: true,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  clear: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
