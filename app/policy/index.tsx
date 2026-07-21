import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { getTerms, type TermItem } from '@/features/auth/api/termsApi';

export default function PolicyScreen() {
  const router = useRouter();
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        // GET /terms API 호출
        const data = await getTerms();

        // 데이터 정렬 (원한다면 필수 항목이 위로 오게 정렬 가능)
        // data.sort((a, b) => (b.is_required === a.is_required ? 0 : b.is_required ? 1 : -1));

        setTerms(data);
      } catch (error) {
        console.error('약관 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTerms();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>이용약관 및 동의서</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 로딩 및 본문 영역 */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.brand.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {terms.map((term) => (
            <View key={term.id} style={styles.termBlock}>
              <Text style={styles.termTitle}>
                {term.is_required ? '[필수] ' : '[선택] '}
                {term.title}
              </Text>
              <Text style={styles.termContent}>{term.content}</Text>
              <View style={styles.termFooter}>
                <Text style={styles.termMeta}>버전: {term.version}</Text>
                <Text style={styles.termMeta}>시행일: {term.effective_date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
    gap: 32, // 각 약관 덩어리 사이의 간격
  },
  termBlock: {
    // 굳이 박스를 치지 않고 글만 나열하고 싶다면 backgroundColor 등을 빼셔도 됩니다.
  },
  termTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  termContent: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  termFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  termMeta: {
    fontSize: 12,
    color: colors.text.disabled,
  },
});
