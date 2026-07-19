import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { RiskGrade } from '@/types/api';

interface RiskBadgeProps {
  score: number;
  grade: RiskGrade;
}

const GRADE_LABEL: Record<RiskGrade, string> = {
  safe: '안전',
  warning: '주의',
  danger: '위험',
  critical: '매우 위험',
};

function getTone(grade: RiskGrade) {
  if (grade === 'safe') return colors.analysis.safe;
  if (grade === 'warning') return colors.analysis.caution;
  return colors.analysis.danger; // danger, critical
}

export default function RiskBadge({ score, grade }: RiskBadgeProps) {
  const tone = getTone(grade);
  const isCritical = grade === 'critical';

  return (
    <View style={[styles.container, { backgroundColor: tone.bg }]}>
      <Text style={[styles.grade, { color: tone.text }, isCritical && styles.criticalText]}>
        {GRADE_LABEL[grade]}
      </Text>
      <Text style={[styles.score, { color: tone.text }]}>위험도 {score}점</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
  },
  grade: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  criticalText: {
    fontSize: fontSize.xl,
  },
  score: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
