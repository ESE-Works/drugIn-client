import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Card from '@/components/Card';
import { colors, spacing, fontSize, fontWeight } from '@/constants';
import type { MissingCheckItem } from '@/types/api';

import SeverityTag from './SeverityTag';

interface ChecklistSectionProps {
  items: MissingCheckItem[];
}

export default function ChecklistSection({ items }: ChecklistSectionProps) {
  return (
    <Card>
      <Text style={styles.title}>누락 확인 항목</Text>
      <View style={styles.list}>
        {items.map((item, index) => (
          <View
            key={`${item.item}-${index}`}
            style={[styles.item, index > 0 && styles.itemSpacing]}
          >
            <SeverityTag severity={item.severity} />
            <View style={styles.textGroup}>
              <Text style={styles.itemTitle}>{item.item}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          </View>
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
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  itemSpacing: {
    marginTop: spacing.md,
  },
  textGroup: {
    flex: 1,
  },
  itemTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  itemDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
