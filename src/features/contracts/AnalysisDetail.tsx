import React from 'react';
import { ScrollView, ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { colors, spacing, fontSize } from '@/constants';

import { useContractDetailQuery } from './hooks';
import AnalysisResultView from './components/AnalysisResultView';

export default function AnalysisDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: contract, isLoading, isError } = useContractDetailQuery(id);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (isError || !contract) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>분석 결과를 불러오지 못했어요.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AnalysisResultView contract={contract} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.bg.base,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
});
