import apiClient from '@/lib/axios';
import type { MarketCheckRequest, MarketCheckResult } from '@/types/api';

export async function postMarketCheck(payload: MarketCheckRequest): Promise<MarketCheckResult> {
  const { data } = await apiClient.post<MarketCheckResult>('/market-check', payload);
  return data;
}
