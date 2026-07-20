import { useMutation, useQuery } from '@tanstack/react-query';

import { analyzeImage, fetchContractById, fetchContractSample, fetchContracts } from './api';

export const contractKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  detail: (id: string) => [...contractKeys.all, 'detail', id] as const,
  sample: () => [...contractKeys.all, 'sample'] as const,
};

export function useContractSampleQuery(enabled: boolean) {
  return useQuery({
    queryKey: contractKeys.sample(),
    queryFn: fetchContractSample,
    enabled,
  });
}

export function useContractsListQuery() {
  return useQuery({
    queryKey: contractKeys.lists(),
    queryFn: fetchContracts,
  });
}

export function useContractDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: contractKeys.detail(id ?? ''),
    queryFn: async () => fetchContractById(id as string),
    enabled: !!id,
  });
}

export function useAnalyzeImageMutation() {
  return useMutation({
    mutationFn: analyzeImage,
  });
}
