import apiClient from '@/lib/axios';

interface SocialLoginResponse {
  accessToken: string;
  refresh_token?: string;
  is_new_user?: boolean;
  user?: {
    id: string;
    nickname: string;
    profile_image_url: string;
  };
}

export const socialLogin = async (provider: 'kakao' | 'google', accessToken: string) => {
  const { data } = await apiClient.post<SocialLoginResponse>(`/auth/${provider}`, { accessToken });

  console.log('로그인 API 응답 데이터:', data);
  return data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await apiClient.post<{ accessToken: string; refreshToken: string }>(
    '/auth/refresh',
    { refreshToken },
  );
  return data;
};

interface TestLoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 심사위원 등이 소셜 로그인 없이 앱을 테스트할 수 있도록 하는 어드민 전용 로그인.
export const testLogin = async (key: string) => {
  const { data } = await apiClient.post<TestLoginResponse>('/auth/admin-login', { key });
  return data;
};
