import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { Contract } from '@/types/api';

import RiskScoreGauge from './RiskScoreGauge';
import FraudAlertBanner from './FraudAlertBanner';
import SummaryCard from './SummaryCard';
import ContractInfoCard from './ContractInfoCard';
import ChecklistSection from './ChecklistSection';
import ClauseDetailList from './ClauseDetailList';

interface AnalysisResultViewProps {
  contract: Contract;
  onRetry?: () => void;
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

  return (
    <View style={styles.container}>
      <RiskScoreGauge score={result.risk_score} grade={result.risk_grade} />

      {result.is_truncated && (
        <Text style={styles.truncatedNotice}>입력 텍스트가 길어 일부만 분석되었어요.</Text>
      )}

      {result.fraud_risk?.detected && <FraudAlertBanner fraudRisk={result.fraud_risk} />}

      <SummaryCard summary={result.summary} />

      {result.extraction && <ContractInfoCard extraction={result.extraction} />}

      {result.missing_check.length > 0 && <ChecklistSection items={result.missing_check} />}

      {result.clauses.length > 0 && <ClauseDetailList clauses={result.clauses} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  truncatedNotice: {
    alignSelf: 'center',
    fontSize: fontSize.xs,
    color: colors.status.warning,
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
