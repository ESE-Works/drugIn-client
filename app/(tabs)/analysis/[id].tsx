import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubHeader from '@/components/layout/SubHeader';
import AnalysisDetail from '@/features/contracts/AnalysisDetail';
import { colors } from '@/constants';

export default function AnalysisDetailScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SubHeader title="분석 상세" />
      <AnalysisDetail />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
});
