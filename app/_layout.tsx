import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="mypage/index"
        options={{ title: '마이페이지', headerTitleAlign: 'center' }}
      />
    </Stack>
  );
}
