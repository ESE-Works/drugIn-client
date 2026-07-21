import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.logoText}>청출어람</Text>
      <View style={styles.rightSection}>
        <Link href="/mypage" asChild>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
            <Ionicons name="person-circle" size={26} color={colors.brand.primaryDeepest} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.bg.base,
  },
  logoText: {
    fontSize: 24, // 글자 크기를 키우기
    fontWeight: '900', // 최대한 두껍게 설정
    color: '#2563EB', // 사진과 유사한 파란색 계열 (원하시는 톤으로 조절 가능)
    // marginTop: 12, // 위쪽 로고 이미지와의 간격
    letterSpacing: -1, // 자간을 좁혀서 묵직한 느낌 주기
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.status.badge,
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.bg.base,
  },
  badgeText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
