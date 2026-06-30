import { useCallback } from 'react';
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
} from '@/api/endpoints/auth';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Действия над сессией поверх auth-стора и API.
 * Серверные данные пользователя (если понадобится подгрузка `/me`) —
 * через TanStack Query в соответствующих фичах, не дублировать в Zustand.
 */
export function useSession() {
  const setSession = useAuthStore((s) => s.setSession);
  const clear = useAuthStore((s) => s.clear);

  /** Регистрация: создаёт пользователя и поднимает сессию. */
  const register = useCallback(
    async (payload: RegisterPayload) => {
      const tokens = await authApi.register(payload);
      setSession(tokens);
      return tokens;
    },
    [setSession],
  );

  /** Вход: поднимает сессию по email/паролю. */
  const login = useCallback(
    async (payload: LoginPayload) => {
      const tokens = await authApi.login(payload);
      setSession(tokens);
      return tokens;
    },
    [setSession],
  );

  /** Выход: отзыв refresh-токена + локальная очистка. */
  const logout = useCallback(async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Даже если бэкенд недоступен — гасим локальную сессию.
    } finally {
      clear();
    }
  }, [clear]);

  return { register, login, logout };
}
