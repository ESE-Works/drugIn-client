import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ListItem from '@/components/ListItem';
import { colors, spacing, fontSize } from '@/constants';

import { useContractsListQuery } from './hooks';

export default function AnalysisHistory() {
  const { data: contracts, isLoading, isError } = useContractsListQuery();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>분석 이력을 불러오지 못했어요.</Text>
      </View>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>아직 분석한 계약서가 없어요.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {contracts.map((contract, index) => (
        <ListItem
          key={contract.id}
          title={contract.analysis_result?.summary ?? '분석 결과'}
          description={`위험도 ${contract.analysis_result?.risk_score ?? '-'}점`}
          leftContent={<Ionicons name="document-text-outline" size={22} color={colors.text.primary} />}
          rightContent={<Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />}
          hasDivider={index !== contracts.length - 1}
          onPress={() =>
            router.push({ pathname: '/analysis/[id]', params: { id: contract.id } })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
    padding: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
});
