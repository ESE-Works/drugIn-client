import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import SubHeader from '@/components/layout/SubHeader';
import { getMyConsents, type UserConsentItem } from '@/features/auth/api/termsApi';

// 💡 1. 서버의 영문 term_type을 유저가 보기 좋은 한글 제목으로 매핑
const TERM_TITLE_MAP: Record<string, string> = {
  PRIVACY_REQUIRED: '개인정보 수집·이용 동의 (필수)',
  UNIQUE_ID: '고유식별정보 처리 동의',
  THIRD_PARTY: '제3자 제공 및 처리위탁 동의',
  PRIVACY_OPTIONAL: '수집·이용 동의 (선택)',
  MARKETING: '마케팅 정보 수신 동의 (선택)',
};

export default function TermDetailScreen() {
  const [consents, setConsents] = useState<UserConsentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyConsents = async () => {
      try {
        const data = await getMyConsents();
        setConsents(data);
      } catch (error) {
        console.error('내 동의 이력 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchMyConsents();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(
      date.getDate(),
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubHeader title="나의 약관 동의 내역" />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.text.brand} />
        </View>
      ) : consents.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>동의 내역이 없습니다.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {consents.map((item) => {
            // 💡 2. 매핑 맵을 이용해 한글 타이틀 추출 (없으면 기본값 사용)
            const displayTitle = TERM_TITLE_MAP[item.term_type] ?? item.term_type;

            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  {/* 약관 종류 (한글명) */}
                  <Text style={styles.termType}>{displayTitle}</Text>

                  {/* agreed 상태에 따른 뱃지 */}
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: item.agreed
                          ? colors.brand.primaryGhost
                          : colors.border.muted,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: item.agreed ? colors.brand.primary : colors.text.secondary },
                      ]}
                    >
                      {item.agreed ? '동의함' : '미동의'}
                    </Text>
                  </View>
                </View>

                {/* 💡 3. term_version 필드 연결 */}
                <Text style={styles.version}>버전: {item.term_version}</Text>

                {/* 💡 4. agreed_at 필드 연결 */}
                <Text style={styles.date}>동의 일시: {formatDate(item.agreed_at)}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, gap: 16 },
  card: {
    backgroundColor: colors.bg.brandSubtle,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termType: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  version: { fontSize: 13, color: colors.text.secondary, marginBottom: 4 },
  date: { fontSize: 12, color: colors.text.disabled },
  emptyText: { fontSize: 14, color: colors.text.secondary },
});
