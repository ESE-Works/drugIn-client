import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import Toast from '@/components/Toast';
import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { MarketPropertyType, TransactionType } from '@/types/api';

import StepHeader from '@/features/marketCheck/components/StepHeader';
import RegionSelectField from '@/features/marketCheck/components/RegionSelectField';
import { REGIONS, getSigunguList } from '@/features/marketCheck/regions';
import { useMarketCheckMutation, marketCheckKeys } from '@/features/marketCheck/hooks';

function getErrorMessage(error: unknown): string {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 400) {
    return '선택하신 지역은 아직 지원하지 않아요. 다른 지역으로 시도해주세요.';
  }
  return '진단 요청 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
}

export default function MarketCheckStep2Screen() {
  const params = useLocalSearchParams<{
    transactionType: TransactionType;
    propertyType: MarketPropertyType;
    amount: string;
    monthlyRent?: string;
  }>();

  const [sido, setSido] = useState<string | null>(null);
  const [sigungu, setSigungu] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const mutation = useMarketCheckMutation();

  const canProceed = sido !== null && sigungu !== null;

  const handleConfirm = (): void => {
    if (!canProceed || !sido || !sigungu) return;

    const amount = Number(params.amount);
    const monthlyRent = params.monthlyRent ? Number(params.monthlyRent) : undefined;

    mutation.mutate(
      {
        transactionType: params.transactionType,
        propertyType: params.propertyType,
        amount,
        ...(monthlyRent !== undefined ? { monthlyRent } : {}),
        sido,
        sigungu,
      },
      {
        onSuccess: (result) => {
          queryClient.setQueryData(marketCheckKeys.lastResult, result);
          router.push({
            pathname: '/analysis/market-check/report',
            params: { ...params, sido, sigungu },
          });
        },
        onError: (error) => {
          setToastMessage(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepHeader title="주소입력" progress={2 / 3} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>진단 받을 곳의 주소를{'\n'}입력해주세요.</Text>

        <RegionSelectField
          label="시/도"
          placeholder="시/도를 선택해주세요."
          value={sido}
          options={REGIONS.map((region) => region.sido)}
          onChange={(value) => {
            setSido(value);
            setSigungu(null);
          }}
        />

        <RegionSelectField
          label="시/군/구"
          placeholder="시/군/구를 선택해주세요."
          value={sigungu}
          options={sido ? getSigunguList(sido) : []}
          onChange={setSigungu}
          disabled={!sido}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ⓘ 동·호 구분이 명확하지 않은 일반건물(다가구, 고시원 등)은 건물 기준으로 분석이
            제공됩니다.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!canProceed || mutation.isPending) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!canProceed || mutation.isPending}
          activeOpacity={0.7}
        >
          {mutation.isPending ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text
              style={[styles.confirmButtonText, !canProceed && styles.confirmButtonTextDisabled]}
            >
              확인
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  heading: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    lineHeight: 32,
  },
  infoBox: {
    backgroundColor: colors.bg.muted,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.xl,
  },
  confirmButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.brand.primaryGhost,
  },
  confirmButtonText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  confirmButtonTextDisabled: {
    color: colors.text.disabled,
  },
});
