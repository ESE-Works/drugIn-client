import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { FraudRisk } from '@/types/api';

interface FraudAlertBannerProps {
  fraudRisk: FraudRisk;
}

export default function FraudAlertBanner({ fraudRisk }: FraudAlertBannerProps) {
  const tone = colors.analysis.danger;

  return (
    <View style={[styles.container, { backgroundColor: tone.bg }]}>
      <View style={styles.titleRow}>
        <Ionicons name="alert-circle" size={20} color={tone.text} />
        <Text style={[styles.title, { color: tone.text }]}>사기 위험이 감지됐어요</Text>
      </View>
      {fraudRisk.indicators.map((indicator, index) => (
        <View key={`${indicator.indicator}-${index}`} style={styles.indicator}>
          <Text style={[styles.indicatorTitle, { color: tone.text }]}>{indicator.indicator}</Text>
          <Text style={styles.indicatorDescription}>{indicator.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  indicator: {
    marginTop: spacing.sm,
  },
  indicatorTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  indicatorDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
});
