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
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/LOGO.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>청출어람</Text>
      </View>

      <View style={styles.rightSection}>
        <Link href="/mypage" asChild>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
            <Ionicons name="person-circle" size={33} color={colors.brand.primaryDeepest} />
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 45, // 로고 이미지의 너비 (원하는 크기로 조절하세요)
    height: 45, // 로고 이미지의 높이
  },

  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: -1,
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
