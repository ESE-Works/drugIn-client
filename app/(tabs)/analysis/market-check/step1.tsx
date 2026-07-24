import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import { useIsLoggedIn } from '@/lib/authGate';
import type { MarketPropertyType, TransactionType } from '@/types/api';

import StepHeader from '@/features/marketCheck/components/StepHeader';
import TransactionTypeSelector from '@/features/marketCheck/components/TransactionTypeSelector';
import AmountInput from '@/features/marketCheck/components/AmountInput';
import { PROPERTY_TYPE_LABEL } from '@/features/marketCheck/labels';

const PROPERTY_TYPES: MarketPropertyType[] = ['apartment', 'officetel', 'villa'];

export default function MarketCheckStep1Screen() {
  const isLoggedIn = useIsLoggedIn();
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [propertyType, setPropertyType] = useState<MarketPropertyType | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [monthlyRent, setMonthlyRent] = useState<number | null>(null);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const isMonthly = transactionType === 'monthly';
  const canProceed =
    transactionType !== null &&
    propertyType !== null &&
    amount !== null &&
    (!isMonthly || monthlyRent !== null);

  const handleNext = (): void => {
    if (!canProceed) return;

    router.push({
      pathname: '/analysis/market-check/step2',
      params: {
        transactionType,
        propertyType,
        amount: String(amount),
        ...(isMonthly && monthlyRent !== null ? { monthlyRent: String(monthlyRent) } : {}),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepHeader title="거래 유형 선택" progress={1 / 3} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>거래 유형을{'\n'}선택해주세요.</Text>

        <TransactionTypeSelector value={transactionType} onChange={setTransactionType} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>매물 유형</Text>
          <View style={styles.propertyRow}>
            {PROPERTY_TYPES.map((type) => {
              const active = propertyType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.propertyCard, active && styles.propertyCardActive]}
                  onPress={() => setPropertyType(type)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.propertyLabel, active && styles.propertyLabelActive]}>
                    {PROPERTY_TYPE_LABEL[type]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {transactionType && (
          <View style={styles.section}>
            <AmountInput
              label={isMonthly ? '보증금' : transactionType === 'sale' ? '매매가' : '전세금'}
              placeholder={`${isMonthly ? '보증금' : transactionType === 'sale' ? '매매가' : '전세금'}을 입력해주세요.`}
              value={amount}
              onChange={setAmount}
            />
          </View>
        )}

        {isMonthly && (
          <View style={styles.section}>
            <AmountInput
              label="월세"
              placeholder="월세를 입력해주세요."
              value={monthlyRent}
              onChange={setMonthlyRent}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
          activeOpacity={0.7}
        >
          <Text style={[styles.nextButtonText, !canProceed && styles.nextButtonTextDisabled]}>
            다음
          </Text>
        </TouchableOpacity>
      </View>
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
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  propertyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  propertyCard: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
  },
  propertyCardActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primaryGhost,
  },
  propertyLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  },
  propertyLabelActive: {
    color: colors.brand.primary,
    fontWeight: fontWeight.bold,
  },
  footer: {
    padding: spacing.xl,
  },
  nextButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.brand.primaryGhost,
  },
  nextButtonText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  nextButtonTextDisabled: {
    color: colors.text.disabled,
  },
});
