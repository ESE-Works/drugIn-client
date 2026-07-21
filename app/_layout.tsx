import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { Platform, View, StyleSheet } from 'react-native';

import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const initAuth = useAuthStore((state) => state.initAuth);

  // 앱이 렌더링될 때 한 번 실행하여 토큰 검사
  useEffect(() => {
    void initAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <View style={Platform.OS === 'web' ? styles.webBackground : { flex: 1 }}>
          <View style={Platform.OS === 'web' ? styles.webContainer : styles.nativeContainer}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="mypage/index"
                options={{ title: '마이페이지', headerTitleAlign: 'center' }}
              />
            </Stack>
          </View>
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    maxWidth: 430,
    width: '100%',
    marginHorizontal: 'auto',
    minHeight: '100vh' as any,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e5e5',
    // 그림자로 살짝 떠 보이게 (web에서만 box-shadow 적용됨)
    boxShadow: '0 0 40px rgba(0,0,0,0.08)' as any,
  },
  webBackground: {
    flex: 1,
    backgroundColor: '#f0f0f0', // 컨테이너 바깥 배경색
    alignItems: 'center',
  },
});
