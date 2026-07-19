import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/store/authStore';
import type { AuthTokens } from '@/types/api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://136.66.69.44:4000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<AuthTokens> | null = null;

async function performRefresh(refreshToken: string): Promise<AuthTokens> {
  const { data } = await axios.post<AuthTokens>(`${BASE_URL}/auth/refresh`, { refreshToken });
  return data;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) {
      await useAuthStore.getState().clearTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= performRefresh(refreshToken);
      const tokens = await refreshPromise;
      refreshPromise = null;
      await useAuthStore.getState().setTokens(tokens);
      originalRequest.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      return await api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      await useAuthStore.getState().clearTokens();
      return Promise.reject(refreshError);
    }
  },
);
