import type { MarketPropertyType, TransactionType } from '@/types/api';

export const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  jeonse: '전세',
  monthly: '월세',
  sale: '매매',
};

export const PROPERTY_TYPE_LABEL: Record<MarketPropertyType, string> = {
  apartment: '아파트',
  officetel: '오피스텔',
  villa: '빌라',
};
