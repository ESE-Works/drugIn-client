import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.logo}>Logo</Text>

      <View style={styles.rightSection}>
        <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={23} color={colors.brand.primaryDeepest} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        <Link href="/mypage" asChild>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconButton}
            // onPress={() => router.push('/mypage')}
          >
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
    // paddingVertical: 12,
    paddingBottom: 12,
    backgroundColor: colors.bg.base,
  },
  logo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.brand.primary,
    letterSpacing: -0.5,
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
