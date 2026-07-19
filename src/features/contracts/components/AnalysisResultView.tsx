import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import ListItem from '@/components/ListItem';
import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { AnalysisResult, Contract } from '@/types/api';

import RiskBadge from './RiskBadge';
import SeverityTag, { type ResultSeverity } from './SeverityTag';

interface AnalysisResultViewProps {
  contract: Contract;
  onRetry?: () => void;
}

interface ResultListItem {
  id: string;
  severity: ResultSeverity;
  title: string;
  description: string;
}

function buildResultItems(result: AnalysisResult): ResultListItem[] {
  const items: ResultListItem[] = [];

  result.fraud_risk?.indicators.forEach((indicator, index) => {
    items.push({
      id: `fraud-${index}`,
      severity: indicator.severity,
      title: indicator.indicator,
      description: indicator.description,
    });
  });

  result.clauses.forEach((clause) => {
    items.push({
      id: `clause-${clause.id}`,
      severity: clause.type,
      title: clause.reason,
      description: clause.suggestion,
    });
  });

  result.missing_check.forEach((check, index) => {
    items.push({
      id: `missing-${index}`,
      severity: check.severity,
      title: check.item,
      description: check.description,
    });
  });

  return items;
}

export default function AnalysisResultView({ contract, onRetry }: AnalysisResultViewProps) {
  if (contract.status === 'ANALYZING') {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>계약서를 분석하고 있어요. 잠시만 기다려주세요.</Text>
      </View>
    );
  }

  if (contract.status === 'FAILED' || !contract.analysis_result) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>분석에 실패했어요.</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const result = contract.analysis_result;

  if (!result.contract_valid) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>주거용 임대차 계약서로 확인되지 않았어요.</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const items = buildResultItems(result);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <RiskBadge score={result.risk_score} grade={result.risk_grade} />
      </View>
      {result.is_truncated && (
        <Text style={styles.truncatedNotice}>입력 텍스트가 길어 일부만 분석되었어요.</Text>
      )}

      <Text style={styles.sectionTitle}>분석 결과</Text>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>특별히 확인된 위험 요소가 없어요.</Text>
      ) : (
        <View style={styles.list}>
          {items.map((item, index) => (
            <ListItem
              key={item.id}
              title={item.title}
              description={item.description}
              leftContent={<SeverityTag severity={item.severity} />}
              hasDivider={index !== items.length - 1}
              style={styles.listItem}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
  },
  truncatedNotice: {
    fontSize: fontSize.xs,
    color: colors.status.warning,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  list: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  listItem: {
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxxl,
    gap: spacing.lg,
  },
  stateText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  retryText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
