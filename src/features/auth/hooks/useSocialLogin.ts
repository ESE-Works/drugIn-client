import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { socialLogin, testLogin } from '../api/authApi';
import { getUserProfile } from '../api/userApi';
import { useAuthStore } from '@/store/authStore';
import { logger } from '@/lib/logger';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
});

// 심사위원 테스트용 어드민 로그인 키 (소셜 로그인 없이 앱 전체를 사용해볼 수 있게 함)
const TEST_LOGIN_KEY = 'ca28b8f7e8f55c0d35abbf4a';

export const useSocialLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const finishLogin = async (accessToken: string, refreshToken: string) => {
    // 발급받은 accessToken으로 유저 정보 조회
    const userProfile = await getUserProfile(accessToken);

    // 스토어에 저장 및 화면 이동
    await setAuth(userProfile, accessToken, refreshToken);
    if (userProfile.region && userProfile.age) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/onboarding');
    }
  };

  const processBackendLogin = async (provider: 'kakao' | 'google', accessToken: string) => {
    // 서버로 토큰 보내서 JWT 발급받기
    const loginData = await socialLogin(provider, accessToken);
    logger.log(`👀 [${provider}] socialLogin 응답:`, loginData);
    await finishLogin(loginData.accessToken, loginData.refresh_token || '');
  };

  const handleTestLogin = async () => {
    try {
      const { accessToken, refreshToken } = await testLogin(TEST_LOGIN_KEY);
      await finishLogin(accessToken, refreshToken);
    } catch (e) {
      logger.error('테스트 로그인 실패:', e);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const kakaoToken = await kakaoLogin();
      await processBackendLogin('kakao', kakaoToken.accessToken);
    } catch (e) {
      logger.error('카카오 로그인 실패:', e);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 구글 플레이 서비스 사용 가능 여부 체크
      await GoogleSignin.hasPlayServices();
      // 구글 로그인 창 띄우기
      await GoogleSignin.signIn();
      // 토큰 가져오기
      const tokens = await GoogleSignin.getTokens();
      logger.log('⭐️ 진짜 구글 토큰:', tokens.accessToken);

      // 백엔드로 구글 토큰 전달
      await processBackendLogin('google', tokens.accessToken);
    } catch (e) {
      logger.error('구글 로그인 실패:', e);
    }
  };

  return { handleKakaoLogin, handleGoogleLogin, handleTestLogin };
};
