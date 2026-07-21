import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors, spacing, fontSize, fontWeight } from '@/constants';
import type { RiskGrade } from '@/types/api';

interface RiskScoreGaugeProps {
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

const SIZE = 160;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RiskScoreGauge({ score, grade }: RiskScoreGaugeProps) {
  const tone = getTone(grade);
  const isCritical = grade === 'critical';
  const clampedScore = Math.max(0, Math.min(100, score));
  const progress = CIRCUMFERENCE * (1 - clampedScore / 100);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.border.subtle}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={tone.text}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={progress}
          fill="none"
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.score, { color: tone.text }]}>{clampedScore}</Text>
        <Text style={styles.scoreUnit}>점</Text>
      </View>
      <Text style={[styles.grade, { color: tone.text }, isCritical && styles.criticalText]}>
        {GRADE_LABEL[grade]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  score: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  scoreUnit: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  grade: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  criticalText: {
    fontSize: fontSize.xl,
  },
});
