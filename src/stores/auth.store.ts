import { create } from 'zustand';
import type { AuthTokens, User } from '@/api/types';

const REFRESH_TOKEN_KEY = 'tm.refresh_token';

/**
 * Хранилище refresh-токена.
 *
 * Раньше токен лежал только в `localStorage`, а он ОБЩИЙ для всех вкладок браузера.
 * Из-за этого залогинившись в другой вкладке под другим аккаунтом, ты перезаписывал
 * токен первой вкладки — и после Ctrl+R первая вкладка «перескакивала» на чужой аккаунт.
 *
 * Теперь: основной источник — `sessionStorage` (СВОЙ для каждой вкладки, переживает
 * перезагрузку). `localStorage` — запасной: чтобы новая вкладка / перезапуск браузера
 * помнили последнюю сессию. При загрузке берём токен вкладки, иначе — последний из
 * localStorage (и «усыновляем» его в текущую вкладку).
 */
function readRefreshToken(): string | null {
  const fromTab = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (fromTab) return fromTab;
  const fromBrowser = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (fromBrowser) sessionStorage.setItem(REFRESH_TOKEN_KEY, fromBrowser);
  return fromBrowser;
}

function writeRefreshToken(token: string): void {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

function eraseRefreshToken(): void {
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

const bootRefreshToken = readRefreshToken();

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
  refreshToken: bootRefreshToken,
  user: null,
  isAuthenticated: Boolean(bootRefreshToken),

  setSession: ({ access_token, refresh_token, user }) => {
    writeRefreshToken(refresh_token);
    set({
      accessToken: access_token,
      refreshToken: refresh_token,
      user,
      isAuthenticated: true,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    writeRefreshToken(refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  clear: () => {
    eraseRefreshToken();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
