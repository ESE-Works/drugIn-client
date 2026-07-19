import { api } from '@/lib/axios';
import type { Contract } from '@/types/api';

export async function fetchContractSample(): Promise<Contract> {
  const { data } = await api.get<Contract>('/contracts/sample');
  return data;
}

export async function analyzeText(text: string): Promise<Contract> {
  const { data } = await api.post<Contract>('/contracts/text', { text });
  return data;
}

export async function analyzeSpecialTerms(text: string): Promise<Contract> {
  const { data } = await api.post<Contract>('/contracts/special-terms', { text });
  return data;
}

export async function fetchContracts(): Promise<Contract[]> {
  const { data } = await api.get<Contract[]>('/contracts');
  return data;
}

export async function fetchContractById(id: string): Promise<Contract> {
  const { data } = await api.get<Contract>(`/contracts/${id}`);
  return data;
}
