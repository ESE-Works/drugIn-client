import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';

interface AmountInputProps {
  label: string;
  placeholder: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

function formatWithComma(value: number): string {
  return value.toLocaleString('ko-KR');
}

export default function AmountInput({ label, placeholder, value, onChange }: AmountInputProps) {
  const displayValue = value !== null ? formatWithComma(value) : '';

  const handleChangeText = (text: string): void => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    if (digitsOnly.length === 0) {
      onChange(null);
      return;
    }
    onChange(Number(digitsOnly));
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          value={displayValue}
          onChangeText={handleChangeText}
        />
        <Text style={styles.unit}>만원</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.muted,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  unit: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
