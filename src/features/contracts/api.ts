import { Platform } from 'react-native';

import apiClient from '@/lib/axios';
import type { AnalysisResult, Contract } from '@/types/api';

export type ImageSource = 'image_camera' | 'image_gallery';

export interface PickedImage {
  uri: string;
  mimeType: string;
  fileName: string;
  source: ImageSource;
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

  if (Platform.OS === 'web') {
    // 웹의 FormData는 RN 스타일 { uri, name, type } 객체를 실제 파일로 인식하지 못하고
    // 문자열로 직렬화해버리므로, uri를 실제 Blob으로 변환해서 첨부해야 한다.
    const blob = await (await fetch(image.uri)).blob();
    formData.append('file', blob, image.fileName);
  } else {
    // React Native의 FormData는 파일 객체 형태로 { uri, name, type }을 요구한다.
    formData.append('file', {
      uri: image.uri,
      name: image.fileName,
      type: image.mimeType,
    } as unknown as Blob);
  }

  // apiClient가 기본 Content-Type을 application/json으로 강제하고 있어서, 명시적으로 비워주지
  // 않으면 FormData를 보낼 때도 이 헤더가 그대로 나가 boundary 없는 멀티파트가 되어버린다.
  // undefined로 지정하면 axios/브라우저가 FormData를 보고 boundary 포함 헤더를 자동 생성한다.
  const { data } = await apiClient.post<Contract>('/contracts/image', formData, {
    params: { source: image.source },
    headers: { 'Content-Type': undefined },
    // apiClient 기본 타임아웃(10초)은 GPT-4o Vision 분석 시간에 비해 너무 짧아서
    // 응답이 오기 전에 요청이 끊겨버린다. 이 요청만 넉넉하게 늘려준다.
    timeout: 60000,
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
