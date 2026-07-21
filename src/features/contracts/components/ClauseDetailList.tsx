import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '@/components/Card';
import { colors, spacing, fontSize, fontWeight, radius } from '@/constants';
import type { Clause } from '@/types/api';

import SeverityTag from './SeverityTag';

interface ClauseDetailListProps {
  clauses: Clause[];
}

const SEVERITY_ORDER: Record<Clause['type'], number> = {
  danger: 0,
  warning: 1,
  safe: 2,
};

function sortBySeverity(clauses: Clause[]): Clause[] {
  return [...clauses].sort((a, b) => SEVERITY_ORDER[a.type] - SEVERITY_ORDER[b.type]);
}

function ClauseItem({ clause }: { clause: Clause }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setExpanded((prev) => !prev)}
      style={styles.clause}
    >
      <View style={styles.clauseHeader}>
        <SeverityTag severity={clause.type} />
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.text.secondary}
        />
      </View>
      <Text style={styles.originalText} numberOfLines={expanded ? undefined : 2}>
        {clause.original_text}
      </Text>
      {expanded && (
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>사유</Text>
          <Text style={styles.detailValue}>{clause.reason}</Text>
          <Text style={styles.detailLabel}>법적 근거</Text>
          <Text style={styles.detailValue}>{clause.law_reference}</Text>
          <Text style={styles.detailLabel}>제안</Text>
          <Text style={styles.detailValue}>{clause.suggestion}</Text>
          <Text style={styles.detailLabel}>요청 가이드</Text>
          <Text style={styles.detailValue}>{clause.request_guide}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ClauseDetailList({ clauses }: ClauseDetailListProps) {
  const sorted = sortBySeverity(clauses);

  return (
    <Card>
      <Text style={styles.title}>조항별 상세 분석</Text>
      <View style={styles.list}>
        {sorted.map((clause) => (
          <ClauseItem key={clause.id} clause={clause} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  clause: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  clauseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  originalText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  detail: {
    marginTop: spacing.sm,
    gap: spacing.xxs,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
});
