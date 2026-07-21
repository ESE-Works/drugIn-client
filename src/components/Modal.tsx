import React from 'react';
import { Modal as RNModal, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export default function Modal({ visible, message = '분석 중이에요...' }: LoadingModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors.bg.base,
    borderRadius: radius.xl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  message: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
});
