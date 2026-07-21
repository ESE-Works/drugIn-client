import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';
import Card from '@/components/Card';
import { getBenefits } from '@/features/policy/api/benefitsApi';

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
//  LOG  📬 [/benefits 응답 데이터]:
//  [
//   {
//     "id": "mock-1",
//     "title": "청년 월세 지원 (예시)",
//     "description": "무주택 청년의 월세 부담을 완화하기 위한 지원 제도 (mock 데이터)",
//     "region": "서울시",
//     "minAge": 19,
//     "maxAge": 34,
//     "incomeRange": null,
//     "url": "https://example.com/benefits/mock-1",
//     "source": "mock"
//   },
//   {
//     "id": "mock-2",
//     "title": "청년 도약계좌 (예시)",
//     "description": "청년의 자산 형성을 지원하는 정책성 금융상품 (mock 데이터)",
//     "region": null,
//     "minAge": 19,
//     "maxAge": 34,
//     "incomeRange": "3000-4000만원",
//     "url": "https://example.com/benefits/mock-2",
//     "source": "mock"
//   },
//   {
//     "id": "mock-3",
//     "title": "청년 전세자금대출 (예시)",
//     "description": "청년 무주택 세대주를 위한 저금리 전세자금대출 (mock 데이터)",
//     "region": null,
//     "minAge": 19,
//     "maxAge": 39,
//     "incomeRange": null,
//     "url": "https://example.com/benefits/mock-3",
//     "source": "mock"
//   }
// ]

export default function HomeScreen() {
  useEffect(() => {
    const fetchBenefitsLog = async () => {
      try {
        // 빈 객체 {}를 넘기면 전체 조회
        const params = {
          // region: '서울',
          // age: 25,
        };

        const data = await getBenefits(params);

        console.log('📬 [/benefits 응답 데이터]:\n', JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('❌ [/benefits API 요청 실패]:', error);
      }
    };

    void fetchBenefitsLog();
  }, []);

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
