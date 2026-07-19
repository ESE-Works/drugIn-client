import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { socialLogin } from '../api/authApi';
import { getUserProfile } from '../api/userApi';
import { useAuthStore } from '@/store/authStore';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
});

export const useSocialLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const processBackendLogin = async (provider: 'kakao' | 'google', accessToken: string) => {
    // 서버로 토큰 보내서 JWT 발급받기
    const loginData = await socialLogin(provider, accessToken);
    const serverAccessToken = loginData.accessToken;
    const serverRefreshToken = loginData.refresh_token || '';

    // 발급받은 accessToken으로 유저 정보 조회
    const userProfile = await getUserProfile(serverAccessToken);
    console.log(`👀 [${provider}] getUserProfile이 반환한 값:`, userProfile);

    // 스토어에 저장 및 화면 이동
    await setAuth(userProfile, serverAccessToken, serverRefreshToken);
    if (userProfile.region && userProfile.age) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/onboarding');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const kakaoToken = await kakaoLogin();
      await processBackendLogin('kakao', kakaoToken.accessToken);
    } catch (e) {
      console.error('카카오 로그인 실패:', e);
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
      console.log('⭐️ 진짜 구글 토큰:', tokens.accessToken);

      // 백엔드로 구글 토큰 전달
      await processBackendLogin('google', tokens.accessToken);
    } catch (e) {
      console.error('구글 로그인 실패:', e);
    }
  };

  return { handleKakaoLogin, handleGoogleLogin };
};
