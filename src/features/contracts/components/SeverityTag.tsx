import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';

export type ResultSeverity = 'danger' | 'warning' | 'safe';

interface SeverityTagProps {
  severity: ResultSeverity;
}

const CONFIG: Record<ResultSeverity, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  danger: { label: '위험', icon: 'warning' },
  warning: { label: '주의', icon: 'warning-outline' },
  safe: { label: '안전', icon: 'checkmark' },
};

function getTone(severity: ResultSeverity) {
  if (severity === 'safe') return colors.analysis.safe;
  if (severity === 'warning') return colors.analysis.caution;
  return colors.analysis.danger;
}

export default function SeverityTag({ severity }: SeverityTagProps) {
  const tone = getTone(severity);
  const { label, icon } = CONFIG[severity];

  return (
    <View style={[styles.container, { backgroundColor: tone.bg }]}>
      <Ionicons name={icon} size={14} color={tone.text} />
      <Text style={[styles.label, { color: tone.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
