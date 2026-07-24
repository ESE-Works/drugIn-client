import { StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubHeader from '@/components/layout/SubHeader';
import AnalysisHistory from '@/features/contracts/AnalysisHistory';
import { useIsLoggedIn } from '@/lib/authGate';
import { colors } from '@/constants';

export default function AnalysisHistoryScreen() {
  const isLoggedIn = useIsLoggedIn();
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SubHeader title="분석 이력" />
      <AnalysisHistory />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
});
