import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { MarketPropertyType, TransactionType } from '@/types/api';

import MarketCheckResultCard from '@/features/marketCheck/components/MarketCheckResultCard';
import { useLastMarketCheckResult } from '@/features/marketCheck/hooks';
import { TRANSACTION_TYPE_LABEL } from '@/features/marketCheck/labels';

export default function MarketCheckReportScreen() {
  const params = useLocalSearchParams<{
    transactionType: TransactionType;
    propertyType: MarketPropertyType;
    amount: string;
    monthlyRent?: string;
    sido: string;
    sigungu: string;
  }>();

  const { data: result, isError } = useLastMarketCheckResult();

  const dealLabel = TRANSACTION_TYPE_LABEL[params.transactionType];
  const amountText = params.monthlyRent
    ? `보증금 ${Number(params.amount).toLocaleString()}만원 · 월세 ${Number(params.monthlyRent).toLocaleString()}만원`
    : `${Number(params.amount).toLocaleString()}만원`;

  const handleShare = (): void => {
    if (!result) return;
    void Share.share({
      message: `[${params.sido} ${params.sigungu}] ${dealLabel} · ${amountText}\n${result.message}`,
    });
  };

  const handleRestart = (): void => {
    router.replace('/analysis/market-check/step1');
  };

  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/analysis');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>진단 리포트</Text>
        <TouchableOpacity
          onPress={handleShare}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.addressBlock}>
          <Text style={styles.addressText}>
            {params.sido} {params.sigungu}
          </Text>
          <Text style={styles.dealText}>
            {dealLabel} · {amountText}
          </Text>
        </View>

        {isError || !result ? (
          <Text style={styles.errorText}>리포트를 불러올 수 없어요.</Text>
        ) : (
          <MarketCheckResultCard result={result} />
        )}

        <TouchableOpacity style={styles.restartButton} onPress={handleRestart} activeOpacity={0.7}>
          <Text style={styles.restartText}>다시 진단하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  addressBlock: {
    marginBottom: spacing.sm,
  },
  addressText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    lineHeight: 28,
  },
  dealText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing.xxxl,
  },
  restartButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  restartText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
