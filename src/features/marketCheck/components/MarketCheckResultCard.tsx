import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Card from '@/components/Card';
import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { MarketCheckResult } from '@/types/api';

interface MarketCheckResultCardProps {
  result: MarketCheckResult;
}

const RISK_LABEL: Record<MarketCheckResult['riskLevel'], string> = {
  safe: '안전',
  warning: '주의',
  unknown: '데이터 없음',
};

function getTone(riskLevel: MarketCheckResult['riskLevel']) {
  if (riskLevel === 'safe') return colors.analysis.safe;
  if (riskLevel === 'warning') return colors.analysis.caution;
  return { text: colors.text.secondary, bg: colors.bg.muted };
}

function formatWon(value: number | null): string {
  if (value === null) return '정보 없음';
  return `${value.toLocaleString()}만원`;
}

export default function MarketCheckResultCard({ result }: MarketCheckResultCardProps) {
  const tone = getTone(result.riskLevel);

  if (!result.available) {
    return (
      <Card>
        <Text style={styles.unavailableText}>
          최근 3개월 내 실거래가 데이터가 없어 비교가 어려워요.
        </Text>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: tone.bg }]}>
        <Text style={[styles.badgeText, { color: tone.text }]}>{RISK_LABEL[result.riskLevel]}</Text>
      </View>

      <Card>
        <Text style={styles.message}>{result.message}</Text>
      </Card>

      <Card>
        <Text style={styles.statsTitle}>인근 실거래가 비교</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>중간값</Text>
          <Text style={styles.statValue}>{formatWon(result.marketMedianAmount)}</Text>
        </View>
        {result.marketMedianMonthlyRent !== null && (
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>월세 중간값</Text>
            <Text style={styles.statValue}>{formatWon(result.marketMedianMonthlyRent)}</Text>
          </View>
        )}
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>차이</Text>
          <Text style={styles.statValue}>
            {result.diffPercent !== null
              ? `${result.diffPercent > 0 ? '+' : ''}${result.diffPercent}%`
              : '정보 없음'}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>표본 수</Text>
          <Text style={styles.statValue}>{result.sampleCount}건</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  badgeText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  statsTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  unavailableText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
