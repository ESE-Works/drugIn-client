import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import { useSocialLogin } from '@/features/auth/hooks/useSocialLogin';
import { colors } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { handleKakaoLogin, handleGoogleLogin, handleTestLogin } = useSocialLogin();

  const [loadingProvider, setLoadingProvider] = useState<'google' | 'kakao' | 'test' | null>(null);

  const onGooglePress = async () => {
    if (loadingProvider !== null) return;
    try {
      setLoadingProvider('google');
      await handleGoogleLogin();
    } finally {
      setLoadingProvider(null);
    }
  };

  const onKakaoPress = async () => {
    if (loadingProvider !== null) return;
    try {
      setLoadingProvider('kakao');
      await handleKakaoLogin();
    } finally {
      setLoadingProvider(null);
    }
  };

  const onTestPress = async () => {
    if (loadingProvider !== null) return;
    try {
      setLoadingProvider('test');
      await handleTestLogin();
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <LinearGradient
      colors={['#9BBDF9', '#FFFFFF', '#FFFFFF']}
      locations={[0, 0.4, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/images/LOGO.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>청출어람</Text>
        </View>

        <View style={styles.buttonSection}>
          {/* 구글 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.baseButton, styles.googleButton]}
            activeOpacity={0.7}
            disabled={loadingProvider !== null}
            onPress={() => void onGooglePress()}
          >
            {loadingProvider === 'google' ? (
              <ActivityIndicator size="small" color="#374151" style={styles.iconStyle} />
            ) : (
              <Svg width={18} height={18} viewBox="0 0 24 24" style={styles.iconStyle}>
                <Path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <Path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.14C3.15 21.36 7.23 24 12 24z"
                />
                <Path
                  fill="#FBBC05"
                  d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.18C.43 8.13 0 9.83 0 12s.43 3.87 1.18 5.38l4.09-3.14z"
                />
                <Path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.64 1.18 6.62l4.09 3.14c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </Svg>
            )}
            <Text style={styles.googleButtonText}>
              {loadingProvider === 'google' ? '로그인 중...' : '구글로 로그인'}
            </Text>
          </TouchableOpacity>

          {/* 카카오 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.baseButton, styles.kakaoButton]}
            activeOpacity={0.7}
            disabled={loadingProvider !== null}
            onPress={() => void onKakaoPress()}
          >
            {loadingProvider === 'kakao' ? (
              <ActivityIndicator size="small" color="#000000" style={styles.iconStyle} />
            ) : (
              <Svg width={18} height={18} viewBox="0 0 24 24" style={styles.iconStyle}>
                <Path
                  fill="#000000"
                  d="M12 3c-5.52 0-10 3.58-10 8 0 2.76 1.76 5.18 4.41 6.63-.19.71-.7 2.58-.8 2.97-.13.51.19.5.4.33.17-.13 2.73-1.85 3.77-2.57.73.11 1.48.17 2.22.17 5.52 0 10-3.58 10-8s-4.48-8-10-8z"
                />
              </Svg>
            )}
            <Text style={styles.kakaoButtonText}>
              {loadingProvider === 'kakao' ? '로그인 중...' : '카카오로 로그인'}
            </Text>
          </TouchableOpacity>

          {/* 심사위원 테스트용 임시 버튼 (소셜 로그인 없이 전체 기능 확인 가능) */}
          <TouchableOpacity
            style={[styles.baseButton, styles.testButton]}
            activeOpacity={0.7}
            disabled={loadingProvider !== null}
            onPress={() => void onTestPress()}
          >
            {loadingProvider === 'test' ? (
              <ActivityIndicator size="small" color="#374151" style={styles.iconStyle} />
            ) : null}
            <Text style={styles.testButtonText}>
              {loadingProvider === 'test' ? '로그인 중...' : '테스트 로그인'}
            </Text>
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
  logoImage: {
    width: 150, // 로고 이미지의 가로 크기
    height: 150, // 로고 이미지의 세로 크기
    // marginBottom: 16, // 로고 이미지와 "LOGO" 텍스트 사이의 간격
  },
  logoText: {
    fontSize: 34, // 글자 크기를 키우기
    fontWeight: '900', // 최대한 두껍게 설정
    color: '#2563EB', // 사진과 유사한 파란색 계열 (원하시는 톤으로 조절 가능)
    // marginTop: 12, // 위쪽 로고 이미지와의 간격
    letterSpacing: -1, // 자간을 좁혀서 묵직한 느낌 주기
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
  iconStyle: {
    marginRight: 8, // 아이콘과 텍스트 사이 간격
  },
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
  testButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
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
