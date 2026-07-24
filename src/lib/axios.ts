import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { refreshAccessToken } from '@/features/auth/api/authApi';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// expo-secure-store는 웹을 지원하지 않으므로 웹에서는 localStorage로 대체한다.
const getStoredToken = (key: string): Promise<string | null> =>
  Platform.OS === 'web' ? Promise.resolve(localStorage.getItem(key)) : SecureStore.getItemAsync(key);

const setStoredToken = (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }
  return SecureStore.setItemAsync(key, value);
};

const removeStoredToken = (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
  return SecureStore.deleteItemAsync(key);
};

// 요청 인터셉터
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!config.headers.Authorization) {
    const token = await getStoredToken('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  console.log('🚀 [API 요청]:', config.url);
  console.log('🔗 실제 날아가는 전체 주소:', config.baseURL, config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [API 응답 성공] ${response.config.url}:`, response.data);

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 1. 401 에러이고, 아직 재시도를 안 했다면?
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;
      console.log('🚨 [인터셉터] 401 에러 감지! 토큰 재발급(Refresh)을 시도합니다.');

      try {
        // 2. 저장된 리프레시 토큰 가져오기
        const refreshToken = await getStoredToken('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // 3. 토큰 갱신 API 호출
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshAccessToken(refreshToken);
        console.log('✅ [인터셉터] 토큰 갱신 성공! 실패했던 API를 재요청합니다.');

        // 4. 새 토큰 저장
        await setStoredToken('access_token', accessToken);
        await setStoredToken('refresh_token', newRefreshToken);

        // 5. 헤더에 새 토큰 넣고 실패했던 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 6. 리프레시 토큰도 만료되었다면 로그아웃 처리
        console.error('로그인 세션 만료, 다시 로그인 필요');
        await removeStoredToken('access_token');
        await removeStoredToken('refresh_token');
        // 여기서 로그인 화면으로 강제 이동 로직 추가 가능
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
