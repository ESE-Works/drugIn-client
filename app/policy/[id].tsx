import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';

import { colors } from '@/constants/colors';
import SubHeader from '@/components/layout/SubHeader';
import { getBenefitDetail } from '@/features/policy/api/benefitsApi';
import { logger } from '@/lib/logger';

interface BenefitDetail {
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

export default function PolicyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [detail, setDetail] = useState<BenefitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getBenefitDetail(id);
        setDetail(data);
      } catch (error) {
        logger.error(`❌ [/benefits/${id} API 요청 실패]:`, error);
      } finally {
        setLoading(false);
      }
    };
    void fetchDetail();
  }, [id]);

  const handlePressUrl = async (url: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      logger.warn(`이 URL을 열 수 없습니다: ${url}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <SubHeader title="상세 보기" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <SubHeader title="상세 보기" />
        <View style={styles.center}>
          <Text style={styles.text}>정보를 불러오지 못했습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubHeader title="청년정책 상세페이지" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{detail.title}</Text>

        <Text style={styles.sectionLabel}>지원 내용</Text>
        <Text style={styles.description}>{detail.description}</Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>지원 지역</Text>
          <Text style={styles.rowValue}>{detail.region ? detail.region : '전국 / 공통'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>지원 연령</Text>
          <Text style={styles.rowValue}>
            {detail.minAge ?? '제한없음'}세 ~ {detail.maxAge ?? '제한없음'}세
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>마감 기한</Text>
          <Text style={styles.rowValue}>
            {detail.applicationDeadline ? detail.applicationDeadline : '상시 모집 (또는 기한 없음)'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>출처</Text>
          <Text style={styles.rowValue}>{detail.source}</Text>
        </View>
      </ScrollView>

      {/* 💡 2. ScrollView 바깥으로 빼서 하단에 고정시킵니다. */}
      {detail.url && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.linkButton}
            activeOpacity={0.7}
            onPress={() => {
              void handlePressUrl(detail.url);
            }}
          >
            <Text style={styles.linkButtonText}>상세 페이지(신청) 바로가기</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 26,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  rowLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  rowValue: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },

  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 20,
    backgroundColor: colors.bg.base, // 버튼 뒤쪽 배경을 흰색(또는 기본 배경색)으로 채워 스크롤 시 글자가 겹쳐 보이지 않게 함
  },
  linkButton: {
    backgroundColor: colors.brand.primary,
    paddingVertical: 16, // 터치하기 좋게 살짝 더 넓게
    borderRadius: 12,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});
