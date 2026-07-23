import apiClient from '@/lib/axios';

export interface GetBenefitsParams {
  region?: string;
  age?: number;
  incomeRange?: string;
}

// 혜택 목록 조회 API 함수
export const getBenefits = async (params?: GetBenefitsParams) => {
  const response = await apiClient.get('/benefits', { params });
  return response.data;
};

//상세 페이지
export const getBenefitDetail = async (id: string) => {
  const response = await apiClient.get(`/benefits/${id}`);
  return response.data;
};

// 내 프로필 기반 추천 혜택 조회 API 함수
export const getRecommendedBenefits = async () => {
  const response = await apiClient.get('/benefits/recommended');
  return response.data;
};
