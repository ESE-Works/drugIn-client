import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';

interface ToastProps {
  message: string | null;
  onHide: () => void;
  duration?: number;
}

export default function Toast({
  message,
  onHide,
  duration = 3000,
}: ToastProps): React.ReactElement | null {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onHide]);

  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xxxxl,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.text.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    pointerEvents: 'none',
  },
  text: {
    color: colors.text.inverse,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
