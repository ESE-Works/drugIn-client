import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, Redirect } from 'expo-router';

import { colors } from '@/constants/colors';
import ListItem from '@/components/ListItem';
import SubHeader from '@/components/layout/SubHeader';
import { useAuthStore } from '@/store/authStore';

export default function MyPage() {
  const user = useAuthStore((state) => state.user);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    console.log('====== 현재 스토어에 저장된 유저 정보 ======');
    console.log(JSON.stringify(user, null, 2)); // 보기 좋게 포맷팅해서 출력
    console.log('==============================================');
  }, [user]);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const displayNickname = user?.nickname ? user.nickname : '로딩 중...';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubHeader title={displayNickname} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>개인정보</Text>

        <ListItem
          title="거주 지역"
          leftContent={<Ionicons name="location-outline" size={22} color={colors.text.primary} />}
          rightContent={<Text style={styles.badgeText}>{user?.region ?? '미설정'}</Text>}
          onPress={() => console.log('거주 지역 클릭')}
        />

        <ListItem
          title="나이"
          leftContent={<Ionicons name="calendar-outline" size={22} color={colors.text.primary} />}
          rightContent={
            <Text style={styles.badgeText}>{user?.age ? `${user.age}세` : '미설정'}</Text>
          }
          onPress={() => console.log('나이 클릭')}
        />

        <ListItem
          title="소득 구간"
          leftContent={<Ionicons name="wallet-outline" size={22} color={colors.text.primary} />}
          rightContent={<Text style={styles.badgeText}>{user?.income_range ?? '미설정'}</Text>}
          onPress={() => console.log('소득 구간 클릭')}
        />

        <View style={styles.divider} />

        <ListItem
          title="약관동의내역"
          leftContent={
            <Ionicons name="document-text-outline" size={22} color={colors.text.primary} />
          }
          onPress={() => router.push('/terms')}
        />

        {/* <ListItem
          title="온보딩 테스트"
          leftContent={<Ionicons size={22} color={colors.text.primary} />}
          onPress={() => router.push('/(auth)/onboarding')}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40, // 맨 아래 여유 공간
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 12, // 리스트 아이템들과 줄을 맞추기 위함
  },
  activeListItem: {
    backgroundColor: colors.brand.primaryGhost, // 연한 파란색 배경
    borderRadius: 12, // 둥근 모서리
  },
  badgeText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 12, // 양옆 살짝 띄우기
  },
});
