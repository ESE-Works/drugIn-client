import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { requireLogin } from '@/lib/authGate';
import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';

export default function MarketCheckLanding() {
  const handleStart = (): void => {
    if (requireLogin()) {
      router.push('/analysis/market-check/step1');
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="home-outline" size={40} color={colors.brand.primary} />
      <Text style={styles.title}>우리 동네 시세, 무료로 진단해보세요</Text>
      <Text style={styles.description}>
        거래유형과 금액, 지역만 알려주시면{'\n'}인근 실거래가와 비교해 적정한 수준인지 확인해드려요.
      </Text>

      <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.7}>
        <Text style={styles.startButtonText}>진단 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  startButton: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
