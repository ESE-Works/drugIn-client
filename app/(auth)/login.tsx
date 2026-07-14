import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';
import { colors } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { handleKakaoLogin, handleGoogleLogin } = useSocialLogin();

  return (
    <LinearGradient
      colors={['#9BBDF9', '#FFFFFF', '#FFFFFF']}
      locations={[0, 0.4, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoSection}>
          <View style={styles.logoPlaceholder}>
            <View style={styles.innerDot} />
            <View style={styles.innerCircle} />
          </View>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        <View style={styles.buttonSection}>
          {/* 구글 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.baseButton, styles.googleButton]}
            activeOpacity={0.7}
            onPress={() => void handleGoogleLogin()}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>구글로 로그인</Text>
          </TouchableOpacity>

          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.baseButton, styles.kakaoButton]}
            activeOpacity={0.7}
            onPress={() => void handleKakaoLogin()}
          >
            <Text style={styles.kakaoIcon}>💬</Text>
            <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            activeOpacity={0.6}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.guestButtonText}>둘러보기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  // --- 임시 로고 스타일 (실제 에셋 적용 시 삭제) ---
  logoPlaceholder: {
    width: 70,
    height: 90,
    borderWidth: 5,
    borderColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    marginBottom: 8,
  },
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 5,
    borderColor: '#000',
  },
  // ------------------------------------------------
  logoText: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#000',
  },
  buttonSection: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 60,
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D4ED8',
    marginLeft: 8,
  },
  //
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 14,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DB4437',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  kakaoIcon: {
    fontSize: 16,
    color: '#000000',
  },
  guestButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  guestButtonText: {
    fontSize: 14,
    color: '#111827',
    textDecorationLine: 'underline',
  },
});
