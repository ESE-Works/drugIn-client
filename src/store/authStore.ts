import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  setAuth: async (user, access_token, refresh_token) => {
    await SecureStore.setItemAsync('access_token', access_token);
    await SecureStore.setItemAsync('refresh_token', refresh_token);
    set({ user, isLoggedIn: true });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({ user: null, isLoggedIn: false });
  },

  updateProfile: (profileData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...profileData } : null,
    })),
}));
