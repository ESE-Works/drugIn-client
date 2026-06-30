import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';

import { colors } from '@/constants/colors';
import ListItem from '@/components/ListItem';
import SubHeader from '@/components/layout/SubHeader';

export default function MyPage() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubHeader title="닉네임" />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>서류</Text>

        <ListItem
          title="업로드한 계약서"
          leftContent={<Ionicons name="checkbox" size={22} color={colors.text.primary} />}
          rightContent={<Text style={styles.badgeText}>24</Text>}
          style={styles.activeListItem}
          onPress={() => console.log('업로드한 계약서 클릭')}
        />

        <ListItem
          title="스크랩한 정책"
          leftContent={<Ionicons name="bookmark-outline" size={22} color={colors.text.primary} />}
          onPress={() => console.log('스크랩한 정책 클릭')}
        />

        <ListItem
          title="삭제한 계약서"
          leftContent={<Ionicons name="trash-outline" size={22} color={colors.text.primary} />}
          onPress={() => console.log('삭제한 계약서 클릭')}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>계정</Text>

        <ListItem
          title="로그아웃"
          leftContent={<Ionicons name="log-out-outline" size={22} color={colors.text.primary} />}
          onPress={() => console.log('로그아웃 클릭')}
        />

        <ListItem
          title="개인정보처리방침"
          leftContent={<Ionicons name="log-out-outline" size={22} color={colors.text.primary} />} // 시안에 맞춰 동일한 아이콘 사용
          onPress={() => console.log('개인정보처리방침 클릭')}
        />

        <ListItem
          title="계정 삭제하기"
          titleStyle={{ color: colors.status.error }}
          onPress={() => console.log('계정 삭제하기 클릭')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between', // 양끝 정렬로 타이틀을 중앙에 배치
  //   paddingHorizontal: 20,
  //   paddingVertical: 16,
  // },
  // headerTitle: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: colors.text.primary,
  // },
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
