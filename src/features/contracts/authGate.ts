import { router } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

/**
 * 로그인 여부를 확인하고, 로그인하지 않았다면 로그인 화면으로 이동시킨다.
 * 버튼 클릭 등 특정 동작 직전에 호출한다 (샘플 보기처럼 비로그인 허용 동작에는 사용하지 않음).
 */
export function requireLogin(): boolean {
  const isLoggedIn = useAuthStore.getState().isLoggedIn;
  if (!isLoggedIn) {
    router.replace('/(auth)/login');
  }
  return isLoggedIn;
}

/**
 * 화면 진입 자체를 로그인 여부로 가드할 때 쓰는 상태 훅 (분석 이력/상세처럼 딥링크로 바로 들어올 수 있는 화면용).
 * 화면 컴포넌트에서 `if (!isLoggedIn) return <Redirect href="/(auth)/login" />;` 형태로 사용한다.
 * useEffect + router.replace 방식은 딥링크로 첫 진입 시 루트 레이아웃 마운트 전에 네비게이션을 시도해
 * "Attempted to navigate before mounting the Root Layout component" 에러가 나므로 쓰지 않는다.
 */
export function useIsLoggedIn(): boolean {
  return useAuthStore((state) => state.isLoggedIn);
}
