import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="mypage/index"
          options={{ title: '마이페이지', headerTitleAlign: 'center' }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
