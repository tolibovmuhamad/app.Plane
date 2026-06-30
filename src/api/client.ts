import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth.store';
import type { AuthTokens } from '@/api/types';

/**
 * Единый axios-инстанс для всего приложения (CLAUDE.md → «Авторизация (JWT)»).
 * - request-интерсептор подставляет `Authorization: Bearer <access>`;
 * - response-интерсептор на 401 один раз обновляет токены и повторяет запрос;
 * - параллельные 401 ждут один общий in-flight промис обновления.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${env.apiUrl}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: Bearer access-токен ────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ── Response: refresh-and-retry на 401 ──────────────────────────────────────
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Общий промис обновления — защита от гонки при параллельных 401. */
let refreshPromise: Promise<string> | null = null;

/**
 * Обновляет пару токенов. Запрос делаем «голым» axios (без интерсепторов),
 * чтобы не зациклить refresh на самом себе.
 */
async function refreshTokens(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    throw new Error('Нет refresh-токена');
  }

  const { data } = await axios.post<AuthTokens>(
    `${env.apiUrl}/api/v1/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );

  // Токены ротируются — заменяем ОБА.
  useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
  if (data.user) {
    useAuthStore.getState().setUser(data.user);
  }
  return data.access_token;
}

/** Сессия мертва: чистим стор и уводим на /login. */
function handleSessionExpired() {
  useAuthStore.getState().clear();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // Не 401, нет конфига, уже повторяли, или это сам refresh-запрос — пробрасываем.
    const isRefreshCall = original?.url?.includes('/auth/refresh');
    if (status !== 401 || !original || original._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      // Один общий промис на все параллельные 401.
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      original.headers.set('Authorization', `Bearer ${newAccessToken}`);
      return apiClient(original);
    } catch (refreshError) {
      handleSessionExpired();
      return Promise.reject(refreshError);
    }
  },
);
