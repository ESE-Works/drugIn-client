import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubHeader from '@/components/layout/SubHeader';
import AnalysisHistory from '@/features/contracts/AnalysisHistory';
import { colors } from '@/constants';

export default function AnalysisHistoryScreen() {
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
