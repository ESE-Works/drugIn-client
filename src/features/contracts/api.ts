import apiClient from '@/lib/axios';
import type { AnalysisResult, Contract } from '@/types/api';

export interface PickedImage {
  uri: string;
  mimeType: string;
  fileName: string;
}

export async function fetchContractSample(): Promise<Contract> {
  // /contracts/sample은 Contract 래퍼 없이 analysis_result 내용만 그대로 응답한다.
  const { data } = await apiClient.get<AnalysisResult>('/contracts/sample');
  return {
    id: 'sample',
    status: 'COMPLETED',
    original_text: '',
    input_source: 'text_paste',
    analysis_result: data,
  };
}

export async function analyzeImage(image: PickedImage): Promise<Contract> {
  const formData = new FormData();
  // React Native의 FormData는 파일 객체 형태로 { uri, name, type }을 요구한다.
  formData.append('file', {
    uri: image.uri,
    name: image.fileName,
    type: image.mimeType,
  } as unknown as Blob);

  const { data } = await apiClient.post<Contract>('/contracts/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function fetchContracts(): Promise<Contract[]> {
  const { data } = await apiClient.get<Contract[]>('/contracts');
  return data;
}

export async function fetchContractById(id: string): Promise<Contract> {
  const { data } = await apiClient.get<Contract>(`/contracts/${id}`);
  return data;
}
