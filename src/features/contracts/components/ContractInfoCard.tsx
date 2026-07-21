import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Card from '@/components/Card';
import { colors, spacing, fontSize, fontWeight } from '@/constants';
import type { ContractExtraction } from '@/types/api';

interface ContractInfoCardProps {
  extraction: ContractExtraction;
}

const PROPERTY_TYPE_LABEL: Record<ContractExtraction['property_type'], string> = {
  apartment: '아파트',
  officetel: '오피스텔',
  villa: '빌라',
  oneroom: '원룸',
  unknown: '미확인',
};

const CONTRACT_TYPE_LABEL: Record<ContractExtraction['contract_type'], string> = {
  monthly: '월세',
  lease: '전세',
  semi_lease: '반전세',
  unknown: '미확인',
};

function formatWon(value: number | null): string {
  if (value === null) return '정보 없음';
  return `${value.toLocaleString()}만원`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function ContractInfoCard({ extraction }: ContractInfoCardProps) {
  return (
    <Card>
      <Text style={styles.title}>계약 정보</Text>
      <Row label="임대인" value={extraction.lessor_name ?? '정보 없음'} />
      <Row label="임차인" value={extraction.lessee_name ?? '정보 없음'} />
      <Row label="주소" value={extraction.property_address ?? '정보 없음'} />
      <Row label="주택 유형" value={PROPERTY_TYPE_LABEL[extraction.property_type]} />
      <Row label="계약 유형" value={CONTRACT_TYPE_LABEL[extraction.contract_type]} />
      <Row label="보증금" value={formatWon(extraction.deposit)} />
      <Row label="월세" value={formatWon(extraction.monthly_rent)} />
      <Row
        label="계약 기간"
        value={
          extraction.contract_start && extraction.contract_end
            ? `${extraction.contract_start} ~ ${extraction.contract_end}`
            : '정보 없음'
        }
      />
      {extraction.special_terms.length > 0 && (
        <View style={styles.specialTerms}>
          <Text style={styles.label}>특약 사항</Text>
          {extraction.special_terms.map((term, index) => (
            <Text key={index} style={styles.specialTermText}>
              · {term}
            </Text>
          ))}
        </View>
      )}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    flexShrink: 1,
    textAlign: 'right',
  },
  specialTerms: {
    marginTop: spacing.sm,
    gap: spacing.xxs,
  },
  specialTermText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
});
