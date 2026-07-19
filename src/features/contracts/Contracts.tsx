import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

import Toast from '@/components/Toast';
import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { ApiErrorBody, Contract } from '@/types/api';

import { useAnalyzeSpecialTermsMutation, useAnalyzeTextMutation, useContractSampleQuery } from './hooks';
import AnalysisResultView from './components/AnalysisResultView';

type Mode = 'full' | 'special_terms';
type Stage = 'idle' | 'loading' | 'result';

const PLACEHOLDER: Record<Mode, string> = {
  full: '계약서 전체 내용을 붙여넣어\n위험 요소를 분석해보세요',
  special_terms: '특약 조항만 붙여넣어\n위험 요소를 분석해보세요',
};

function getErrorMessage(error: unknown): string {
  const body = (error as { response?: { data?: ApiErrorBody } })?.response?.data;
  return body?.message ?? '분석 요청 중 오류가 발생했어요.';
}

export default function Contracts() {
  const [stage, setStage] = useState<Stage>('idle');
  const [mode, setMode] = useState<Mode>('full');
  const [text, setText] = useState('');
  const [contract, setContract] = useState<Contract | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const analyzeTextMutation = useAnalyzeTextMutation();
  const analyzeSpecialTermsMutation = useAnalyzeSpecialTermsMutation();
  const sampleQuery = useContractSampleQuery(false);

  const handleSubmit = (): void => {
    if (!text.trim()) {
      setToastMessage('분석할 텍스트를 입력해주세요.');
      return;
    }

    const mutation = mode === 'full' ? analyzeTextMutation : analyzeSpecialTermsMutation;
    setStage('loading');
    mutation.mutate(text, {
      onSuccess: (result) => {
        setContract(result);
        setStage('result');
      },
      onError: (error) => {
        setToastMessage(getErrorMessage(error));
        setStage('idle');
      },
    });
  };

  const handleViewSample = (): void => {
    setStage('loading');
    sampleQuery
      .refetch()
      .then((result) => {
        if (result.data) {
          setContract(result.data);
          setStage('result');
        } else {
          setToastMessage('샘플을 불러오지 못했어요.');
          setStage('idle');
        }
      })
      .catch(() => {
        setToastMessage('샘플을 불러오지 못했어요.');
        setStage('idle');
      });
  };

  const handleReset = (): void => {
    setContract(null);
    setText('');
    setStage('idle');
  };

  if (stage === 'result' && contract) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <AnalysisResultView contract={contract} onRetry={handleReset} />
        </ScrollView>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>다시 분석하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLoading = stage === 'loading';

  return (
    <View style={styles.container}>
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'full' && styles.modeButtonActive]}
          onPress={() => setMode('full')}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Text style={[styles.modeText, mode === 'full' && styles.modeTextActive]}>
            전체 계약서 분석
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'special_terms' && styles.modeButtonActive]}
          onPress={() => setMode('special_terms')}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Text style={[styles.modeText, mode === 'special_terms' && styles.modeTextActive]}>
            특약 조항만 분석
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.box}
        multiline
        editable={!isLoading}
        placeholder={PLACEHOLDER[mode]}
        placeholderTextColor={colors.brand.primaryDark}
        value={text}
        onChangeText={setText}
      />

      <View style={styles.belowBox}>
        {isLoading ? (
          <>
            <Text style={styles.loadingText}>분석 중</Text>
            <ActivityIndicator size="large" color={colors.brand.primary} />
          </>
        ) : text.trim().length > 0 ? (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.7}>
            <Text style={styles.submitText}>분석하기</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.caption}>계약서 텍스트만 있으면{'\n'}위험요소를 찾아드려요</Text>
        )}
      </View>

      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={handleViewSample} disabled={isLoading}>
          <Text style={styles.footerLink}>샘플로 먼저 볼까요?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/analysis/history')} disabled={isLoading}>
          <Text style={styles.footerLink}>분석 이력</Text>
        </TouchableOpacity>
      </View>

      <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
    padding: spacing.lg,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: colors.brand.primaryGhost,
    borderColor: colors.brand.primary,
  },
  modeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  modeTextActive: {
    color: colors.brand.primary,
    fontWeight: fontWeight.bold,
  },
  box: {
    height: 220,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.brand.primary,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.primaryGhost,
    padding: spacing.lg,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  belowBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  caption: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  submitButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: 'auto',
    paddingBottom: spacing.lg,
  },
  footerLink: {
    fontSize: fontSize.sm,
    color: colors.brand.primary,
    fontWeight: fontWeight.medium,
  },
  resultScroll: {
    paddingBottom: spacing.lg,
  },
  resetButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resetText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
