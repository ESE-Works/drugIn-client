import { useMutation, useQuery } from '@tanstack/react-query';

import { postMarketCheck } from './api';
import type { MarketCheckResult } from '@/types/api';

export const marketCheckKeys = {
  lastResult: ['marketCheck', 'lastResult'] as const,
};

export function useMarketCheckMutation() {
  return useMutation({
    mutationFn: postMarketCheck,
  });
}

// step2에서 queryClient.setQueryData로 저장해둔 결과를 report 화면에서 읽어올 때 쓴다.
export function useLastMarketCheckResult() {
  return useQuery<MarketCheckResult>({
    queryKey: marketCheckKeys.lastResult,
    queryFn: () =>
      Promise.reject<MarketCheckResult>(
        new Error('marketCheck lastResult must be set via queryClient.setQueryData'),
      ),
    enabled: false,
  });
}
