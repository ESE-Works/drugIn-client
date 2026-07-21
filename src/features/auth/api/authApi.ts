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
