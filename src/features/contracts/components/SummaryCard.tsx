import React from 'react';
import { Text, StyleSheet } from 'react-native';

import Card from '@/components/Card';
import { colors, spacing, fontSize, fontWeight } from '@/constants';

interface SummaryCardProps {
  summary: string;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card>
      <Text style={styles.title}>총평</Text>
      <Text style={styles.summary}>{summary}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summary: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
});
