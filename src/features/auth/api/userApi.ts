import apiClient from '@/lib/axios';

export interface UserProfile {
  id: string;
  nickname: string;
  profile_image_url: string;
  provider: string;
  provider_id: string;
  created_at: string;
  region: string | null;
  age?: number | null;
  income_range: string | null;
}
export interface UpdateProfilePayload {
  region: string;
  age: number;
  income_range: string;
}

export const getUserProfile = async (accessToken: string) => {
  const { data } = await apiClient.get<UserProfile>('/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log('👀 [2] 백엔드 /users/me 원본 응답:', data);
  return data;
};

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await apiClient.post<UserProfile>('/users/me/profile', payload);
  console.log('👀 온보딩 정보 업데이트 성공:', data);
  return data;
};
