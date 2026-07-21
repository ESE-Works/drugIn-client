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
