import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getUserProfile } from '@/features/auth/api/userApi';
import { logger } from '@/lib/logger';

export interface User {
  id: string;
  nickname: string;
  profile_image_url: string;
  provider: string;
  provider_id: string;
  created_at: string;
  region: string | null;
  income_range: string | null;
  age?: number | null;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (user: User, access_token: string, refresh_token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => void;
  initAuth: () => Promise<void>;
}

const tokenStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  //앱 실행 시 토큰을 확ㅇ니하고 자동 로그인 처리하는 함수
  initAuth: async () => {
    try {
      const accessToken = await tokenStorage.getItem('access_token');
      if (accessToken) {
        // 토큰이 있으면 유저 정보를 백엔드에서 다시 가져와서 스토어에 세팅
        const userProfile = await getUserProfile(accessToken);
        set({ user: userProfile, isLoggedIn: true });
      }
    } catch (error) {
      logger.error('초기 유저 정보 불러오기 실패 (토큰 만료 등):', error);
      // 에러가 나면 찌꺼기 토큰을 지우고 로그아웃 상태로 만듦
      await tokenStorage.removeItem('access_token');
      await tokenStorage.removeItem('refresh_token');
      set({ user: null, isLoggedIn: false });
    }
  },

  setAuth: async (user, access_token, refresh_token) => {
    await tokenStorage.setItem('access_token', access_token);
    await tokenStorage.setItem('refresh_token', refresh_token);
    set({ user, isLoggedIn: true });
  },

  clearAuth: async () => {
    await tokenStorage.removeItem('access_token');
    await tokenStorage.removeItem('refresh_token');
    set({ user: null, isLoggedIn: false });
  },

  updateProfile: (profileData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...profileData } : null,
    })),
}));
