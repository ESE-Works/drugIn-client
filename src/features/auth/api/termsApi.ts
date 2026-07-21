import api from '@/lib/axios';

export interface TermItem {
  id: string;
  title: string;
  content: string;
  version: string;
  type: string;
  is_required: boolean; // 서버 응답 필드명인 is_required로 수정
  effective_date: string; // 👈 이 부분을 추가해 줍니다!
  created_at: string; // 필요시 함께 추가
}

export interface ConsentPayload {
  termType: string;
  version: string;
  agreed: boolean;
}

// 내 동의 이력 아이템 타입 정의
export interface UserConsentItem {
  id: string;
  user_id: string;
  term_id: string;
  term_type: string;
  term_version: string;
  agreed: boolean;
  agreed_at: string;
  ip_address: string;
}

// GET /terms 최신 약관 목록 조회 (로그인)
export const getTerms = async (): Promise<TermItem[]> => {
  const response = await api.get('/terms');
  return response.data;
};

// POST API 함수 추가
export const postTermsConsents = async (consents: ConsentPayload[]) => {
  const response = await api.post('/terms/consents', { consents });
  return response.data;
};

// GET /terms/consents/me 내 동의 이력 조회
export const getMyConsents = async (): Promise<UserConsentItem[]> => {
  const response = await api.get('/terms/consents/me');
  return response.data;
};
