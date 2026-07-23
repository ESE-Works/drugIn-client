import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { TransactionType } from '@/types/api';

interface TransactionTypeSelectorProps {
  value: TransactionType | null;
  onChange: (value: TransactionType) => void;
}

const OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'jeonse', label: '전세' },
  { value: 'monthly', label: '월세' },
  { value: 'sale', label: '매매' },
];

export default function TransactionTypeSelector({ value, onChange }: TransactionTypeSelectorProps) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.card, active && styles.cardActive]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
  },
  cardActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primaryGhost,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  labelActive: {
    color: colors.brand.primary,
  },
});
