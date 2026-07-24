import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, spacing, fontSize, fontWeight } from '@/constants';

interface StepHeaderProps {
  title: string;
  progress: number; // 0~1
}

export default function StepHeader({ title, progress }: StepHeaderProps) {
  const handleBack = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/analysis');
    }
  };

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.bg.base,
  },
  backButton: {
    marginRight: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginRight: 26 + spacing.lg,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border.subtle,
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.brand.primary,
  },
});
