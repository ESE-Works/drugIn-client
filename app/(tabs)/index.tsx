import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';
import Card from '@/components/Card';
import { getBenefits } from '@/features/policy/api/benefitsApi';
import { logger } from '@/lib/logger';

interface PolicyItem {
  id: string;
  title: string;
  description: string;
  region: string | null;
  minAge: number | null;
  maxAge: number | null;
  incomeRange: string | null;
  applicationDeadline: string | null;
  url: string;
  source: string;
}

export default function HomeScreen() {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setIsLoading(true);
        const data = await getBenefits({});
        setPolicies(data);
      } catch (error) {
        logger.error('❌ [/benefits API 요청 실패]:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBenefits();
  }, []);

  // FlatList의 각 아이템을 렌더링하는 함수
  const renderItem = ({ item }: { item: PolicyItem }) => (
    <Card onPress={() => router.push(`/policy/${item.id}` as any)} style={styles.cardStyle}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.cardDday}>
        신청 기한 | {item.applicationDeadline ? item.applicationDeadline : '상시 모집'}
      </Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
          <Text style={{ marginTop: 10, color: colors.text.secondary }}>혜택을 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={policies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          //ListHeaderComponent={
          //<View style={styles.filterRow}>
          //<TouchableOpacity
          //activeOpacity={0.7}
          //style={styles.filterButton}
          // >
          //</View> <Text style={styles.filterText}>내 정보로 조회하기</Text>
          //</View> </TouchableOpacity>
          // </View>
          // }
          // 최적화 옵션 (2000개 렌더링 대비)
          initialNumToRender={10} // 처음에는 10개만 그림
          maxToRenderPerBatch={10} // 스크롤할 때마다 10개씩 더 그림
          windowSize={5}
        />
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  cardDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 26,
    marginBottom: 16,
  },
  cardDday: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    backgroundColor: colors.bg.muted, // 💡 팔레트에 있는 연한 회색(gray100) 배경 적용
    paddingVertical: 6, // 💡 위아래 안쪽 여백
    paddingHorizontal: 12, // 💡 좌우 안쪽 여백
    borderRadius: 8, // 💡 모서리를 둥글게
    overflow: 'hidden', // 💡 iOS에서 Text 컴포넌트에 borderRadius를 적용할 때 필수!
    alignSelf: 'flex-start',
  },
  // divider: {
  //   height: 1,
  //   backgroundColor: colors.border.subtle,
  //   marginBottom: 16,
  //   marginHorizontal: 8,
  // },
  loaderContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
});
