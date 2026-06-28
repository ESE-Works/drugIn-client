import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  // ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';
import Card from '@/components/Card';

const DUMMY_POLICIES = [
  {
    id: 1,
    title: '정책명',
    description: 'Description duis aute irure dolor in reprehenderit 지원 내용 어쩌고',
    dDay: 'D-48',
  },
  {
    id: 2,
    title: '정책명',
    description: 'Description duis aute irure dolor in reprehenderit 지원 내용 어쩌고',
    dDay: 'D-48',
  },
  {
    id: 3,
    title: '정책명',
    description: 'Description duis aute irure dolor in reprehenderit 지원 내용 어쩌고',
    dDay: 'D-48',
  },
  {
    id: 4,
    title: '정책명',
    description: 'Description duis aute irure dolor in reprehenderit 지원 내용 어쩌고',
    dDay: 'D-48',
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.filterRow}>
          <TouchableOpacity activeOpacity={0.7} style={styles.filterButton}>
            <Text style={styles.filterText}>조건 추가하기</Text>
          </TouchableOpacity>

          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="search-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {DUMMY_POLICIES.map((policy, index) => (
            <View key={policy.id}>
              <Card
                onPress={() => router.push(`/policy/${policy.id}` as any)}
                style={styles.cardStyle}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{policy.title}</Text>
                  <View style={styles.iconGroup}>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="bookmark-outline" size={22} color={colors.text.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="share-social-outline" size={22} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.cardDescription} numberOfLines={2}>
                  {policy.description}
                </Text>

                <Text style={styles.cardDday}>신청 기한 | {policy.dDay}</Text>
              </Card>

              {index !== DUMMY_POLICIES.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.bg.base,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  listContainer: {
    gap: 0,
  },
  cardStyle: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardDday: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brand.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  loaderContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
});
